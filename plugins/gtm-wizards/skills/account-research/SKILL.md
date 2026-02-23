---
description: Deep-dive account research combining HubSpot CRM data, Notion ICP criteria, web research, and Esker collateral to produce a comprehensive account brief.
---

# /gtm:account-research

Research a target account and produce a structured brief with CRM context, ICP fit assessment, financial profile, and recommended talk tracks.

## Usage

```
/gtm:account-research Lululemon
/gtm:account-research "Acme Manufacturing"
```

## Instructions

### Step 1: Pull HubSpot Data First

Always start with CRM. Load HubSpot tools via `ToolSearch: "+hubspot search"`, then:

1. **Search companies** — `mcp__claude_ai_HubSpot__search_crm_objects` with `objectType: "companies"`
2. **Get associated contacts** — names, titles, emails, last activity dates
3. **Get associated deals** — stage, amount, close date, pipeline
4. **Get company properties** — `ar_invoice_volume_annual`, `ap_invoice_volume_annual`, `dso_current`, `erp_system`, `strategic_goals_summary`, `industry`, `annualrevenue`, `numberofemployees`

If the company exists in HubSpot, note what data is already captured vs. what needs enrichment.

### Step 2: Check Notion for ICP Criteria

Search Notion (`mcp__claude_ai_Notion__notion-search`) for:
- ICP scoring criteria / ideal customer profile definitions
- Any existing account notes or engagement history
- Sales methodology context relevant to this account's industry

### Step 3: Search Google Drive for Esker Collateral

Search Google Drive Esker folder for:
- Case studies matching the prospect's industry or company size
- "How Esker Sells Esker" methodology for the relevant vertical
- Technical documentation relevant to their likely ERP environment

### Step 4: Web Research

Fill gaps not covered by HubSpot data:

1. **Company overview** — revenue, employees, industry, HQ, recent news
2. **Financial metrics** — 10-K/10-Q for DPO, DSO, AP/AR turnover if public
3. **ERP environment** — search `"{company}" ERP SAP Oracle NetSuite`
4. **AP/AR pain signals** — earnings call mentions of finance transformation, automation, efficiency initiatives
5. **Industry trends** — current S2P/P2P automation adoption in their vertical
6. **Key executives** — CFO, Controller, VP Finance, CIO names and backgrounds

### Step 5: ICP Fit Assessment

Score the account against the ICP criteria from Notion. If Notion criteria aren't available, use these defaults:

**Tier 1 (Strong Fit):**
- Revenue $200M–$5B
- 50K+ AP invoices/year
- Multi-ERP or legacy ERP environment
- Active finance transformation initiative
- Known AP/AR pain from public filings or conversations

**Tier 2 (Good Fit):**
- Revenue $50M–$200M or $5B+
- 20K–50K AP invoices/year
- Single modern ERP but manual AP/AR processes
- General cost reduction mandate

**Tier 3 (Exploratory):**
- Below thresholds but strategic industry or expansion target

Reference `references/icp-scoring.md` for full scoring rubric.

### Step 6: Esker-Specific Qualification Signals

Flag these signals in the brief:
- **AP/AR pain** — manual invoice processing, late payments, high DSO, compliance issues
- **ERP environment** — SAP, Oracle, NetSuite, Dynamics, or multi-ERP (all favorable)
- **Invoice volume** — higher volume = faster ROI from automation
- **Finance transformation** — mentions of shared services, digital transformation, or ERP migration
- **Competitive displacement** — currently using Coupa, SAP Ariba, or legacy AP tools

### Step 7: Output the Account Brief

Structure the output as:

```
## Account Brief: {Company Name}

### CRM Status
- HubSpot: {Exists / Not Found}
- Active Deal: {Stage, Amount, Close Date / None}
- Contacts: {Count, key names and titles}
- Last Activity: {Date and type}

### ICP Fit: {Tier 1 / Tier 2 / Tier 3}
{2-3 sentence justification referencing specific criteria}

### Company Profile
- Industry: {industry}
- Revenue: {amount, source}
- Employees: {count}
- HQ: {location}
- ERP: {system(s) or "Unknown"}

### Financial Metrics (if public)
- DPO: {days} vs. peer avg {days}
- DSO: {days} vs. peer avg {days}
- AP Invoice Volume: {estimated or known}

### Qualification Signals
{Bulleted list of Esker-specific signals found}

### Competitive Landscape
{Any known incumbent AP/AR tools, or "No intel — assume Status Quo"}

### Relevant Esker Collateral
{Case studies, white papers found in Google Drive matching this account}

### Recommended Talk Tracks
{2-3 Challenger-style angles based on findings, referencing persona messaging from BRAND_GUIDE.md}

### Recommended Next Steps
{Suggested actions: create HubSpot record, schedule intro, build teaser deck, etc.}

### Data Sources
{List all sources used: HubSpot, Notion, Google Drive, Web (specific URLs)}
```

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
