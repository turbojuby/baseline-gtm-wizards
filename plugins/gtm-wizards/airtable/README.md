# Airtable: GTM Wizards - Deal Calculator

This Airtable base stores deal-specific data that feeds into generated sales decks. AEs manage pricing and company data; the plugin reads this data when generating decks.

## Access

**The base is already set up.** Request access from Tyler — he'll share the base with your Airtable account.

- **Base URL:** https://airtable.com/apphIEJ1MRUISs8mK
- **Base name:** GTM Wizards - Deal Calculator

Once you have access, get your Personal Access Token:
1. Go to https://airtable.com/create/tokens
2. Create a token with `data.records:read`, `data.records:write`, and `schema.bases:read` scopes
3. Scope it to the GTM Wizards base

## Environment Variables

The Airtable MCP server requires two env vars. Set these in your shell profile (`~/.zshrc` or `~/.bash_profile`):

```bash
export AIRTABLE_PAT="patXXXXXX..."       # your personal access token (above)
export AIRTABLE_BASE_ID="apphIEJ1MRUISs8mK"  # GTM Wizards base ID (same for everyone)
```

After adding, run `source ~/.zshrc` (or restart your terminal).

## Table Overview

| Table | ID | Purpose | Who Updates |
|-------|----|---------|-------------|
| **Companies** | `tblkhSBbxXmijUCq7` | Company financial metrics and HubSpot mapping | AEs / Agent |
| **Contacts** | `tblhO8T6Ekjb9aOaz` | Contacts linked to companies, HubSpot mapping | AEs / Agent |
| **Deals** | `tbljzM6OI6AnjYD8b` | Active pipeline deals with stage, owner, links | AEs |
| **Pricing** | `tblgvcvQo5FMljAMG` | Per-deal Esker pricing (SaaS, implementation, discounts) | AEs only |
| **Assumptions** | `tblZv4uy1y1MWGHyo` | Editable ROI calculation assumptions | AEs / Prospect |
| **Calculated Outputs** | `tblLPoROapCKjmRQE` | Auto-calculated ROI metrics (formula fields) | Automatic |

## Table Schemas

### Companies (`tblkhSBbxXmijUCq7`)

| Field | Type | Notes |
|-------|------|-------|
| Company Name | Single line text | Primary field |
| Industry | Single select | Retail, Manufacturing, Healthcare, etc. |
| Annual Revenue | Currency | $ precision 0 |
| Current DSO | Number | Days Sales Outstanding |
| Current DPO | Number | Days Payable Outstanding |
| Annual Invoice Volume | Number | Total AP invoice volume |
| Current FTEs in AP | Number | AP headcount |
| ERP System | Single line text | SAP, Oracle, NetSuite, etc. |
| HubSpot Company ID | Single line text | For cross-referencing CRM |
| Peer 1 Name / Peer 1 DPO | Single line text / Number | Benchmark competitor |
| Peer 2 Name / Peer 2 DPO | Single line text / Number | Benchmark competitor |
| Domain | Single line text | Company website domain |
| Website | URL | |
| Phone | Phone number | |
| Street Address / City / State / Country | Single line text | |
| Year Founded | Single line text | |
| Number of Employees | Number | |
| Lifecycle Stage | Single select | Maps to HubSpot `lifecyclestage` |
| HubSpot Owner | Single line text | |
| LinkedIn Handle | Single line text | |
| Last Contacted / Last Activity Date / Next Activity Date | Date & Time | |
| Create Date | Date | |
| Strategic Goals | Long text | Maps to HubSpot `strategic_goals_summary` |
| AR Invoice Volume Annual | Number | Maps to HubSpot `ar_invoice_volume_annual` |
| AP Invoice Volume Annual | Number | Maps to HubSpot `ap_invoice_volume_annual` |

### Contacts (`tblhO8T6Ekjb9aOaz`)

| Field | Type | Notes |
|-------|------|-------|
| Contact Name | Single line text | Primary field |
| First Name / Last Name | Single line text | |
| Email | Email | |
| Phone / Mobile Phone | Phone number | |
| Job Title / Department | Single line text | |
| Lifecycle Stage | Single select | 10 HubSpot values |
| Lead Status | Single select | 15 HubSpot values (Sequencing, Unresponsive, etc.) |
| Company | Link to Companies | |
| HubSpot Contact ID / HubSpot Owner / Original Source | Single line text | |
| Last Contacted / Last Activity Date / Next Activity Date | Date & Time | |
| Create Date | Date | |
| LinkedIn URL / Website | URL | |
| Notes | Long text | |

### Deals (`tbljzM6OI6AnjYD8b`)

| Field | Type | Notes |
|-------|------|-------|
| Deal Name | Single line text | Primary field — e.g. "Lululemon - AP Automation" |
| HubSpot Deal ID | Single line text | |
| Stage | Single select | Lead-in, Discovery, Demo, Scoping, Proposal, SOW |
| AE Owner | Single select | Tyler, Marc |
| Company | Link to Companies | |
| Contact | Link to Contacts | |
| Pipeline | Single select | Esker Pipeline, Baseline Sales Pipeline |
| Amount | Currency | $ precision 0 |
| Close Date | Date | |
| Deal Type | Single select | 9 HubSpot values |
| Description | Long text | |
| HubSpot Owner | Single line text | |
| Last Activity Date | Date & Time | |
| Created Date | Date | |
| Last Deck Generated | Date & Time | |
| Deck URL | URL | hub.baselinepayments.com URL |
| Notes | Long text | |

### Pricing (`tblgvcvQo5FMljAMG`)

| Field | Type | Notes |
|-------|------|-------|
| Pricing Name | Single line text | Primary field |
| Deal | Link to Deals | |
| Esker SaaS Annual | Currency | List price before discount |
| Implementation Fee | Currency | One-time fee |
| Transaction Fee Per Invoice | Currency | Per-invoice fee if applicable |
| Discount % | Percent | Negotiated discount |
| Effective SaaS Annual | **Formula** | `{Esker SaaS Annual} * (1 - {Discount %})` — add manually in UI |

> **Note:** Formula fields cannot be created via the Airtable API. `Effective SaaS Annual` must be added manually in the Airtable UI.

### Assumptions (`tblZv4uy1y1MWGHyo`)

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| Assumption Name | Single line text | — | Primary field |
| Deal | Link to Deals | — | |
| FTE Hourly Rate | Currency | $45.00 | Fully-loaded hourly AP FTE cost |
| Target DSO Reduction | Number | 5 | Days |
| Current Cost Per Invoice | Currency | $12.88 | IOFM benchmark |
| Esker Cost Per Invoice | Currency | $2.78 | Esker benchmark |
| Automation Rate | Percent | 60% | FTE reallocation rate |
| Discount Rate | Percent | 8.0% | For NPV calculation |
| Revenue Proxy Multiplier | Number | 8 | For working capital estimate |

### Calculated Outputs (`tblLPoROapCKjmRQE`)

All fields except Deal and Output Name are formula fields. They require Lookup fields to pull values from linked tables before the formulas work (see Cross-Table Lookups below).

| Field | Formula |
|-------|---------|
| Annual AP Savings | `({Current Cost Per Invoice} - {Esker Cost Per Invoice}) * {Annual Invoice Volume}` |
| FTEs Freed | `MAX(1, FLOOR({Current FTEs in AP} * {Automation Rate}))` |
| FTE Reallocation Value | `{FTEs Freed} * {FTE Hourly Rate} * 2080` |
| Annual Revenue Proxy | `{Annual Invoice Volume} * {Current Cost Per Invoice} * {Revenue Proxy Multiplier}` |
| Working Capital Freed | `{Target DSO Reduction} * ({Annual Revenue Proxy} / 365)` |
| Total Annual Benefit | `{Annual AP Savings} + {FTE Reallocation Value} + {Working Capital Freed}` |
| Payback Months | `IF({Total Annual Benefit} > 0, ({Implementation Fee} + {Effective SaaS Annual}) / ({Total Annual Benefit} / 12), 99)` |
| Three Year Benefit | `{Total Annual Benefit} * 3` |
| Three Year Cost | `{Effective SaaS Annual} * 3 + {Implementation Fee}` |
| Three Year ROI | `IF({Three Year Cost} > 0, (({Three Year Benefit} - {Three Year Cost}) / {Three Year Cost}) * 100, 0)` |
| NPV | `-{Implementation Fee} + ({Total Annual Benefit} - {Effective SaaS Annual}) / (1 + {Discount Rate}) + ... (3-year DCF)` |

> **Note:** All formula fields must be added manually in the Airtable UI (API limitation).

## Cross-Table Lookups

Airtable formulas can only reference fields in the same table. Before the Calculated Outputs formulas work, create these **Lookup fields** in the Calculated Outputs table:

**From Deals → Companies (via Company link on Deals, then lookup on Calculated Outputs → Deals):**
- `Annual Invoice Volume` (Lookup)
- `Current FTEs in AP` (Lookup)
- `Annual Revenue` (Lookup)

**From Deals → Pricing:**
- `Effective SaaS Annual` (Lookup)
- `Implementation Fee` (Lookup)

**From Deals → Assumptions:**
- `FTE Hourly Rate` (Lookup)
- `Target DSO Reduction` (Lookup)
- `Current Cost Per Invoice` (Lookup)
- `Esker Cost Per Invoice` (Lookup)
- `Automation Rate` (Lookup)
- `Discount Rate` (Lookup)
- `Revenue Proxy Multiplier` (Lookup)

## How AEs Update Pricing

1. Go to the **Pricing** table
2. Find the deal record (or create one linked to the deal)
3. Enter: Esker SaaS Annual, Implementation Fee, Transaction Fee, Discount %
4. `Effective SaaS Annual` calculates automatically
5. Calculated Outputs update automatically

Pricing is AE-controlled. The plugin reads but never writes to the Pricing table.

## How the Plugin Reads Data

The plugin accesses Airtable via the **Airtable MCP server** (`airtable-gtm` in `.mcp.json`). Skills call MCP tools like `list_deals`, `get_company`, `get_pricing`, etc., which map to the base ID and table IDs in `base-config.json`.

For skills that don't have MCP access in the current session, they fall back to reading `airtable/schema.json` for structure context and ask the user to provide key values manually.

## Sample Data for Testing

### Companies

| Company Name | Industry | Annual Revenue | Current DSO | Annual Invoice Volume | FTEs in AP | ERP |
|-------------|----------|---------------|-------------|----------------------|-----------|-----|
| Acme Corp | Manufacturing | $500,000,000 | 45 | 50,000 | 10 | Oracle |
| Globex Industries | Distribution | $1,200,000,000 | 52 | 120,000 | 22 | SAP |

### Deals

| Deal Name | Stage | AE Owner | Company |
|-----------|-------|----------|---------|
| Acme Corp - AP Automation | Discovery | Tyler | Acme Corp |
| Globex Industries - P2P | Demo | Marc | Globex Industries |

### Pricing

| Deal | Esker SaaS Annual | Implementation Fee | Discount % |
|------|------------------|--------------------|-----------|
| Acme Corp - AP Automation | $65,000 | $35,000 | 10% |
| Globex Industries - P2P | $78,000 | $40,000 | 5% |

### Assumptions (using defaults)

| Deal | FTE Hourly Rate | Target DSO Reduction | Current Cost/Invoice | Automation Rate |
|------|----------------|---------------------|----------------------|----------------|
| Acme Corp | $45.00 | 5 | $12.88 | 60% |
| Globex Industries | $52.00 | 7 | $14.50 | 60% |
