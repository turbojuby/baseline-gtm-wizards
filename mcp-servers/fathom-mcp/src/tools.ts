/**
 * Fathom MCP Server — tool definitions.
 *
 * Exposes Fathom.video API as MCP tools: list meetings, get transcript, get summary.
 *
 * Per-user auth: HTTP mode uses per-user OAuth tokens from Firestore.
 * Stdio mode falls back to FATHOM_API_KEY env var for local dev.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getToken, saveToken } from "./token-store.js";

const BASE_URL = "https://api.fathom.ai/external/v1";

// ---------------------------------------------------------------------------
// Fathom OAuth token management
// ---------------------------------------------------------------------------

function getFathomClientId() { return process.env.FATHOM_CLIENT_ID || ""; }
function getFathomClientSecret() { return process.env.FATHOM_CLIENT_SECRET || ""; }

/**
 * Get a valid Fathom access token for a user.
 * HTTP mode: per-user token from Firestore.
 * Stdio mode (no email): FATHOM_API_KEY env var.
 */
async function getUserFathomToken(userEmail: string): Promise<{ token: string; isApiKey: boolean }> {
  // Stdio mode / local dev — use static API key
  if (!userEmail) {
    const apiKey = process.env.FATHOM_API_KEY || "";
    if (!apiKey) throw new Error("No user email and FATHOM_API_KEY not set");
    return { token: apiKey, isApiKey: true };
  }

  // HTTP mode — look up per-user token from Firestore
  const stored = await getToken(userEmail, "fathom");
  if (!stored) {
    throw new Error(
      `No Fathom token found for ${userEmail}. Please reconnect to trigger the Fathom OAuth flow.`
    );
  }

  // Check if token is expired (with 60s buffer)
  const now = Date.now() / 1000;
  if (stored.expiresAt && now >= stored.expiresAt - 60) {
    if (!stored.refreshToken) {
      throw new Error(
        `Fathom token expired for ${userEmail} and no refresh token available. Please reconnect.`
      );
    }
    const refreshed = await refreshFathomToken(stored.refreshToken);
    await saveToken(userEmail, "fathom", refreshed);
    return { token: refreshed.accessToken, isApiKey: false };
  }

  return { token: stored.accessToken, isApiKey: false };
}

/**
 * Refresh a Fathom OAuth token.
 */
async function refreshFathomToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}> {
  const resp = await fetch("https://fathom.video/external/v1/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getFathomClientId(),
      client_secret: getFathomClientSecret(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Fathom token refresh failed: ${resp.status} ${errText}`);
  }

  const data = (await resp.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
  };
}

// ---------------------------------------------------------------------------
// Fathom API request helper
// ---------------------------------------------------------------------------

/**
 * Make an authenticated request to the Fathom API.
 * Uses Bearer token for OAuth, X-Api-Key for static API keys.
 */
async function fathomRequest(
  userEmail: string,
  method: string,
  path: string,
  params?: Record<string, string>
): Promise<unknown> {
  const { token, isApiKey } = await getUserFathomToken(userEmail);

  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (isApiKey) {
    headers["X-Api-Key"] = token;
  } else {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(url.toString(), { method, headers });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Fathom API ${method} ${path} failed: ${resp.status} ${errText}`);
  }

  return resp.json();
}

// ---------------------------------------------------------------------------
// Server factory
// ---------------------------------------------------------------------------

export function createServer(userEmail: string = ""): McpServer {
  const server = new McpServer({
    name: "Fathom",
    version: "2.0.0",
  });

  if (!userEmail && !process.env.FATHOM_API_KEY) {
    console.error("[Fathom MCP] WARNING: No user email and FATHOM_API_KEY not set. Tools will fail at runtime.");
  }

  // ----------------------------------------------------------
  // list_meetings
  // ----------------------------------------------------------

  server.tool(
    "list_meetings",
    "List recent Fathom meetings with optional date filters. Returns meeting metadata including titles, dates, attendees, and optionally transcripts/summaries/action items.",
    {
      created_after: z.string().optional().describe("ISO 8601 timestamp — only meetings created after this date"),
      created_before: z.string().optional().describe("ISO 8601 timestamp — only meetings created before this date"),
      include_transcript: z.boolean().optional().describe("Include full transcript in response (default false)"),
      include_summary: z.boolean().optional().describe("Include AI-generated summary in response (default false)"),
      include_action_items: z.boolean().optional().describe("Include action items in response (default false)"),
      cursor: z.string().optional().describe("Pagination cursor from a previous response"),
    },
    async ({ created_after, created_before, include_transcript, include_summary, include_action_items, cursor }) => {
      const params: Record<string, string> = {};
      if (created_after) params.created_after = created_after;
      if (created_before) params.created_before = created_before;
      if (include_transcript) params.include_transcript = "true";
      if (include_summary) params.include_summary = "true";
      if (include_action_items) params.include_action_items = "true";
      if (cursor) params.cursor = cursor;

      const data = await fathomRequest(userEmail, "GET", "/meetings", params);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ----------------------------------------------------------
  // get_transcript
  // ----------------------------------------------------------

  server.tool(
    "get_transcript",
    "Get the full transcript of a Fathom recording. Returns timestamped speaker-attributed transcript segments.",
    {
      recording_id: z.string().describe("The recording ID (from list_meetings response)"),
    },
    async ({ recording_id }) => {
      const data = await fathomRequest(userEmail, "GET", `/recordings/${recording_id}/transcript`);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  // ----------------------------------------------------------
  // get_summary
  // ----------------------------------------------------------

  server.tool(
    "get_summary",
    "Get the AI-generated summary of a Fathom recording. Returns structured summary with key points, decisions, and action items.",
    {
      recording_id: z.string().describe("The recording ID (from list_meetings response)"),
    },
    async ({ recording_id }) => {
      const data = await fathomRequest(userEmail, "GET", `/recordings/${recording_id}/summary`);

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  return server;
}
