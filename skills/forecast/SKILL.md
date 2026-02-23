---
description: Generate a weighted pipeline forecast with deal health scoring, risk flags, and commit/upside/best-case projections from HubSpot data.
---

# /gtm:forecast

Generate a pipeline forecast with weighted projections, deal health scoring, and risk flags. Pulls live deal data from HubSpot, applies Esker-specific stage probabilities, and flags deals that need attention.

## Usage

```
/gtm:forecast
/gtm:forecast Q1 2026
/gtm:forecast "next 90 days"
```

## How It Works

1. **Pipeline Pull** — Fetch all open deals from HubSpot with stage, amount, close date, and associated contacts
2. **Health Score** — Score each deal against Esker-specific health criteria
3. **Forecast** — Apply weighted probabilities, generate commit/upside/best-case scenarios
4. **Risk Analysis** — Flag stalled deals, missing data, and pipeline gaps
5. **Report** — Output a structured forecast summary

## Instructions

### Step 1: Load MCP Tools

```
ToolSearch: "+hubspot search"
```

### Step 2: Pull HubSpot Pipeline Data

Fetch all open deals:

```
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "deals"
  searchTerm: ""
```

For each deal, gather:
- **Deal properties:** name, stage, amount, close date, pipeline, deal owner, create date, last activity date
- **Associated company:** name, industry, revenue, ERP system
- **Associated contacts:** names, titles, last contacted date

Use `mcp__claude_ai_HubSpot__get_crm_objects` to pull full property sets on each deal.

If a time period is specified (e.g., "Q1 2026"), filter deals by close date within that range. Default: current quarter.

### Step 3: Apply Stage Probabilities

Use Esker pipeline stage weights:

| Stage | Probability |
|-------|------------|
| Lead / Prospecting | 5% |
| Discovery | 15% |
| Evaluation / Demo | 30% |
| Proposal | 50% |
| Negotiation | 70% |
| Contract Sent | 85% |
| Closed Won | 100% |
| Closed Lost | 0% |

**Weighted Amount** = Deal Amount x Stage Probability

### Step 4: Score Deal Health

Score each deal 0-100 based on Esker-specific criteria. Each criterion is worth up to the points listed:

| Criterion | Points | How to Assess |
|-----------|--------|---------------|
| Champion identified | 15 | Contact with decision-maker title (VP+, Director, C-suite) associated to deal |
| Multi-threaded (>1 contact engaged) | 15 | Multiple contacts associated to deal with recent activity |
| PoV proposed or accepted | 20 | Deal stage at Evaluation+ OR notes mention PoV/proof of value |
| ERP environment confirmed | 10 | Company `erp_system` property populated in HubSpot |
| Invoice volume validated | 10 | Company `ap_invoice_volume_annual` or `ar_invoice_volume_annual` populated |
| Budget holder identified | 10 | Contact with finance title (CFO, VP Finance, Controller) associated |
| Recent activity (<14 days) | 10 | Last activity date within 14 days |
| Next step defined | 10 | Deal has upcoming activity or task scheduled |

**Health Rating:**
- 80-100: Strong — on track
- 60-79: Moderate — needs attention on gaps
- 40-59: At Risk — missing critical elements
- 0-39: Critical — likely stalled or under-qualified

### Step 5: Check Airtable for Deal Data

Read the Airtable schema for supplemental deal data:

```
Read: airtable/schema.json
```

Cross-reference deals with Airtable for pricing data, module selection, and deal-specific assumptions. Flag any discrepancies between HubSpot deal amounts and Airtable pricing.

### Step 6: Generate Forecast Scenarios

Build three scenarios:

**Commit (Conservative):**
- Only deals at Proposal stage or later (50%+ probability)
- Apply health score discount: deals below 60 health get 50% haircut on weighted amount

**Upside (Likely):**
- All deals at Discovery or later (15%+ probability)
- Apply standard stage weights, no health adjustment

**Best Case (Optimistic):**
- All open deals including Lead/Prospecting
- Apply standard stage weights

### Step 7: Identify Risk Flags

Flag deals with any of these conditions:
- **Stalled:** No activity in 21+ days
- **Single-threaded:** Only 1 contact associated
- **No champion:** No VP+ or C-suite contact
- **Close date passed:** Expected close date is in the past
- **Missing amount:** No deal amount set
- **No PoV path:** Deal at Evaluation+ stage but no PoV mentioned
- **Pipeline gap:** If total weighted pipeline < 3x quota target, flag coverage gap

### Step 8: Output Forecast Report

```
Pipeline Forecast — {Period}
Generated: {date}
Data Source: HubSpot (live pull)

FORECAST SUMMARY
                    Deals    Weighted Value    Unweighted Value
Commit:             {n}      ${X}              ${X}
Upside:             {n}      ${X}              ${X}
Best Case:          {n}      ${X}              ${X}

PIPELINE BY STAGE
{Stage}             {n} deals    ${X} weighted    ${X} unweighted
...

DEAL HEALTH DISTRIBUTION
Strong (80-100):    {n} deals — ${X}
Moderate (60-79):   {n} deals — ${X}
At Risk (40-59):    {n} deals — ${X}
Critical (0-39):    {n} deals — ${X}

TOP DEALS (by weighted amount)
1. {Company} — ${amount} at {stage} — Health: {score}/100
   Flags: {any risk flags}
   Next: {next step or "None defined"}
2. ...

RISK FLAGS
- {Deal}: {flag description} — Recommendation: {action}
- ...

PIPELINE GAPS
- Coverage ratio: {weighted pipeline / quota}x (target: 3x+)
- Stage conversion needed: {X} deals must advance from {stage} to hit commit
- Close date concentration: {X}% of pipeline closes in final month of quarter

RECOMMENDED ACTIONS
1. {Highest-impact action for the pipeline}
2. {Second action}
3. {Third action}
```

## Troubleshooting

### Limited deal data in HubSpot
If deals are missing amounts, stages, or contacts, the forecast will be incomplete. Flag specific data gaps in the report and recommend the user update HubSpot before the next forecast.

### No deals in pipeline
If HubSpot returns no open deals, report the empty pipeline and suggest running `/gtm:pipeline-review` to assess prospecting activity needed.

### Health scores seem too low
The scoring model is intentionally strict — it reflects Esker's complex sale requirements (PoV, multi-threading, budget holder). Low scores early in the pipeline are expected. Focus attention on deals at Proposal+ with low health scores, as those are the real risks.
