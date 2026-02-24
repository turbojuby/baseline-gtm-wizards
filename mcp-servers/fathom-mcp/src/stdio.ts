#!/usr/bin/env node

/**
 * Fathom MCP Server — stdio transport entry point.
 *
 * Use this for local Claude Code (.mcp.json) and Claude Desktop
 * (claude_desktop_config.json) connections.
 *
 * In stdio mode, uses FATHOM_API_KEY from env (single-user local dev).
 *
 * Usage: node build/stdio.js
 */

// Load .env from project root (cwd) before any module reads process.env
import { config } from "dotenv";
config();

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./tools.js";

async function main() {
  const server = createServer(); // No userEmail → falls back to FATHOM_API_KEY
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[Fathom MCP] stdio server running");
}

main().catch((err) => {
  console.error("[Fathom MCP] Fatal error:", err);
  process.exit(1);
});
