# Airtable Base Setup: GTM Wizards - Deal Calculator

This Airtable base stores deal-specific data that feeds into generated sales decks. AEs manage pricing and company data; the plugin reads this data when generating decks.

## Table Overview

| Table | Purpose | Who Updates |
|-------|---------|-------------|
| **Deals** | Active pipeline deals with stage, owner, and links | AEs |
| **Companies** | Company financial metrics and peer benchmarks | AEs / Agent |
| **Pricing** | Per-deal Esker pricing (SaaS, implementation, discounts) | AEs only |
| **Assumptions** | Editable ROI calculation assumptions | AEs / Prospect |
| **Calculated Outputs** | Auto-calculated ROI metrics (formula fields) | Automatic |

## Setup Instructions

### 1. Create the Base

1. Open Airtable and create a new base named **"GTM Wizards - Deal Calculator"**
2. Create each table in this order (linked record fields require the target table to exist first):
   - Companies
   - Deals (links to Companies)
   - Pricing (links to Deals)
   - Assumptions (links to Deals)
   - Calculated Outputs (links to Deals)

### 2. Configure Each Table

#### Companies

| Field | Type | Config |
|-------|------|--------|
| Company Name | Single line text | Primary field |
| Industry | Single select | Options: Retail, Manufacturing, Healthcare, Technology, Financial Services, Distribution, Energy, Other |
| Annual Revenue | Currency | Precision: 0, Symbol: $ |
| Current DSO | Number | Precision: 0 |
| Current DPO | Number | Precision: 0 |
| Annual Invoice Volume | Number | Precision: 0 |
| Current FTEs in AP | Number | Precision: 1 |
| ERP System | Single line text | |
| HubSpot Company ID | Single line text | |
| Peer 1 Name | Single line text | |
| Peer 1 DPO | Number | Precision: 0 |
| Peer 2 Name | Single line text | |
| Peer 2 DPO | Number | Precision: 0 |

#### Deals

| Field | Type | Config |
|-------|------|--------|
| Deal Name | Single line text | Primary field |
| HubSpot Deal ID | Single line text | |
| Stage | Single select | Options: Lead-in, Discovery, Demo, Scoping, Proposal, SOW |
| AE Owner | Single select | Options: Tyler, Marc |
| Company | Link to Companies | |
| Created Date | Date | ISO format |
| Last Deck Generated | Date & Time | ISO + 24hr |
| Deck URL | URL | |
| Notes | Long text | |

#### Pricing

| Field | Type | Config |
|-------|------|--------|
| Pricing ID | Auto number | Primary field |
| Deal | Link to Deals | |
| Esker SaaS Annual | Currency | Precision: 0, $ |
| Implementation Fee | Currency | Precision: 0, $ |
| Transaction Fee Per Invoice | Currency | Precision: 2, $ |
| Discount % | Percent | Precision: 1 |
| Effective SaaS Annual | Formula | `{Esker SaaS Annual} * (1 - {Discount %})` |
| Effective Cost Per Invoice | Formula | See note below |

**Effective Cost Per Invoice formula:**
```
{Transaction Fee Per Invoice} + ({Effective SaaS Annual} / IF({Annual Invoice Volume} > 0, {Annual Invoice Volume}, 1))
```
Note: `{Annual Invoice Volume}` needs to be brought in via a Rollup or Lookup field through the Deal → Company link. Create a Lookup field first if Airtable's formula engine can't directly traverse the link.

#### Assumptions

| Field | Type | Default | Config |
|-------|------|---------|--------|
| Assumption ID | Auto number | — | Primary field |
| Deal | Link to Deals | — | |
| FTE Hourly Rate | Currency | $45.00 | Precision: 2, $ |
| Target DSO Reduction | Number | 5 | Precision: 0 |
| Current Cost Per Invoice | Currency | $12.88 | Precision: 2, $ |
| Esker Cost Per Invoice | Currency | $2.78 | Precision: 2, $ |
| Automation Rate | Percent | 60% | Precision: 0 |
| Discount Rate | Percent | 8.0% | Precision: 1 |
| Revenue Proxy Multiplier | Number | 8 | Precision: 0 |

#### Calculated Outputs

All fields except Deal are formula fields. They reference values from linked Pricing, Assumptions, and Companies tables. In Airtable, you will need Lookup/Rollup fields to pull values across table links before using them in formulas.

| Field | Formula |
|-------|---------|
| Annual AP Savings | `(Current Cost Per Invoice - Esker Cost Per Invoice) * Annual Invoice Volume` |
| FTEs Freed | `MAX(1, FLOOR(Current FTEs in AP * Automation Rate))` |
| FTE Reallocation Value | `FTEs Freed * FTE Hourly Rate * 2080` |
| Annual Revenue Proxy | `Annual Invoice Volume * Current Cost Per Invoice * Revenue Proxy Multiplier` |
| Working Capital Freed | `Target DSO Reduction * (Annual Revenue Proxy / 365)` |
| Total Annual Benefit | `Annual AP Savings + FTE Reallocation Value + Working Capital Freed` |
| Payback Months | `(Implementation Fee + Effective SaaS Annual) / (Total Annual Benefit / 12)` |
| Three Year Benefit | `Total Annual Benefit * 3` |
| Three Year Cost | `Effective SaaS Annual * 3 + Implementation Fee` |
| Three Year ROI | `((Three Year Benefit - Three Year Cost) / Three Year Cost) * 100` |
| NPV | `-Implementation Fee + sum of (Total Annual Benefit - Effective SaaS Annual) / (1 + Discount Rate)^year for years 1-3` |

### 3. Implement Cross-Table Lookups

Airtable formulas can only reference fields in the same table. To make the Calculated Outputs formulas work, create **Lookup fields** in the Calculated Outputs table that pull values from linked tables:

1. **From Deal → Company (via Deals link):**
   - `Annual Invoice Volume` (Lookup)
   - `Current FTEs in AP` (Lookup)
   - `Annual Revenue` (Lookup)

2. **From Deal → Pricing (via Deals link):**
   - `Effective SaaS Annual` (Lookup)
   - `Implementation Fee` (Lookup)

3. **From Deal → Assumptions (via Deals link):**
   - `FTE Hourly Rate` (Lookup)
   - `Target DSO Reduction` (Lookup)
   - `Current Cost Per Invoice` (Lookup)
   - `Esker Cost Per Invoice` (Lookup)
   - `Automation Rate` (Lookup)
   - `Discount Rate` (Lookup)
   - `Revenue Proxy Multiplier` (Lookup)

Then reference these Lookup fields in the formula fields.

## How AEs Update Pricing

1. Navigate to the **Pricing** table
2. Find the deal (or create a new record linked to the deal)
3. Enter: Esker SaaS Annual, Implementation Fee, Transaction Fee, Discount %
4. The **Effective SaaS Annual** and **Effective Cost Per Invoice** calculate automatically
5. The **Calculated Outputs** table updates automatically via formula fields

Pricing is AE-controlled. The plugin reads but never writes to the Pricing table.

## How the Plugin Reads Data

The plugin accesses Airtable via the Airtable MCP server or REST API:

```
GET /v0/{baseId}/Deals?filterByFormula={Deal Name}='Acme Corp - AP Automation'
GET /v0/{baseId}/Companies?filterByFormula={Company Name}='Acme Corp'
GET /v0/{baseId}/Pricing?filterByFormula=FIND('rec123', ARRAYJOIN({Deal}))
GET /v0/{baseId}/Assumptions?filterByFormula=FIND('rec123', ARRAYJOIN({Deal}))
GET /v0/{baseId}/Calculated%20Outputs?filterByFormula=FIND('rec123', ARRAYJOIN({Deal}))
```

The plugin uses this data to:
- Populate `{{VARIABLE}}` placeholders in stage deck templates
- Set initial slider values in the ROI calculator
- Display pricing in business-case and SOW decks
- Fill stat cards and projection tables

## Sample Data for Testing

### Companies

| Company Name | Industry | Annual Revenue | Current DSO | Current DPO | Annual Invoice Volume | FTEs in AP | ERP |
|-------------|----------|---------------|-------------|-------------|----------------------|-----------|-----|
| Acme Corp | Manufacturing | $500,000,000 | 45 | 38 | 50,000 | 10 | Oracle |
| Globex Industries | Distribution | $1,200,000,000 | 52 | 41 | 120,000 | 22 | SAP |

### Pricing

| Deal | Esker SaaS Annual | Implementation Fee | Transaction Fee | Discount % |
|------|------------------|--------------------|-----------------|-----------|
| Acme Corp - AP Automation | $65,000 | $35,000 | $0.15 | 10% |
| Globex Industries - P2P | $78,000 | $40,000 | $0.10 | 5% |

### Assumptions (using defaults)

| Deal | FTE Hourly Rate | Target DSO Reduction | Current Cost Per Invoice | Esker Cost | Automation Rate | Discount Rate |
|------|----------------|---------------------|------------------------|------------|----------------|--------------|
| Acme Corp | $45.00 | 5 | $12.88 | $2.78 | 60% | 8.0% |
| Globex Industries | $52.00 | 7 | $14.50 | $2.78 | 60% | 8.0% |
