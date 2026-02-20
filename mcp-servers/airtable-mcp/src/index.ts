/**
 * Airtable MCP Server — Entry Point
 *
 * Reads MODE env var to determine transport:
 *   MODE=stdio  (default) — for Claude Code, Claude Cowork, Claude.ai
 *   MODE=http             — for GCP Cloud Run (SSE transport)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOL_DEFINITIONS, handleTool } from "./tools.js";

/** Create and configure the MCP Server instance (shared between stdio and HTTP modes) */
export function createMcpServer(): Server {
  const server = new Server(
    {
      name: "airtable-gtm",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOL_DEFINITIONS };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      const result = await handleTool(name, (args ?? {}) as Record<string, unknown>);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: message }, null, 2),
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

async function main() {
  const mode = process.env.MODE ?? "stdio";

  if (mode === "http") {
    const port = parseInt(process.env.PORT ?? "8080", 10);
    // Dynamic import to avoid loading express in stdio mode
    const { startHttpServer } = await import("./server-http.js");
    startHttpServer(port);
  } else {
    // stdio mode (default)
    const server = createMcpServer();
    const transport = new StdioServerTransport();

    process.stderr.write("[airtable-mcp] Starting in stdio mode\n");

    await server.connect(transport);

    process.stderr.write("[airtable-mcp] Ready\n");
  }
}

main().catch((err) => {
  process.stderr.write(`[airtable-mcp] Fatal error: ${err}\n`);
  process.exit(1);
});
