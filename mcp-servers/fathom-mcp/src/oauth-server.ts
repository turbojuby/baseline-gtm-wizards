/**
 * OAuth 2.1 Authorization Server for Fathom MCP.
 *
 * Implements the MCP OAuth 2.1 spec (RFC 8414 + PKCE + DCR) so Claude.ai
 * can connect via its custom connector flow.
 *
 * Chained OAuth flow:
 * 1. Claude.ai → /authorize → Google OAuth (identity check)
 * 2. Google callback → verify email domain
 * 3. Check Firestore for existing Fathom token:
 *    a. If exists → issue auth code, redirect to Claude.ai
 *    b. If not → redirect to Fathom OAuth for user consent
 * 4. Fathom callback → store tokens in Firestore → redirect to Claude.ai
 */

import crypto from "node:crypto";
import { Request, Response } from "express";
import { getToken, saveToken } from "./token-store.js";

// ---------------------------------------------------------------------------
// Lazy env readers (ESM hoisting — read at call time, not import time)
// ---------------------------------------------------------------------------
function getGoogleClientId() { return process.env.OAUTH_CLIENT_ID || ""; }
function getGoogleClientSecret() { return process.env.OAUTH_CLIENT_SECRET || ""; }
function getFathomClientId() { return process.env.FATHOM_CLIENT_ID || ""; }
function getFathomClientSecret() { return process.env.FATHOM_CLIENT_SECRET || ""; }
function getJwtSecret() { return process.env.OAUTH_JWT_SECRET || ""; }
function getServerUrl() { return process.env.MCP_SERVER_URL || ""; }

const ALLOWED_DOMAINS = ["baselinepayments.com", "hernandocapital.co"];
const AUTH_CODE_TTL = 5 * 60 * 1000;   // 5 minutes
const ACCESS_TOKEN_TTL = 3600;          // 1 hour (seconds)
const REFRESH_TOKEN_TTL = 30 * 24 * 3600; // 30 days (seconds)

// Fathom OAuth endpoints (ref: https://developers.fathom.ai/sdks/oauth)
const FATHOM_AUTHORIZE_URL = "https://fathom.video/external/v1/oauth2/authorize";
const FATHOM_TOKEN_URL = "https://fathom.video/external/v1/oauth2/token";

// ---------------------------------------------------------------------------
// In-memory stores (ephemeral — Cloud Run scale-to-zero is fine,
// Claude.ai re-registers transparently via DCR)
// ---------------------------------------------------------------------------

interface ClientRegistration {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  created_at: number;
}

interface AuthCodeData {
  code: string;
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: string;
  email: string;
  expires_at: number;
}

interface PendingGoogleFlow {
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: string;
  original_state: string;
  scope: string;
}

interface PendingFathomFlow {
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: string;
  original_state: string;
  scope: string;
  email: string; // Already verified via Google
}

const clients = new Map<string, ClientRegistration>();
const authCodes = new Map<string, AuthCodeData>();
const pendingFlows = new Map<string, PendingGoogleFlow>();
const pendingFathomFlows = new Map<string, PendingFathomFlow>();

// ---------------------------------------------------------------------------
// JWT helpers (HMAC-SHA256, zero dependencies)
// ---------------------------------------------------------------------------

function base64url(buf: Buffer): string {
  return buf.toString("base64url");
}

function signJWT(payload: Record<string, unknown>, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const segments = [
    base64url(Buffer.from(JSON.stringify(header))),
    base64url(Buffer.from(JSON.stringify(payload))),
  ];
  const signature = crypto
    .createHmac("sha256", secret)
    .update(segments.join("."))
    .digest();
  segments.push(base64url(signature));
  return segments.join(".");
}

function verifyJWT(token: string, secret: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const sigInput = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac("sha256", secret).update(sigInput).digest();
  const actual = Buffer.from(parts[2], "base64url");
  if (!crypto.timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (payload.exp && payload.exp < Date.now() / 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// PKCE helper
// ---------------------------------------------------------------------------

function validatePKCE(verifier: string, challenge: string): boolean {
  const computed = base64url(crypto.createHash("sha256").update(verifier).digest());
  return computed === challenge;
}

function generateRandom(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

// ---------------------------------------------------------------------------
// Helper: Issue auth code and redirect back to Claude.ai
// ---------------------------------------------------------------------------

function issueAuthCodeAndRedirect(
  res: Response,
  flow: { client_id: string; redirect_uri: string; code_challenge: string; code_challenge_method: string; original_state: string },
  email: string
) {
  const authCode = generateRandom(32);
  authCodes.set(authCode, {
    code: authCode,
    client_id: flow.client_id,
    redirect_uri: flow.redirect_uri,
    code_challenge: flow.code_challenge,
    code_challenge_method: flow.code_challenge_method,
    email,
    expires_at: Date.now() + AUTH_CODE_TTL,
  });

  const callbackUrl = new URL(flow.redirect_uri);
  callbackUrl.searchParams.set("code", authCode);
  if (flow.original_state) {
    callbackUrl.searchParams.set("state", flow.original_state);
  }

  res.redirect(callbackUrl.toString());
}

// ---------------------------------------------------------------------------
// Well-known metadata
// ---------------------------------------------------------------------------

export function handleProtectedResourceMetadata(_req: Request, res: Response) {
  const serverUrl = getServerUrl();
  res.json({
    resource: serverUrl,
    authorization_servers: [serverUrl],
    bearer_methods_supported: ["header"],
    scopes_supported: ["fathom"],
  });
}

export function handleAuthServerMetadata(_req: Request, res: Response) {
  const serverUrl = getServerUrl();
  res.json({
    issuer: serverUrl,
    authorization_endpoint: `${serverUrl}/authorize`,
    token_endpoint: `${serverUrl}/token`,
    registration_endpoint: `${serverUrl}/register`,
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "none"],
    scopes_supported: ["fathom"],
  });
}

// ---------------------------------------------------------------------------
// Dynamic Client Registration (DCR)
// ---------------------------------------------------------------------------

export function handleRegister(req: Request, res: Response) {
  const { redirect_uris, client_name } = req.body || {};
  if (!redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    res.status(400).json({ error: "invalid_client_metadata", error_description: "redirect_uris required" });
    return;
  }

  const client_id = generateRandom(16);
  const client_secret = generateRandom(32);
  const reg: ClientRegistration = { client_id, client_secret, redirect_uris, created_at: Date.now() };
  clients.set(client_id, reg);

  console.log(`[OAuth] Registered client ${client_id} (${client_name || "unnamed"})`);

  res.status(201).json({
    client_id,
    client_secret,
    redirect_uris,
    client_name: client_name || "",
    token_endpoint_auth_method: "client_secret_post",
  });
}

// ---------------------------------------------------------------------------
// Authorization endpoint — redirect to Google login
// ---------------------------------------------------------------------------

export function handleAuthorize(req: Request, res: Response) {
  const {
    response_type,
    client_id,
    redirect_uri,
    state,
    code_challenge,
    code_challenge_method,
    scope,
  } = req.query as Record<string, string>;

  if (response_type !== "code") {
    res.status(400).json({ error: "unsupported_response_type" });
    return;
  }
  const client = clients.get(client_id);
  if (!client) {
    res.status(400).json({ error: "invalid_client", error_description: "Unknown client_id — re-register" });
    return;
  }
  if (!client.redirect_uris.includes(redirect_uri)) {
    res.status(400).json({ error: "invalid_request", error_description: "redirect_uri not registered" });
    return;
  }
  if (!code_challenge || code_challenge_method !== "S256") {
    res.status(400).json({ error: "invalid_request", error_description: "PKCE S256 required" });
    return;
  }

  // Store the Claude.ai flow params so we can resume after Google callback
  const googleState = generateRandom(16);
  pendingFlows.set(googleState, {
    client_id,
    redirect_uri,
    code_challenge,
    code_challenge_method,
    original_state: state || "",
    scope: scope || "fathom",
  });

  // Redirect to Google OAuth consent (identity check only)
  const serverUrl = getServerUrl();
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", getGoogleClientId());
  googleAuthUrl.searchParams.set("redirect_uri", `${serverUrl}/oauth/callback`);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email");
  googleAuthUrl.searchParams.set("state", googleState);
  googleAuthUrl.searchParams.set("access_type", "online");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  res.redirect(googleAuthUrl.toString());
}

// ---------------------------------------------------------------------------
// Google OAuth callback — verify identity, then chain to Fathom OAuth
// ---------------------------------------------------------------------------

export async function handleGoogleCallback(req: Request, res: Response) {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    res.status(400).send(`Google OAuth error: ${error}`);
    return;
  }

  const flow = pendingFlows.get(state);
  if (!flow) {
    res.status(400).send("Invalid or expired OAuth state. Please try connecting again.");
    return;
  }
  pendingFlows.delete(state);

  // Exchange Google auth code for tokens (we only need the ID token for email)
  const serverUrl = getServerUrl();
  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      redirect_uri: `${serverUrl}/oauth/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    console.error("[OAuth] Google token exchange failed:", errText);
    res.status(502).send("Failed to verify your Google identity. Please try again.");
    return;
  }

  const tokenData = await tokenResp.json() as { id_token?: string };
  if (!tokenData.id_token) {
    res.status(502).send("Google did not return an ID token.");
    return;
  }

  // Decode the ID token (we don't need to fully verify it — Google just issued
  // it to us in a direct server-to-server exchange over HTTPS)
  const idPayload = JSON.parse(
    Buffer.from(tokenData.id_token.split(".")[1], "base64url").toString()
  ) as { email?: string; email_verified?: boolean };

  const email = idPayload.email || "";
  const emailDomain = email.split("@")[1] || "";
  if (!ALLOWED_DOMAINS.includes(emailDomain)) {
    console.warn(`[OAuth] Rejected login from ${email} (not in allowed domains)`);
    res.status(403).send(`Access denied. Only @${ALLOWED_DOMAINS.join(" / @")} accounts are allowed.`);
    return;
  }

  console.log(`[OAuth] Google identity verified: ${email}`);

  // Check if user already has a Fathom token in Firestore
  const existingToken = await getToken(email, "fathom");
  if (existingToken && existingToken.accessToken) {
    console.log(`[OAuth] Existing Fathom token found for ${email} — skipping Fathom OAuth`);
    issueAuthCodeAndRedirect(res, flow, email);
    return;
  }

  // No Fathom token — chain to Fathom OAuth
  console.log(`[OAuth] No Fathom token for ${email} — redirecting to Fathom OAuth`);

  const fathomState = generateRandom(16);
  pendingFathomFlows.set(fathomState, {
    client_id: flow.client_id,
    redirect_uri: flow.redirect_uri,
    code_challenge: flow.code_challenge,
    code_challenge_method: flow.code_challenge_method,
    original_state: flow.original_state,
    scope: flow.scope,
    email,
  });

  const fathomAuthUrl = new URL(FATHOM_AUTHORIZE_URL);
  fathomAuthUrl.searchParams.set("client_id", getFathomClientId());
  fathomAuthUrl.searchParams.set("redirect_uri", `${serverUrl}/fathom/callback`);
  fathomAuthUrl.searchParams.set("response_type", "code");
  fathomAuthUrl.searchParams.set("scope", "public_api");
  fathomAuthUrl.searchParams.set("state", fathomState);

  res.redirect(fathomAuthUrl.toString());
}

// ---------------------------------------------------------------------------
// Fathom OAuth callback — exchange code for tokens, store, complete flow
// ---------------------------------------------------------------------------

export async function handleFathomCallback(req: Request, res: Response) {
  const { code, state, error } = req.query as Record<string, string>;

  if (error) {
    res.status(400).send(`Fathom OAuth error: ${error}`);
    return;
  }

  const flow = pendingFathomFlows.get(state);
  if (!flow) {
    res.status(400).send("Invalid or expired Fathom OAuth state. Please try connecting again.");
    return;
  }
  pendingFathomFlows.delete(state);

  // Exchange Fathom auth code for tokens
  const serverUrl = getServerUrl();
  const tokenResp = await fetch(FATHOM_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getFathomClientId(),
      client_secret: getFathomClientSecret(),
      redirect_uri: `${serverUrl}/fathom/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResp.ok) {
    const errText = await tokenResp.text();
    console.error("[OAuth] Fathom token exchange failed:", errText);
    res.status(502).send("Failed to connect your Fathom account. Please try again.");
    return;
  }

  const fathomTokens = (await tokenResp.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
  };

  // Store Fathom tokens in Firestore
  await saveToken(flow.email, "fathom", {
    accessToken: fathomTokens.access_token,
    refreshToken: fathomTokens.refresh_token || "",
    expiresAt: Math.floor(Date.now() / 1000) + (fathomTokens.expires_in || 3600),
    updatedAt: Date.now(),
  });

  console.log(`[OAuth] Fathom token stored for ${flow.email}`);

  // Resume the Claude.ai OAuth flow — issue our auth code and redirect back
  issueAuthCodeAndRedirect(res, flow, flow.email);
}

// ---------------------------------------------------------------------------
// Token endpoint — exchange auth code (with PKCE) or refresh token for JWT
// ---------------------------------------------------------------------------

export function handleToken(req: Request, res: Response) {
  const { grant_type } = req.body || {};

  if (grant_type === "authorization_code") {
    return handleAuthCodeExchange(req, res);
  }
  if (grant_type === "refresh_token") {
    return handleRefreshTokenExchange(req, res);
  }

  res.status(400).json({ error: "unsupported_grant_type" });
}

function handleAuthCodeExchange(req: Request, res: Response) {
  const { code, redirect_uri, code_verifier, client_id, client_secret } = req.body || {};

  const codeData = authCodes.get(code);
  if (!codeData) {
    res.status(400).json({ error: "invalid_grant", error_description: "Invalid or expired authorization code" });
    return;
  }

  // Single use
  authCodes.delete(code);

  // Check expiry
  if (Date.now() > codeData.expires_at) {
    res.status(400).json({ error: "invalid_grant", error_description: "Authorization code expired" });
    return;
  }

  // Validate client
  if (client_id && codeData.client_id !== client_id) {
    res.status(400).json({ error: "invalid_client" });
    return;
  }

  // Validate redirect_uri matches
  if (redirect_uri && redirect_uri !== codeData.redirect_uri) {
    res.status(400).json({ error: "invalid_grant", error_description: "redirect_uri mismatch" });
    return;
  }

  // PKCE verification
  if (!code_verifier || !validatePKCE(code_verifier, codeData.code_challenge)) {
    res.status(400).json({ error: "invalid_grant", error_description: "PKCE verification failed" });
    return;
  }

  // Optionally verify client_secret if provided
  if (client_secret) {
    const client = clients.get(codeData.client_id);
    if (client && client.client_secret !== client_secret) {
      res.status(401).json({ error: "invalid_client" });
      return;
    }
  }

  const now = Math.floor(Date.now() / 1000);
  const secret = getJwtSecret();

  const accessToken = signJWT({
    sub: codeData.email,
    iss: getServerUrl(),
    iat: now,
    exp: now + ACCESS_TOKEN_TTL,
    scope: "fathom",
    type: "access",
  }, secret);

  const refreshToken = signJWT({
    sub: codeData.email,
    iss: getServerUrl(),
    iat: now,
    exp: now + REFRESH_TOKEN_TTL,
    scope: "fathom",
    type: "refresh",
  }, secret);

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL,
    refresh_token: refreshToken,
    scope: "fathom",
  });
}

function handleRefreshTokenExchange(req: Request, res: Response) {
  const { refresh_token } = req.body || {};
  const secret = getJwtSecret();

  const payload = verifyJWT(refresh_token, secret);
  if (!payload || payload.type !== "refresh") {
    res.status(400).json({ error: "invalid_grant", error_description: "Invalid or expired refresh token" });
    return;
  }

  const now = Math.floor(Date.now() / 1000);

  const accessToken = signJWT({
    sub: payload.sub,
    iss: getServerUrl(),
    iat: now,
    exp: now + ACCESS_TOKEN_TTL,
    scope: "fathom",
    type: "access",
  }, secret);

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL,
    scope: "fathom",
  });
}

// ---------------------------------------------------------------------------
// Token verification (used by auth middleware in http.ts)
// ---------------------------------------------------------------------------

export function verifyOAuthToken(token: string): Record<string, unknown> | null {
  const secret = getJwtSecret();
  if (!secret) return null;
  const payload = verifyJWT(token, secret);
  if (!payload || payload.type !== "access") return null;
  return payload;
}
