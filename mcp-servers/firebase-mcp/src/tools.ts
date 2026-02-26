/**
 * MCP tool definitions and handlers for Firebase Hosting deployments.
 *
 * Tools:
 *   deploy_to_hub   — Deploy HTML to hub.baselinepayments.com/d/{hex}
 *   deploy_draft    — Deploy HTML as a draft to a Firebase preview channel (7-day TTL)
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { deployToHub, deployDraft } from "./firebase.js";

// ─── Tool definitions ────────────────────────────────────────────────────────

export const TOOL_DEFINITIONS: Tool[] = [
  {
    name: "deploy_to_hub",
    description:
      "Deploy an HTML file to hub.baselinepayments.com/d/{hex} (production, prospect-facing). " +
      "Preserves all existing /d/ paths on the site. Returns an unguessable URL on the branded domain.",
    inputSchema: {
      type: "object",
      properties: {
        html_content: {
          type: "string",
          description: "The full HTML content to deploy",
        },
        description: {
          type: "string",
          description:
            "Brief description of what is being deployed (e.g. 'Lululemon teaser deck')",
        },
      },
      required: ["html_content", "description"],
    },
  },
  {
    name: "deploy_draft",
    description:
      "Deploy an HTML file as a draft to a Firebase preview channel for internal review. " +
      "Returns a preview URL (expires after 7 days). Use this before promoting to production.",
    inputSchema: {
      type: "object",
      properties: {
        html_content: {
          type: "string",
          description: "The full HTML content to deploy",
        },
        description: {
          type: "string",
          description:
            "Brief description of what is being deployed (e.g. 'Acme ROI calculator draft')",
        },
      },
      required: ["html_content", "description"],
    },
  },
];

// ─── Tool handlers ───────────────────────────────────────────────────────────

type ToolInput = Record<string, unknown>;

export async function handleTool(
  name: string,
  input: ToolInput
): Promise<unknown> {
  switch (name) {
    case "deploy_to_hub": {
      const { html_content, description } = input as {
        html_content: string;
        description: string;
      };
      if (!html_content || typeof html_content !== "string") {
        throw new Error("html_content must be a non-empty string");
      }
      return deployToHub(html_content, description ?? "");
    }

    case "deploy_draft": {
      const { html_content, description } = input as {
        html_content: string;
        description: string;
      };
      if (!html_content || typeof html_content !== "string") {
        throw new Error("html_content must be a non-empty string");
      }
      return deployDraft(html_content, description ?? "");
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
