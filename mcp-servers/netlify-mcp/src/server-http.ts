/**
 * Streamable HTTP MCP server for GCP Cloud Run deployment.
 *
 * Uses the modern Streamable HTTP transport (not legacy SSE).
 * Authless — Claude.ai/Cowork connects without OAuth.
 *
 * Endpoints:
 *   GET  /health  — liveness probe (returns {"status":"ok"})
 *   POST /mcp     — MCP message handler (Streamable HTTP)
 *   GET  /mcp     — SSE stream for server-initiated messages
 *   DELETE /mcp   — session cleanup
 */

import express, { Request, Response } from "express";
import crypto from "crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpServer } from "./index.js";
import { isInitializeRequest } from "./stream-utils.js";

export function startHttpServer(port: number): void {
  const app = express();
  app.use(express.json());

  // Active transports by session ID
  const transports = new Map<string, StreamableHTTPServerTransport>();

  // Health check for Cloud Run / load balancer
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      mode: "http",
      timestamp: new Date().toISOString(),
    });
  });

  // POST /mcp — handle MCP messages (initialize or ongoing session)
  app.post("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    // Existing session — route to its transport
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // New session — must be an initialize request
    if (!sessionId && isInitializeRequest(req.body)) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
      });

      const server: Server = createMcpServer();

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid) transports.delete(sid);
      };

      await server.connect(transport);

      // Store transport after connect (sessionId is assigned during handleRequest)
      await transport.handleRequest(req, res, req.body);

      const sid = transport.sessionId;
      if (sid) {
        transports.set(sid, transport);
      }
      return;
    }

    // Invalid request
    res.status(400).json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Bad Request: missing session ID or not an initialize request",
      },
      id: null,
    });
  });

  // GET /mcp — SSE stream for server-initiated messages
  app.get("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.handleRequest(req, res);
      return;
    }
    res.status(400).json({ error: "Missing or invalid session ID" });
  });

  // DELETE /mcp — session cleanup
  app.delete("/mcp", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && transports.has(sessionId)) {
      const transport = transports.get(sessionId)!;
      await transport.close();
      transports.delete(sessionId);
      res.status(200).json({ status: "session closed" });
      return;
    }
    res.status(404).json({ error: "Session not found" });
  });

  app.listen(port, () => {
    console.error(`[netlify-mcp] Streamable HTTP server listening on port ${port}`);
    console.error(`[netlify-mcp] MCP endpoint: http://localhost:${port}/mcp`);
    console.error(`[netlify-mcp] Health check: http://localhost:${port}/health`);
  });
}
