# Airtable MCP Server — GTM Wizards Deal Calculator

MCP server for the **GTM Wizards - Deal Calculator** Airtable base. Exposes deal pipeline data, company financial metrics, Esker pricing, ROI assumptions, and calculated outputs as MCP tools.

Supports two transport modes:
- **stdio** — for Claude Code (local), Claude Cowork, and Claude.ai
- **HTTP/SSE** — for cloud agent runs on GCP Cloud Run (Trigger.dev)

---

## Airtable Base Structure

| Table | Contents |
|-------|----------|
| **Deals** | Pipeline deals: stage, AE owner, linked company |
| **Companies** | Financial metrics: revenue, DSO, DPO, invoice volumes, FTEs, ERP |
| **Pricing** | AE-configured Esker pricing: SaaS annual, impl fee, discount % |
| **Assumptions** | Editable ROI assumptions: FTE rate, automation %, discount rate |
| **Calculated Outputs** | Formula-driven ROI: AP savings, FTEs freed, payback months, 3yr ROI, NPV |

---

## Available Tools

| Tool | Description |
|------|-------------|
| `list_deals` | List pipeline deals, optionally filtered by stage or AE owner |
| `get_deal` | Full deal record with nested company, pricing, assumptions, and ROI outputs |
| `list_companies` | All companies with names and IDs |
| `get_company` | Full company record with financial metrics |
| `get_pricing` | Pricing configuration for a deal |
| `get_assumptions` | ROI assumptions for a deal |
| `get_calculated_outputs` | Formula-driven ROI outputs for a deal |
| `update_deal` | Update deal fields (stage, deck URL, notes, last deck generated) |
| `update_pricing` | Update pricing fields (SaaS fee, implementation fee, discount %) |
| `search_records` | Search any table by name text query |

---

## Local Setup (stdio mode)

### 1. Prerequisites

- Node.js 20+
- `npx tsx` available (included as devDependency)

### 2. Get your Airtable credentials

**Personal Access Token (PAT):**
1. Go to https://airtable.com/create/tokens
2. Create a token with scopes: `data.records:read`, `data.records:write`, `schema.bases:read`
3. Restrict to the GTM Wizards base

**Base ID:**
- Open the base in Airtable
- The URL will be: `https://airtable.com/appXXXXXXXXXXXXXX/...`
- `appXXXXXXXXXXXXXX` is your Base ID

### 3. Set environment variables

Copy `.env.example` and fill in your values:
```bash
cp .env.example .env
# Edit .env with your AIRTABLE_PAT and AIRTABLE_BASE_ID
```

Or export them in your shell:
```bash
export AIRTABLE_PAT=patXXXXXXXXXXXXXX.XXXX...
export AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### 4. Install dependencies

```bash
npm install
```

### 5. Configure Claude Code

The server is already configured in `baseline-gtm-wizards/.mcp.json`. Make sure your environment variables are set and the server will be available as `airtable-gtm` in Claude Code sessions within that project.

You can also run it manually to verify:
```bash
MODE=stdio AIRTABLE_PAT=pat... AIRTABLE_BASE_ID=app... npx tsx src/index.ts
```

---

## Cloud Run Deployment (HTTP/SSE mode)

### 1. Build TypeScript
```bash
npm install
npm run build
```

### 2. Configure the deploy script

Edit `deploy-cloud-run.sh` and set your GCP project ID:
```bash
GCP_PROJECT="your-gcp-project-id"
```

### 3. Deploy

```bash
export AIRTABLE_PAT=pat...
export AIRTABLE_BASE_ID=app...
./deploy-cloud-run.sh
```

This builds the Docker image, pushes it to Google Container Registry, and deploys to Cloud Run in `us-central1`.

### 4. Configure cloud agent

Once deployed, add the SSE URL to your Trigger.dev agent's MCP config:

```json
{
  "type": "url",
  "url": "https://airtable-mcp-HASH-uc.a.run.app/sse"
}
```

The deploy script prints this URL after a successful deployment.

### Cloud Run endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Liveness probe — returns `{"status":"ok"}` |
| `GET /sse` | SSE stream — MCP client connects here |
| `POST /messages` | MCP message handler — session ID from query param |

---

## Development

```bash
# Type check
npm run typecheck

# Run in stdio mode (development)
npm run dev

# Build for production
npm run build

# Run built output
npm start
```

---

## File Structure

```
mcp-servers/airtable-mcp/
├── package.json
├── tsconfig.json
├── Dockerfile
├── deploy-cloud-run.sh
├── .env.example
├── README.md
└── src/
    ├── index.ts          # Entry point — routes to stdio or HTTP based on MODE
    ├── airtable.ts       # Airtable REST API client (fetch-based, no SDK)
    ├── tools.ts          # All MCP tool definitions and handlers
    └── server-http.ts    # HTTP/SSE server for Cloud Run
```
