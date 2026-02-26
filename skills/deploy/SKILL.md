---
description: Deploy an HTML file to hub.baselinepayments.com (production) or a Firebase preview channel (internal review, 7-day TTL).
---

# /gtm:deploy

Deploy an HTML file to hub.baselinepayments.com (production, prospect-facing) or to a Firebase preview channel (internal review, expires after 7 days). Uses the `firebase-gtm` MCP server — no CLI required, works in Claude Code and Claude Cowork.

## Usage

```
/gtm:deploy ~/Desktop/decks/lululemon-teaser-deck.html
/gtm:deploy ~/Desktop/decks/lululemon-teaser-deck.html --draft
/gtm:deploy /path/to/any-file.html
```

**Default (no flag):** Production deploy to `hub.baselinepayments.com/d/{hex}` — prospect-facing, branded subdomain, unguessable URL.

**`--draft` flag:** Draft deploy to a Firebase preview channel — internal review, preview URL, expires after 7 days.

## How It Works

1. **Validate** — Confirm the HTML file exists and read its content
2. **Determine target** — Parse flags to choose production or draft
3. **Deploy** — Call the appropriate `firebase-gtm` MCP tool with the file content
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
- If `--draft` is present: draft deploy (internal sharing, 7-day TTL)
- If no flag: production deploy (prospect-facing)

### Step 3a: Production Deploy (Default)

Deploy to `hub.baselinepayments.com` with an unguessable path.

Call the `deploy_to_hub` MCP tool (server: `firebase-gtm`):

```
Tool: deploy_to_hub
Arguments:
  html_content: <full content of the HTML file>
  description: <brief description, e.g. "Lululemon teaser deck">
```

**WARNING:** Each production deploy to this site replaces the entire site content. The MCP tool handles this by fetching all existing files from the latest release and including them in the version manifest, so previously deployed paths are preserved.

The tool returns:
```json
{
  "url": "https://hub.baselinepayments.com/d/{hex}",
  "version_id": "...",
  "path_id": "..."
}
```

### Step 3b: Draft Deploy (`--draft`)

Deploy to a Firebase preview channel for internal review. Preview channels expire after 7 days.

Call the `deploy_draft` MCP tool (server: `firebase-gtm`):

```
Tool: deploy_draft
Arguments:
  html_content: <full content of the HTML file>
  description: <brief description, e.g. "Acme ROI calculator draft">
```

The tool returns:
```json
{
  "url": "https://baseline-pages-hub--draft-{id}-baseline-pages-hub.web.app",
  "version_id": "..."
}
```

### Step 4: Report the URL

**For production deploy:**
```
Deployed to production:
  https://hub.baselinepayments.com/d/{path_id}

Site: baseline-pages-hub
Source: {original file path}

Note: This URL is unguessable but not password-protected.
Do not deploy sensitive internal documents to production.
```

**For draft deploy:**
```
Deployed as draft:
  {url from tool response}

Site: baseline-pages-hub (preview channel)
Source: {original file path}

This is a preview URL for internal review only. It expires after 7 days.
To deploy to production: /gtm:deploy {file} (without --draft)
```

### Important Rules

**Never deploy sensitive internal documents.** The production site (`hub.baselinepayments.com`) is for prospect/client/partner-facing content. Internal strategy documents, meeting notes, and competitive analysis should use `--draft` only.

**Production preserves existing paths.** The `deploy_to_hub` tool fetches all currently deployed files from the latest release and includes their hashes in the version manifest — Firebase's content-addressed storage means only the new file gets uploaded. All existing `/d/` paths survive.

**Draft is flat, production is nested.** Draft deploys are served as `index.html` at the preview channel root. Production deploys live at `/d/{hex}/index.html` — the MCP server handles the path structure automatically.

**The firebase-gtm MCP server must be running.** In Claude Code, it starts automatically via `.mcp.json`. In Claude Cowork, it runs on Cloud Run — ensure the Cloud Run URL is configured in the plugin's MCP server settings.

## Troubleshooting

### Tool not found / MCP server not connected
Verify the `firebase-gtm` server is listed in your MCP server config. For Claude Code, check `.mcp.json`. For Cowork, check the plugin MCP settings. No API tokens needed — uses Google Application Default Credentials.

### Deploy tool returns an error
Check the error message. Common issues:
- `Failed to get access token from Google ADC` — run `gcloud auth application-default login` locally
- `Firebase API error 403` — the authenticated account doesn't have Firebase Hosting permissions on the `baseline-pages-hub` project
- `Firebase API error 404` — the site or project doesn't exist yet; run the setup commands from the migration plan

### Previous production content disappeared
If you deployed before this MCP tool existed (e.g., via CLI), the old deploy's files may not have been tracked. Use `--draft` for new content and keep a record of your PATH_IDs.
