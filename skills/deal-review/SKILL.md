---
description: Review a deal's health using HubSpot, Fathom, and Notion data — scorecard with recommended next steps
---

# /gtm:deal-review

Review a deal's health and get actionable next steps. Pulls live data from HubSpot, Fathom, and Notion to build a comprehensive deal health scorecard.

## Usage

```
/gtm:deal-review {company}
```

## What This Does

Aggregates data from multiple sources to assess deal health against the team's qualification framework. Identifies risks, gaps, and specific next actions to advance the deal.

## Steps

### Step 1: Pull Deal Data from HubSpot
Search HubSpot for the company. Get associated deals, contacts, and recent activities.

- Search companies by name
- Get all associated deals (stage, amount, close date, owner)
- Get associated contacts (titles, last activity dates)
- Get recent activity timeline (emails, meetings, calls, notes)

### Step 2: Check Fathom for Recent Calls
Search Fathom for recent call transcripts with this company.

- Look for transcripts from the last 30 days
- Extract key discussion points, commitments made, objections raised
- Note any action items or next steps mentioned on calls

### Step 3: Fetch Qualification Criteria from Notion
Search Notion for the team's sales methodology and qualification criteria.

- Search for "BANT" and "3Ps" qualification frameworks
- Search for "sales stages" and "deal progression" criteria
- Get the current definitions of what "good" looks like at each stage

### Step 4: Generate Deal Health Assessment
Synthesize all data into a structured health scorecard:

- **Deal Stage vs. Timeline**: Is the deal progressing at expected velocity? Any stage stalls?
- **BANT Qualification Status**: Budget (confirmed/exploring/unknown), Authority (decision maker identified?), Need (pain validated?), Timeline (deadline established?)
- **3Ps Qualification Status**: Pain (quantified?), Power (champion identified and engaged?), Process (buying process mapped?)
- **Champion Status**: Has a champion been identified? Are we multi-threaded across stakeholders?
- **PoV Status**: Has a Proof of Value been proposed? Accepted? In progress? What are the success criteria?
- **Competitive Landscape**: Who else is the prospect evaluating? How are we positioned?
- **Risk Factors**: Stalled stages, single-threaded relationships, missing stakeholders, unclear timeline, budget concerns
- **Blockers**: Anything preventing the deal from advancing right now

### Step 5: Recommend Next Steps
Based on the assessment, provide specific, actionable recommendations:

- What meetings to schedule and with whom
- What information to gather or validate
- What materials to send or present
- What risks to mitigate and how
- Priority ranking: what is the single most important action?

## Deliverables

Return a structured deal health scorecard to the user:

1. **Deal Overview** — Company, deal amount, stage, close date, owner, days in current stage
2. **Health Scorecard** — BANT/3Ps status, champion status, PoV status, competitive positioning (each rated Green/Yellow/Red)
3. **Recent Activity** — Last 3-5 touchpoints with the account (from HubSpot + Fathom)
4. **Risk Assessment** — Top risks with severity ratings
5. **Recommended Actions** — Prioritized list of specific next steps with the #1 priority highlighted

## Example Output

> **Deal Review: {company}**
>
> **Deal**: $X, {stage}, close date {date} ({N} days in stage)
>
> | Category | Status | Notes |
> |----------|--------|-------|
> | Budget | Yellow | Exploring, no formal allocation |
> | Authority | Green | VP Finance engaged, CTO aware |
> | Need | Green | AP pain validated, 50K invoices/yr |
> | Timeline | Red | No firm deadline established |
> | Champion | Yellow | VP Finance supportive but not driving |
> | PoV | Green | Proposed, awaiting legal review |
> | Competition | Yellow | Coupa also evaluating |
>
> **#1 Priority**: Schedule executive sponsor meeting to establish timeline and budget commitment.
