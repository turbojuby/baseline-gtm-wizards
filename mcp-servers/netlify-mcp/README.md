# netlify-mcp

MCP server for deploying HTML to Netlify via the REST API — no CLI required.

Works in Claude Code (stdio), Claude Cowork, and Claude.ai (via Cloud Run SSE).

## Tools

### `deploy_to_hub`
Deploy HTML to `hub.baselinepayments.com/d/{hex}` (production, prospect-facing).

- Fetches all existing site files and includes them in the deploy manifest so other `/d/` paths are preserved
- Generates a 16-char random hex path (unguessable)
- Returns `{ url, deploy_id, path_id }`

### `deploy_draft`
Deploy HTML as a draft to the quick-share Netlify site for internal review.

- Flat structure (just `index.html`) — no preservation needed
- Returns `{ url, deploy_id }` where `url` is the unique hash-based deploy preview URL

## Setup

### Local (Claude Code)

```bash
cd mcp-servers/netlify-mcp
npm install
```

Add to `.env` (or export in shell):
```
NETLIFY_TOKEN=nfp_XXX...
```

The server is registered in `.mcp.json` and will start automatically when Claude Code loads.

### Cloud Run (Claude Cowork / Claude.ai)

```bash
export NETLIFY_TOKEN=nfp_XXX...
./deploy-cloud-run.sh
```

Then add the SSE URL to your agent's MCP server config.

## Site IDs

| Site | ID | URL |
|------|----|-----|
| Hub (prod) | `f5700f38-35d8-4b71-8d11-615d96717291` | `hub.baselinepayments.com` |
| Quick-share (draft) | `1554d55b-7194-4f8a-be8c-8ad77e26c3a9` | `quick-share-f58d870368e7.netlify.app` |

## Architecture

Mirrors `mcp-servers/airtable-mcp`:
- TypeScript + `@modelcontextprotocol/sdk`
- Dual stdio/HTTP transport (MODE env var)
- `src/netlify.ts` — fetch-based Netlify API client
- `src/tools.ts` — tool definitions + handlers
- `src/server-http.ts` — Express SSE server for Cloud Run
- `Dockerfile` + `deploy-cloud-run.sh` — GCP deployment
