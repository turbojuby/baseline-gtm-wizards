/**
 * Google Chat MCP Server — tool definitions.
 *
 * Defines all MCP tools for Google Chat API interaction.
 * Per-user auth: HTTP mode passes userEmail to chatApiRequest
 * so each user's own Google Chat credentials are used.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { chatApiRequest, validateCredentials } from "./auth.js";

// ============================================================
// Space allowlist — technical guardrail for send_message
// Only these spaces can receive agent-sent messages.
// ============================================================

const ALLOWED_SPACES = new Set([
  "spaces/AAQAUzk7yzk",  // Tyler Testing Ground
  "spaces/AAQAlgrSJ5Q",  // GTM Wizards
  "spaces/AAQAztA6fTY",  // Three Amigos
]);

// ============================================================
// Type helpers for API responses
// ============================================================

interface Space {
  name?: string;
  displayName?: string;
  type?: string;
  spaceType?: string;
  singleUserBotDm?: boolean;
  spaceThreadingState?: string;
  spaceDetails?: { description?: string; guidelines?: string };
  membershipCount?: number;
}

interface Message {
  name?: string;
  sender?: { name?: string; displayName?: string; type?: string };
  createTime?: string;
  text?: string;
  formattedText?: string;
  thread?: { name?: string };
  space?: { name?: string; displayName?: string };
  argumentText?: string;
}

interface Member {
  name?: string;
  member?: { name?: string; displayName?: string; type?: string };
  role?: string;
  state?: string;
  createTime?: string;
}

// ============================================================
// Server factory
// ============================================================

export function createServer(userEmail: string = ""): McpServer {
  const server = new McpServer({
    name: "Google Chat",
    version: "2.0.0",
  });

  // Warn on missing credentials at startup (stdio mode only)
  if (!userEmail) {
    const missing = validateCredentials();
    if (missing.length > 0) {
      console.error(
        `[Google Chat MCP] WARNING: Missing credentials: ${missing.join(", ")}. ` +
          `Tools will fail at runtime.`
      );
    }
  }

  // ----------------------------------------------------------
  // Space Management
  // ----------------------------------------------------------

  server.tool(
    "list_spaces",
    "List Google Chat spaces the user has access to. Returns space names, display names, types, and member counts.",
    {
      page_size: z.number().optional().describe("Max spaces to return (1-1000, default 100)"),
      filter: z.string().optional().describe("Filter expression (e.g. 'spaceType = \"SPACE\"')"),
      page_token: z.string().optional().describe("Page token for pagination"),
    },
    async ({ page_size, filter, page_token }) => {
      const params: Record<string, string> = {};
      if (page_size) params.pageSize = String(page_size);
      if (filter) params.filter = filter;
      if (page_token) params.pageToken = page_token;

      const data = (await chatApiRequest("GET", "spaces", undefined, params, userEmail)) as {
        spaces?: Space[];
        nextPageToken?: string;
      };

      const spaces = (data.spaces || []).map((s) => ({
        name: s.name,
        displayName: s.displayName,
        type: s.spaceType || s.type,
        membershipCount: s.membershipCount,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { spaces, nextPageToken: data.nextPageToken || null },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "get_space",
    "Get detailed information about a specific Google Chat space.",
    {
      space_name: z
        .string()
        .describe("The resource name of the space (e.g. 'spaces/AAAA1234567')"),
    },
    async ({ space_name }) => {
      const data = (await chatApiRequest("GET", space_name, undefined, undefined, userEmail)) as Space;
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "find_space_by_name",
    "Search for a Google Chat space by its display name. Lists all spaces and filters by name substring match.",
    {
      query: z.string().describe("Display name to search for (case-insensitive substring match)"),
    },
    async ({ query }) => {
      const allSpaces: Space[] = [];
      let pageToken: string | undefined;

      do {
        const params: Record<string, string> = { pageSize: "200" };
        if (pageToken) params.pageToken = pageToken;

        const data = (await chatApiRequest("GET", "spaces", undefined, params, userEmail)) as {
          spaces?: Space[];
          nextPageToken?: string;
        };

        if (data.spaces) allSpaces.push(...data.spaces);
        pageToken = data.nextPageToken;
      } while (pageToken);

      const lowerQuery = query.toLowerCase();
      const matches = allSpaces
        .filter((s) => s.displayName?.toLowerCase().includes(lowerQuery))
        .map((s) => ({
          name: s.name,
          displayName: s.displayName,
          type: s.spaceType || s.type,
          membershipCount: s.membershipCount,
        }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ matches, total: matches.length }, null, 2),
          },
        ],
      };
    }
  );

  // ----------------------------------------------------------
  // Message Management
  // ----------------------------------------------------------

  server.tool(
    "list_messages",
    "List recent messages in a Google Chat space. Returns message text, sender, and timestamps.",
    {
      space_name: z
        .string()
        .describe("The resource name of the space (e.g. 'spaces/AAAA1234567')"),
      page_size: z
        .number()
        .optional()
        .describe("Max messages to return (1-1000, default 25)"),
      order_by: z
        .string()
        .optional()
        .describe("Sort order (e.g. 'createTime desc' or 'createTime asc')"),
      filter: z
        .string()
        .optional()
        .describe("Filter expression (e.g. 'createTime > \"2024-01-01T00:00:00Z\"')"),
      page_token: z.string().optional().describe("Page token for pagination"),
    },
    async ({ space_name, page_size, order_by, filter, page_token }) => {
      const params: Record<string, string> = {};
      if (page_size) params.pageSize = String(page_size);
      if (order_by) params.orderBy = order_by;
      if (filter) params.filter = filter;
      if (page_token) params.pageToken = page_token;

      const data = (await chatApiRequest(
        "GET",
        `${space_name}/messages`,
        undefined,
        params,
        userEmail
      )) as { messages?: Message[]; nextPageToken?: string };

      const messages = (data.messages || []).map((m) => ({
        name: m.name,
        sender: m.sender?.displayName || m.sender?.name,
        senderType: m.sender?.type,
        text: m.text,
        createTime: m.createTime,
        threadName: m.thread?.name,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { messages, nextPageToken: data.nextPageToken || null },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "get_message",
    "Get a specific message by its resource name.",
    {
      message_name: z
        .string()
        .describe(
          "The resource name of the message (e.g. 'spaces/AAAA1234567/messages/BBBBB.CCCCC')"
        ),
    },
    async ({ message_name }) => {
      const data = (await chatApiRequest("GET", message_name, undefined, undefined, userEmail)) as Message;
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "send_message",
    "Send a text message to a Google Chat space. Supports plain text and Card v2 formatted messages.",
    {
      space_name: z
        .string()
        .describe("The resource name of the space (e.g. 'spaces/AAAA1234567')"),
      text: z.string().describe("The message text to send. Supports Google Chat formatting."),
      thread_name: z
        .string()
        .optional()
        .describe("Thread resource name to reply to (e.g. 'spaces/XXX/threads/YYY')"),
    },
    async ({ space_name, text, thread_name }) => {
      // Enforce space allowlist
      if (!ALLOWED_SPACES.has(space_name)) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: `Space ${space_name} is not in the allowlist. Allowed spaces: Tyler Testing Ground (spaces/AAQAUzk7yzk), GTM Wizards (spaces/AAQAlgrSJ5Q), Three Amigos (spaces/AAQAztA6fTY).`,
              }),
            },
          ],
        };
      }

      const body: Record<string, unknown> = { text };
      if (thread_name) {
        body.thread = { name: thread_name };
      }

      const params: Record<string, string> = {};
      if (thread_name) {
        params.messageReplyOption = "REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD";
      }

      const data = (await chatApiRequest(
        "POST",
        `${space_name}/messages`,
        body,
        Object.keys(params).length > 0 ? params : undefined,
        userEmail
      )) as Message;

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                sent: true,
                messageName: data.name,
                text: data.text,
                createTime: data.createTime,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "create_reaction",
    "Add an emoji reaction to a message.",
    {
      message_name: z
        .string()
        .describe("The resource name of the message to react to"),
      emoji: z
        .string()
        .describe("Unicode emoji character (e.g. '\ud83d\udc4d', '\u2764\ufe0f', '\ud83d\ude80')"),
    },
    async ({ message_name, emoji }) => {
      const body = { emoji: { unicode: emoji } };
      const data = await chatApiRequest("POST", `${message_name}/reactions`, body, undefined, userEmail);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "delete_message",
    "Delete a message from a Google Chat space.",
    {
      message_name: z
        .string()
        .describe("The resource name of the message to delete"),
    },
    async ({ message_name }) => {
      await chatApiRequest("DELETE", message_name, undefined, undefined, userEmail);
      return {
        content: [
          { type: "text" as const, text: JSON.stringify({ deleted: true, message: message_name }) },
        ],
      };
    }
  );

  // ----------------------------------------------------------
  // Member Management
  // ----------------------------------------------------------

  server.tool(
    "list_members",
    "List members of a Google Chat space. Returns member names, roles, and types.",
    {
      space_name: z
        .string()
        .describe("The resource name of the space (e.g. 'spaces/AAAA1234567')"),
      page_size: z.number().optional().describe("Max members to return (default 100)"),
      page_token: z.string().optional().describe("Page token for pagination"),
    },
    async ({ space_name, page_size, page_token }) => {
      const params: Record<string, string> = {};
      if (page_size) params.pageSize = String(page_size);
      if (page_token) params.pageToken = page_token;

      const data = (await chatApiRequest(
        "GET",
        `${space_name}/members`,
        undefined,
        params,
        userEmail
      )) as { memberships?: Member[]; nextPageToken?: string };

      const members = (data.memberships || []).map((m) => ({
        name: m.name,
        memberName: m.member?.name,
        displayName: m.member?.displayName,
        type: m.member?.type,
        role: m.role,
        state: m.state,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { members, nextPageToken: data.nextPageToken || null },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "get_member",
    "Get detailed information about a specific member in a space.",
    {
      member_name: z
        .string()
        .describe(
          "The resource name of the membership (e.g. 'spaces/AAAA1234567/members/123456789')"
        ),
    },
    async ({ member_name }) => {
      const data = await chatApiRequest("GET", member_name, undefined, undefined, userEmail);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ----------------------------------------------------------
  // Webhook (backward compatibility)
  // ----------------------------------------------------------

  server.tool(
    "send_webhook_message",
    "Send a message to a Google Chat space via an incoming webhook URL. " +
      "This is a simple fire-and-forget message — no auth needed, just the webhook URL. " +
      "Use this for notifications to spaces where you have a webhook URL configured.",
    {
      webhook_url: z
        .string()
        .url()
        .describe("The Google Chat incoming webhook URL"),
      text: z
        .string()
        .describe("The message text to send. Supports Google Chat link formatting: <URL|display text>"),
    },
    async ({ webhook_url, text }) => {
      const resp = await fetch(webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Webhook POST failed: ${resp.status} ${errText}`);
      }

      return {
        content: [
          { type: "text" as const, text: JSON.stringify({ sent: true, status: resp.status }) },
        ],
      };
    }
  );

  // ----------------------------------------------------------
  // Search
  // ----------------------------------------------------------

  server.tool(
    "search_messages",
    "Search for messages across Google Chat spaces. " +
      "Returns matching messages with their space, sender, and timestamp. " +
      "Useful for finding past conversations, decisions, or shared links.",
    {
      query: z.string().describe("Search query string"),
      spaces: z
        .array(z.string())
        .optional()
        .describe("List of space resource names to search within. If omitted, searches all accessible spaces."),
      page_size: z
        .number()
        .optional()
        .describe("Max results to return (default 25)"),
      page_token: z.string().optional().describe("Page token for pagination"),
      order_by: z.string().optional().describe("Sort order (e.g. 'createTime desc')"),
    },
    async ({ query, spaces, page_size, page_token, order_by }) => {
      const targetSpaces: string[] = spaces || [];

      if (targetSpaces.length === 0) {
        const spacesData = (await chatApiRequest("GET", "spaces", undefined, {
          pageSize: "100",
        }, userEmail)) as { spaces?: Space[] };
        if (spacesData.spaces) {
          for (const s of spacesData.spaces) {
            if (s.name) targetSpaces.push(s.name);
          }
        }
      }

      const allResults: Array<{
        messageName: string;
        spaceName: string;
        spaceDisplayName: string;
        sender: string;
        text: string;
        createTime: string;
      }> = [];

      const lowerQuery = query.toLowerCase();
      const limit = page_size || 25;

      for (const spaceName of targetSpaces) {
        if (allResults.length >= limit) break;

        try {
          const params: Record<string, string> = {
            pageSize: String(Math.min(limit * 2, 200)),
          };
          if (order_by) params.orderBy = order_by;
          else params.orderBy = "createTime desc";

          const data = (await chatApiRequest(
            "GET",
            `${spaceName}/messages`,
            undefined,
            params,
            userEmail
          )) as { messages?: Message[] };

          if (data.messages) {
            for (const m of data.messages) {
              if (allResults.length >= limit) break;
              if (m.text?.toLowerCase().includes(lowerQuery)) {
                allResults.push({
                  messageName: m.name || "",
                  spaceName: m.space?.name || spaceName,
                  spaceDisplayName: m.space?.displayName || spaceName,
                  sender: m.sender?.displayName || m.sender?.name || "Unknown",
                  text: m.text || "",
                  createTime: m.createTime || "",
                });
              }
            }
          }
        } catch (err) {
          console.error(`[Google Chat MCP] Error searching ${spaceName}: ${err}`);
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              { results: allResults, total: allResults.length, query },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  return server;
}
