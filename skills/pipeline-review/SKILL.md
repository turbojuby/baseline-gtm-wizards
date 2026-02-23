---
description: Run a full pipeline health check with deal-level scoring, stage analysis, velocity metrics, and prioritized action recommendations.
---

# /gtm:pipeline-review

Run a comprehensive pipeline health check across all open deals. Scores each deal against Esker-specific qualification criteria, analyzes stage distribution and velocity, and generates prioritized recommendations.

## Usage

```
/gtm:pipeline-review
/gtm:pipeline-review "focus on stalled deals"
/gtm:pipeline-review Q2 2026
```

## How It Works

1. **Pipeline Pull** — Fetch all open deals and associations from HubSpot
2. **Deal Scoring** — Score each deal against Esker qualification criteria
3. **Pipeline Analysis** — Stage distribution, velocity, aging, and coverage
4. **Recommendations** — Prioritized actions tied to Esker sales methodology
5. **Report** — Structured pipeline review output

## Instructions

### Step 1: Load MCP Tools

```
ToolSearch: "+hubspot search"
```

### Step 2: Pull Full Pipeline from HubSpot

Fetch all open deals:

```
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "deals"
  searchTerm: ""
```

For each deal, pull:
- **Deal:** name, stage, amount, close date, create date, last activity date, pipeline, deal owner, deal type
- **Company:** name, industry, revenue, employee count, ERP system, invoice volumes, DSO
- **Contacts:** names, titles, emails, last contacted date, lifecycle stage

### Step 3: Score Deal Health

Apply the Esker deal health scorecard to every open deal:

| Criterion | Points | Assessment Method |
|-----------|--------|-------------------|
| **PoV proposed/accepted** | 20 | Stage at Evaluation+ OR deal notes reference PoV |
| **Champion identified** | 15 | Contact with VP+, Director, or C-suite title on the deal |
| **Multi-threaded** | 15 | 2+ contacts with activity in last 30 days |
| **Budget holder identified** | 10 | Contact with finance authority (CFO, Controller, VP Finance) |
| **ERP environment confirmed** | 10 | Company `erp_system` property populated |
| **Invoice volume validated** | 10 | `ap_invoice_volume_annual` or `ar_invoice_volume_annual` populated |
| **Recent activity** | 10 | Last activity within 14 days |
| **Next step defined** | 10 | Upcoming task or meeting scheduled |

**Rating thresholds:**
- 80-100: Strong
- 60-79: Moderate
- 40-59: At Risk
- 0-39: Critical

### Step 4: Analyze Pipeline Shape

**Stage Distribution:**
- Count and total value at each stage
- Flag imbalances: too much early-stage (pipeline is immature), too much late-stage (nothing behind it), empty mid-pipeline (conversion problem)

**Velocity Metrics:**
- Average days in current stage per deal
- Average total cycle time (create date to current date) by stage
- Deals that have been in the same stage 30+ days = stalled
- Compare against Esker benchmarks:
  - Prospecting → Discovery: 14 days target
  - Discovery → Evaluation: 21 days target
  - Evaluation → Proposal: 30 days target
  - Proposal → Negotiation: 14 days target
  - Negotiation → Close: 21 days target

**Aging Analysis:**
- Deals with close dates in the past (slipped)
- Deals with close dates in next 30 days that are still early-stage (unrealistic)
- Deals older than 90 days total cycle time (potential zombies)

**Coverage Analysis:**
- Total weighted pipeline vs. quota/target (if known)
- Pipeline-to-close ratio by stage
- New pipeline created in last 30/60/90 days

### Step 5: Generate Recommendations

For each deal, generate specific actions based on gaps:

| Gap | Recommendation |
|-----|----------------|
| No champion | "Identify and engage a VP+ sponsor. Ask current contact: 'Who else would need to sign off on a project like this?'" |
| Single-threaded | "Multi-thread immediately. Map the org chart — target the champion's boss, a technical evaluator, and an end-user advocate." |
| No PoV path | "Propose a 90-day Proof of Value. Frame it as: 'What if we proved this with your real invoices in 90 days, zero risk?'" |
| ERP unknown | "Confirm ERP environment. This gates the technical design. Ask: 'What ERP system handles your AP processing today?'" |
| Volume not validated | "Validate invoice volumes. Ask: 'How many invoices does your AP team process monthly? What percentage are PO-backed?'" |
| No budget holder | "Identify the budget owner. Ask: 'Who controls the budget for finance technology investments?'" |
| Stalled (21+ days) | "Re-engage with value. Send a relevant case study or industry benchmark. Consider: is this deal still viable?" |
| Close date passed | "Reset the close date to a realistic target. If the deal has stalled, either re-qualify or move to nurture." |

**Pipeline-level recommendations:**
- If coverage < 3x: "Pipeline coverage is thin. Prioritize prospecting — run `/gtm:outbound-prep` for target accounts."
- If mid-pipeline is empty: "Conversion gap between {stage} and {stage}. Review discovery process — are we advancing deals effectively?"
- If late-stage deals have low health: "Multiple late-stage deals are under-qualified. Risk of slippage is high. Shore up {specific criteria} before advancing."

### Step 6: Output Pipeline Review

```
Pipeline Review — {Date}
Data Source: HubSpot (live pull)
Open Deals: {n}
Total Unweighted Pipeline: ${X}
Total Weighted Pipeline: ${X}

═══════════════════════════════════════
PIPELINE BY STAGE
═══════════════════════════════════════
{Stage}          {n} deals    ${X}    Avg {X} days in stage
...
Total            {n} deals    ${X}

═══════════════════════════════════════
DEAL HEALTH SUMMARY
═══════════════════════════════════════
Strong (80-100):   {n} deals — ${X} — Ready to advance
Moderate (60-79):  {n} deals — ${X} — Gaps to address
At Risk (40-59):   {n} deals — ${X} — Missing critical criteria
Critical (0-39):   {n} deals — ${X} — Stalled or under-qualified

═══════════════════════════════════════
DEAL-BY-DEAL SCORECARD
═══════════════════════════════════════
{Company} — ${amount} — {stage} — Health: {score}/100
  [x] Champion    [x] Multi-threaded    [ ] PoV
  [x] ERP known   [ ] Volume validated  [x] Budget holder
  [ ] Recent activity   [x] Next step
  → Action: {primary recommendation}

...

═══════════════════════════════════════
VELOCITY FLAGS
═══════════════════════════════════════
Stalled (21+ days no activity):
  - {Deal}: {days} days idle — Last activity: {date}

Slipped (close date passed):
  - {Deal}: Expected close {date} — Currently at {stage}

Zombie (90+ days total cycle):
  - {Deal}: {days} days in pipeline — Consider: re-qualify or archive

═══════════════════════════════════════
PIPELINE HEALTH INDICATORS
═══════════════════════════════════════
Coverage Ratio:        {X}x (target: 3x+)
Avg Deal Health:       {score}/100
Deals with Activity:   {n}/{total} in last 14 days
New Pipeline (30d):    ${X} added
Conversion Rate:       {X}% stage-over-stage (last 90d)

═══════════════════════════════════════
TOP 3 ACTIONS
═══════════════════════════════════════
1. {Highest-impact pipeline action with specific deal reference}
2. {Second action}
3. {Third action}
```

## Troubleshooting

### Very few deals in HubSpot
If the pipeline has fewer than 5 open deals, focus the review on deal quality over pipeline shape. Recommend prospecting activity with `/gtm:outbound-prep` for ICP accounts.

### Missing HubSpot properties
Many health criteria depend on custom properties (`erp_system`, `ap_invoice_volume_annual`, etc.). If these are unpopulated across most deals, flag this as a CRM hygiene issue and recommend a data cleanup sprint. Still score deals on available criteria.

### Large pipeline (50+ deals)
Group deals by stage and focus detailed scoring on deals at Proposal stage or later. For earlier-stage deals, provide summary statistics only. Highlight the top 10 deals by weighted amount for individual attention.
