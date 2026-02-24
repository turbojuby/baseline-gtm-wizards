/**
 * OAuth2 token management for Google Chat API.
 *
 * Per-user auth: HTTP mode uses per-user refresh tokens from Firestore.
 * Stdio mode falls back to GOOGLE_CHAT_REFRESH_TOKEN env var for local dev.
 */

import { getToken, saveToken } from "./token-store.js";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

// Read env vars lazily — ESM hoists imports before dotenv.config() runs
function getClientId() { return process.env.OAUTH_CLIENT_ID || process.env.GMAIL_CLIENT_ID || ""; }
function getClientSecret() { return process.env.OAUTH_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET || ""; }
function getStaticRefreshToken() { return process.env.GOOGLE_CHAT_REFRESH_TOKEN || ""; }

// ---------------------------------------------------------------------------
// Per-user token cache (in-memory, keyed by email)
// ---------------------------------------------------------------------------

const userTokenCache = new Map<string, { accessToken: string; expiresAt: number }>();

// Static token cache (stdio mode)
let staticTokenCache = { accessToken: "", expiresAt: 0 };

// ---------------------------------------------------------------------------
// Credential validation (stdio mode backward compat)
// ---------------------------------------------------------------------------

export function validateCredentials(): string[] {
  const missing: string[] = [];
  if (!getClientId()) missing.push("OAUTH_CLIENT_ID / GMAIL_CLIENT_ID");
  if (!getClientSecret()) missing.push("OAUTH_CLIENT_SECRET / GMAIL_CLIENT_SECRET");
  if (!getStaticRefreshToken()) missing.push("GOOGLE_CHAT_REFRESH_TOKEN (optional if using per-user OAuth)");
  return missing;
}

// ---------------------------------------------------------------------------
// Per-user access token (HTTP mode — tokens from Firestore)
// ---------------------------------------------------------------------------

/**
 * Get a valid Google Chat access token for a specific user.
 * Looks up their refresh token from Firestore, exchanges it for an access token.
 */
async function getAccessTokenForUser(email: string): Promise<string> {
  const now = Date.now() / 1000;

  // Check in-memory cache first
  const cached = userTokenCache.get(email);
  if (cached && now < cached.expiresAt - 60) {
    return cached.accessToken;
  }

  // Look up refresh token from Firestore
  const stored = await getToken(email, "google-chat");
  if (!stored?.refreshToken) {
    throw new Error(
      `No Google Chat token found for ${email}. Please reconnect to trigger the OAuth flow.`
    );
  }

  // Exchange refresh token for access token
  const accessToken = await exchangeRefreshToken(
    stored.refreshToken,
    email
  );

  return accessToken;
}

// ---------------------------------------------------------------------------
// Static access token (stdio mode — env var refresh token)
// ---------------------------------------------------------------------------

async function getAccessTokenStatic(): Promise<string> {
  const now = Date.now() / 1000;

  if (staticTokenCache.accessToken && now < staticTokenCache.expiresAt - 60) {
    return staticTokenCache.accessToken;
  }

  const refreshToken = getStaticRefreshToken();
  if (!refreshToken) {
    throw new Error(
      "[Google Chat MCP] GOOGLE_CHAT_REFRESH_TOKEN is empty — cannot authenticate. " +
        "Run: python3 scripts/refresh-google-tokens.py"
    );
  }

  const accessToken = await exchangeRefreshToken(refreshToken);
  return accessToken;
}

// ---------------------------------------------------------------------------
// Shared refresh token exchange logic
// ---------------------------------------------------------------------------

/**
 * Exchange a Google OAuth refresh token for an access token.
 * Retries up to 3 times with exponential backoff (except on invalid_grant).
 * Caches the result keyed by email (or in static cache if no email).
 */
async function exchangeRefreshToken(
  refreshToken: string,
  email?: string
): Promise<string> {
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const resp = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });

      if (resp.status === 400) {
        const data = (await resp.json()) as { error?: string; error_description?: string };
        if (data.error === "invalid_grant") {
          throw new Error(
            `[Google Chat MCP] OAuth refresh token expired or revoked for ${email || "static"}. ` +
              `Please reconnect. Detail: ${data.error_description || ""}`
          );
        }
      }

      if (!resp.ok) {
        throw new Error(`Token refresh failed: ${resp.status} ${await resp.text()}`);
      }

      const data = (await resp.json()) as { access_token: string; expires_in?: number };
      const now = Date.now() / 1000;
      const expiresAt = now + (data.expires_in || 3600);

      // Cache the token
      if (email) {
        userTokenCache.set(email, { accessToken: data.access_token, expiresAt });
      } else {
        staticTokenCache = { accessToken: data.access_token, expiresAt };
      }

      return data.access_token;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.message.includes("invalid_grant")) throw lastError;
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError || new Error("Token refresh failed after 3 attempts");
}

// ---------------------------------------------------------------------------
// Chat API request helper
// ---------------------------------------------------------------------------

/**
 * Make an authenticated request to the Google Chat API.
 * Uses per-user token if email is provided, static token otherwise.
 */
export async function chatApiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  path: string,
  body?: Record<string, unknown>,
  queryParams?: Record<string, string>,
  userEmail?: string
): Promise<unknown> {
  const token = userEmail
    ? await getAccessTokenForUser(userEmail)
    : await getAccessTokenStatic();

  const base = "https://chat.googleapis.com/v1";

  let url = `${base}/${path}`;
  if (queryParams) {
    const params = new URLSearchParams(queryParams);
    url += `?${params.toString()}`;
  }

  const resp = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Google Chat API ${method} ${path} failed: ${resp.status} ${errText}`);
  }

  const text = await resp.text();
  return text ? JSON.parse(text) : {};
}
