#!/usr/bin/env node

/**
 * Google Chat MCP Server — Streamable HTTP transport entry point.
 *
 * Exposes the MCP server at /mcp for remote connections from:
 * - claude.ai (Settings > Integrations) — via OAuth 2.1
 * - Claude Desktop (Settings > Integrations)
 * - Any MCP-compliant client
 *
 * Auth flow: OAuth 2.1 JWT only (static bearer token removed).
 * User identity from JWT `sub` claim is passed to createServer()
 * so each user gets their own Google Chat credentials from Firestore.
 *
 * Usage: node build/http.js
 * Env:   PORT=3456 (default), OAUTH_JWT_SECRET (JWT signing)
 */

// Load .env from project root (cwd) before any module reads process.env
import { config } from "dotenv";
config();

import express, { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./tools.js";
import {
  handleProtectedResourceMetadata,
  handleAuthServerMetadata,
  handleRegister,
  handleAuthorize,
  handleGoogleCallback,
  handleToken,
  verifyOAuthToken,
} from "./oauth-server.js";

const PORT = parseInt(process.env.PORT || "3456", 10);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// OAuth 2.1 well-known metadata (no auth)
// ---------------------------------------------------------------------------

app.get("/.well-known/oauth-protected-resource", handleProtectedResourceMetadata);
app.get("/.well-known/oauth-authorization-server", handleAuthServerMetadata);

// ---------------------------------------------------------------------------
// OAuth 2.1 endpoints (no auth)
// ---------------------------------------------------------------------------

app.post("/register", handleRegister);
app.get("/authorize", handleAuthorize);
app.get("/oauth/callback", handleGoogleCallback);
app.post("/token", handleToken);

// ---------------------------------------------------------------------------
// Auth middleware — protects /mcp endpoint (OAuth JWT only)
// ---------------------------------------------------------------------------

function requireAuth(req: Request, res: Response, next: () => void) {
  // No auth configured — skip (local dev)
  if (!process.env.OAUTH_JWT_SECRET) {
    return next();
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    res.status(401)
      .set("WWW-Authenticate", `Bearer resource_metadata="/.well-known/oauth-protected-resource"`)
      .json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Unauthorized — Bearer token required" },
        id: null,
      });
    return;
  }

  // Verify JWT and attach user email to request
  const payload = verifyOAuthToken(token);
  if (payload) {
    (req as any).userEmail = payload.sub as string;
    return next();
  }

  res.status(401)
    .set("WWW-Authenticate", `Bearer resource_metadata="/.well-known/oauth-protected-resource"`)
    .json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Unauthorized — invalid or expired token" },
      id: null,
    });
}

// ---------------------------------------------------------------------------
// MCP endpoint
// Stateless mode: create a new transport + connect per request.
// ---------------------------------------------------------------------------

app.post("/mcp", requireAuth, async (req: Request, res: Response) => {
  try {
    const userEmail = (req as any).userEmail || "";
    const server = createServer(userEmail);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("[Google Chat MCP] Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
});

app.get("/mcp", (_req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed. Use POST." },
      id: null,
    })
  );
});

app.delete("/mcp", (_req: Request, res: Response) => {
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    })
  );
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", server: "google-chat-mcp", transport: "streamable-http" });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`[Google Chat MCP] Streamable HTTP server listening on port ${PORT}`);
  console.log(`[Google Chat MCP] MCP endpoint: http://localhost:${PORT}/mcp`);
  console.log(`[Google Chat MCP] Health check: http://localhost:${PORT}/health`);
  if (process.env.OAUTH_JWT_SECRET) {
    console.log(`[Google Chat MCP] OAuth 2.1 enabled (JWT signing active)`);
  }
});
