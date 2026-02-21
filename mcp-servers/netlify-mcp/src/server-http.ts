/**
 * HTTP/SSE MCP server for GCP Cloud Run deployment.
 *
 * Endpoints:
 *   GET  /health    — liveness probe (returns {"status":"ok"})
 *   GET  /sse       — SSE stream; client connects, receives endpoint URL
 *   POST /messages  — MCP message handler (session ID from query param)
 */

import express, { Request, Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createMcpServer } from "./index.js";

export function startHttpServer(port: number): void {
  const app = express();
  app.use(express.json());

  // Active transports by session ID
  const transports = new Map<string, SSEServerTransport>();

  // Health check for Cloud Run / load balancer
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", mode: "http", timestamp: new Date().toISOString() });
  });

  // SSE endpoint — client connects here to establish a session
  app.get("/sse", async (req: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    const server: Server = createMcpServer();

    const sessionId = transport.sessionId;
    transports.set(sessionId, transport);

    transport.onclose = () => {
      transports.delete(sessionId);
    };

    await server.connect(transport);
  });

  // Message endpoint — client POSTs MCP messages here
  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.get(sessionId);

    if (!transport) {
      res.status(404).json({ error: `No active session: ${sessionId}` });
      return;
    }

    await transport.handlePostMessage(req, res);
  });

  app.listen(port, () => {
    console.error(`[netlify-mcp] HTTP/SSE server listening on port ${port}`);
    console.error(`[netlify-mcp] SSE endpoint: http://localhost:${port}/sse`);
    console.error(`[netlify-mcp] Health check: http://localhost:${port}/health`);
  });
}
