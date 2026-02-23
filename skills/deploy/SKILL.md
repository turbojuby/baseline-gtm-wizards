---
description: Deploy an HTML file to hub.baselinepayments.com (production) or a quick-share draft URL (internal review).
---

# /gtm:deploy

Deploy an HTML file to hub.baselinepayments.com (production, prospect-facing) or to a quick-share draft URL (internal review). Uses the `netlify-gtm` MCP server — no CLI required, works in Claude Code and Claude Cowork.

## Usage

```
/gtm:deploy ~/Desktop/decks/lululemon-teaser-deck.html
/gtm:deploy ~/Desktop/decks/lululemon-teaser-deck.html --draft
/gtm:deploy /path/to/any-file.html
```

**Default (no flag):** Production deploy to `hub.baselinepayments.com/d/{hex}` — prospect-facing, branded subdomain, unguessable URL.

**`--draft` flag:** Draft deploy to quick-share Netlify site — internal review, non-guessable hash URL, not on the branded domain.

## How It Works

1. **Validate** — Confirm the HTML file exists and read its content
2. **Determine target** — Parse flags to choose production or draft
3. **Deploy** — Call the appropriate `netlify-gtm` MCP tool with the file content
4. **Report** — Output the live URL

## Instructions

### Step 1: Validate and Read the File

Read the target HTML file to confirm it exists and get its content:

```
Read: <file-path>
```

If the file does not exist, stop and report the error. Do not attempt to deploy.

### Step 2: Determine Deploy Target

Parse the command arguments:
- If `--draft` is present: draft deploy (internal sharing)
- If no flag: production deploy (prospect-facing)

### Step 3a: Production Deploy (Default)

Deploy to `hub.baselinepayments.com` with an unguessable path.

Call the `deploy_to_hub` MCP tool (server: `netlify-gtm`):

```
Tool: deploy_to_hub
Arguments:
  html_content: <full content of the HTML file>
  description: <brief description, e.g. "Lululemon teaser deck">
```

**WARNING:** Each production deploy to this site replaces the entire site content. The MCP tool handles this by fetching all existing `/d/` files and including them in the deploy manifest, so previously deployed paths are preserved. If the site has never been deployed via this MCP tool before, existing paths may not be preserved — use `--draft` for review first if unsure.

The tool returns:
```json
{
  "url": "https://hub.baselinepayments.com/d/{hex}",
  "deploy_id": "...",
  "path_id": "..."
}
```

### Step 3b: Draft Deploy (`--draft`)

Deploy to the quick-share Netlify site for internal review.

Call the `deploy_draft` MCP tool (server: `netlify-gtm`):

```
Tool: deploy_draft
Arguments:
  html_content: <full content of the HTML file>
  description: <brief description, e.g. "Acme ROI calculator draft">
```

The tool returns:
```json
{
  "url": "https://{hash}--quick-share-f58d870368e7.netlify.app",
  "deploy_id": "..."
}
```

### Step 4: Report the URL

**For production deploy:**
```
Deployed to production:
  https://hub.baselinepayments.com/d/{path_id}

Site: baseline-hub (f5700f38-35d8-4b71-8d11-615d96717291)
Source: {original file path}

Note: This URL is unguessable but not password-protected.
Do not deploy sensitive internal documents to production.
```

**For draft deploy:**
```
Deployed as draft:
  {url from tool response}

Site: quick-share (1554d55b-7194-4f8a-be8c-8ad77e26c3a9)
Source: {original file path}

This is a draft URL for internal review only.
To deploy to production: /gtm:deploy {file} (without --draft)
```

### Important Rules

**Never deploy sensitive internal documents.** The production site (`hub.baselinepayments.com`) is for prospect/client/partner-facing content. Internal strategy documents, meeting notes, and competitive analysis should use `--draft` only.

**Production preserves existing paths.** The `deploy_to_hub` tool fetches all currently deployed files and includes their SHAs in the manifest — Netlify's content-addressed storage means only the new file gets uploaded. All existing `/d/` paths survive.

**Draft is flat, production is nested.** Draft deploys are served as `index.html` at the site root. Production deploys live at `/d/{hex}/index.html` — the MCP server handles the path structure automatically.

**The netlify-gtm MCP server must be running.** In Claude Code, it starts automatically via `.mcp.json`. In Claude Cowork, it runs on Cloud Run — ensure the Cloud Run URL is configured in the plugin's MCP server settings.

## Troubleshooting

### Tool not found / MCP server not connected
Verify the `netlify-gtm` server is listed in your MCP server config. For Claude Code, check `.mcp.json`. For Cowork, check the plugin MCP settings. The server needs `NETLIFY_TOKEN` to be set.

### Deploy tool returns an error
Check the error message. Common issues:
- `NETLIFY_TOKEN environment variable is not set` — set the token in your env or MCP config
- `Netlify API error 401` — token is invalid or expired, generate a new one at netlify.com
- `Deploy did not become ready` — Netlify is slow; the tool polls for up to 60 seconds

### Previous production content disappeared
If you deployed before this MCP tool existed (e.g., via CLI), the old deploy's files may not have been tracked. Use `--draft` for new content and keep a record of your PATH_IDs.
