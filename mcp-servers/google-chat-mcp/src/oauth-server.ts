/**
 * OAuth 2.1 Authorization Server for Google Chat MCP.
 *
 * Implements the MCP OAuth 2.1 spec (RFC 8414 + PKCE + DCR) so Claude.ai
 * can connect via its custom connector flow.
 *
 * Identity verification is proxied through Google OAuth. Unlike the old version
 * which only requested "openid email" and discarded the token, this version
 * requests full Chat API scopes so each user gets their own Google Chat
 * credentials stored in Firestore.
 */

import crypto from "node:crypto";
import { Request, Response } from "express";
import { saveToken } from "./token-store.js";

// ---------------------------------------------------------------------------
// Lazy env readers (ESM hoisting — same pattern as auth.ts)
// ---------------------------------------------------------------------------
function getClientId() { return process.env.OAUTH_CLIENT_ID || process.env.GMAIL_CLIENT_ID || ""; }
function getClientSecret() { return process.env.OAUTH_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET || ""; }
function getJwtSecret() { return process.env.OAUTH_JWT_SECRET || ""; }
function getServerUrl() { return process.env.MCP_SERVER_URL || ""; }

const ALLOWED_DOMAIN = "baselinepayments.com";
const AUTH_CODE_TTL = 5 * 60 * 1000;   // 5 minutes
const ACCESS_TOKEN_TTL = 3600;          // 1 hour (seconds)
const REFRESH_TOKEN_TTL = 30 * 24 * 3600; // 30 days (seconds)

// Google OAuth scopes: identity + Chat API
const GOOGLE_SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/chat.spaces.readonly",
  "https://www.googleapis.com/auth/chat.messages",
  "https://www.googleapis.com/auth/chat.messages.create",
  "https://www.googleapis.com/auth/chat.memberships.readonly",
].join(" ");

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

const clients = new Map<string, ClientRegistration>();
const authCodes = new Map<string, AuthCodeData>();
const pendingFlows = new Map<string, PendingGoogleFlow>();

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
// Well-known metadata
// ---------------------------------------------------------------------------

export function handleProtectedResourceMetadata(_req: Request, res: Response) {
  const serverUrl = getServerUrl();
  res.json({
    resource: serverUrl,
    authorization_servers: [serverUrl],
    bearer_methods_supported: ["header"],
    scopes_supported: ["google-chat"],
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
    scopes_supported: ["google-chat"],
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
// Authorization endpoint — redirect to Google login with Chat API scopes
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
    scope: scope || "google-chat",
  });

  // Redirect to Google OAuth consent — now with Chat API scopes
  const serverUrl = getServerUrl();
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", getClientId());
  googleAuthUrl.searchParams.set("redirect_uri", `${serverUrl}/oauth/callback`);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", GOOGLE_SCOPES);
  googleAuthUrl.searchParams.set("state", googleState);
  googleAuthUrl.searchParams.set("access_type", "offline");  // Get refresh token
  googleAuthUrl.searchParams.set("prompt", "consent");        // Force consent to ensure refresh token

  res.redirect(googleAuthUrl.toString());
}

// ---------------------------------------------------------------------------
// Google OAuth callback — verify email, store Chat tokens in Firestore
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

  // Exchange Google auth code for tokens — now we get access_token + refresh_token too
  const serverUrl = getServerUrl();
  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getClientId(),
      client_secret: getClientSecret(),
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

  const tokenData = await tokenResp.json() as {
    id_token?: string;
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };

  if (!tokenData.id_token) {
    res.status(502).send("Google did not return an ID token.");
    return;
  }

  // Decode the ID token for email verification
  const idPayload = JSON.parse(
    Buffer.from(tokenData.id_token.split(".")[1], "base64url").toString()
  ) as { email?: string; email_verified?: boolean };

  const email = idPayload.email || "";
  if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
    console.warn(`[OAuth] Rejected login from ${email} (not @${ALLOWED_DOMAIN})`);
    res.status(403).send(`Access denied. Only @${ALLOWED_DOMAIN} accounts are allowed.`);
    return;
  }

  console.log(`[OAuth] Google identity verified: ${email}`);

  // Store the user's Google tokens in Firestore for Chat API access
  if (tokenData.refresh_token) {
    await saveToken(email, "google-chat", {
      accessToken: tokenData.access_token || "",
      refreshToken: tokenData.refresh_token,
      expiresAt: Math.floor(Date.now() / 1000) + (tokenData.expires_in || 3600),
      updatedAt: Date.now(),
    });
    console.log(`[OAuth] Google Chat tokens stored for ${email}`);
  } else {
    console.warn(`[OAuth] No refresh_token returned for ${email} — user may need to re-consent`);
  }

  // Generate our authorization code and redirect back to Claude.ai
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
    scope: "google-chat",
    type: "access",
  }, secret);

  const refreshToken = signJWT({
    sub: codeData.email,
    iss: getServerUrl(),
    iat: now,
    exp: now + REFRESH_TOKEN_TTL,
    scope: "google-chat",
    type: "refresh",
  }, secret);

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL,
    refresh_token: refreshToken,
    scope: "google-chat",
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
    scope: "google-chat",
    type: "access",
  }, secret);

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL,
    scope: "google-chat",
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
