---
description: Pre-call brief combining calendar context, Fathom transcripts, HubSpot deal data, and Esker methodology into an actionable meeting prep document.
---

# /gtm:call-prep

Generate a pre-call brief for an upcoming meeting. Pulls calendar details, prior call transcripts, CRM context, and Esker methodology to produce a structured prep doc with agenda, talk tracks, and questions.

## Usage

```
/gtm:call-prep "Acme Corp discovery call"
/gtm:call-prep tomorrow 2pm
/gtm:call-prep <meeting-title-or-time>
```

## Instructions

### Step 1: Get Meeting Details from Google Calendar

Load Google Calendar tools and find the meeting:
- Search by meeting title, company name, or time reference
- Extract: title, date/time, duration, attendees (names + emails), description/agenda, meeting link

### Step 2: Research Attendees

For each attendee:
1. **HubSpot** — search contacts for each attendee email/name. Pull title, company, last activity, associated deals, notes
2. **Fathom** — check for prior call transcripts with these attendees (`mcp__claude_ai_Fathom__list_meetings`, then `mcp__claude_ai_Fathom__get_summary` for relevant ones)
3. **Web search** — LinkedIn profile, role context, recent publications or speaking engagements

### Step 3: Pull Deal Context from HubSpot

**Read `references/esker-pipeline.md` to interpret deal stages correctly. NEVER rely on the dealstage enumeration.**
**Read `references/esker-deal-properties.md` for the full property map.**

Search for the company in HubSpot:
- Deal stage, amount, close date, pipeline
- Activity timeline — last emails, calls, meetings logged
- Company properties — invoice volumes, ERP, strategic goals
- Any notes or tasks from previous interactions

### Step 4: Check Notion for Methodology

Search Notion for:
- Discovery framework and question bank (reference `references/discovery-framework.md`)
- BANT/3Ps qualification criteria
- Stage-specific coaching (what should happen at this deal stage)
- Any account-specific notes the team has captured

### Step 5: Pull Esker Methodology from Google Drive

Search Google Drive Esker folder for:
- "How Esker Sells Esker" — relevant sections for this meeting type
- Industry-specific talk tracks or case studies
- Reference `references/esker-methodology.md` for key frameworks

### Step 6: Review Prior Call History

If Fathom returned transcripts from prior calls with this account:
- Summarize key topics discussed
- Note any commitments made (by us or by prospect)
- Flag open questions that were deferred
- Identify competitor mentions, ERP details, or pain points revealed

### Step 7: Build the Pre-Call Brief

```
## Pre-Call Brief: {Meeting Title}

### Meeting Details
- Date/Time: {date, time, timezone}
- Duration: {minutes}
- Location: {meeting link or in-person}
- Our attendees: {names}

### Attendee Intel
{For each external attendee:}
- **{Name}** — {Title} at {Company}
  - HubSpot: {contact status, last activity}
  - Prior calls: {summary of Fathom transcripts or "No prior calls"}
  - Background: {LinkedIn context, relevant experience}
  - Likely priorities: {based on persona from BRAND_GUIDE.md}

### Deal Status
- Stage: {current stage}
- Amount: {deal value}
- Close Date: {target}
- Last Activity: {date and type}
- Key context: {notable deal notes}

### Prior Conversation Summary
{From Fathom transcripts — what was discussed, what was promised, what's outstanding}

### Recommended Agenda
{Based on deal stage and Esker methodology:}
1. {Opener — reference something from prior conversation or company news}
2. {Core topic — aligned to meeting purpose}
3. {Discovery questions — from Notion framework, tailored to this account}
4. {Next steps — what outcome are we driving toward}

### Esker-Specific Discussion Points
- Current AP/AR workflow — {what do we know? what do we need to learn?}
- ERP environment — {known system or "Need to confirm"}
- Invoice volumes — {known or "Key discovery question"}
- Pain points mapped to Esker solutions — {from prior calls or research}

### Questions to Ask
{5-7 targeted questions pulling from:}
- Discovery framework (Notion)
- Gaps in HubSpot data
- Follow-ups from prior Fathom transcripts
- Esker qualification criteria (ERP, volume, pain)

### Competitive Intel
{Any competitor mentions from prior calls or research}

### Talk Tracks
{2-3 Challenger-style angles based on what we know, referencing BRAND_GUIDE.md persona messaging for the likely audience}

### Risk Flags
{Anything concerning: stalled deal, ghosting, competitor evaluation, misaligned stakeholders}
```

### Step 8: Write Pre-Call Research Brief to HubSpot

**ALWAYS write the research brief to HubSpot.** This ensures prep work survives rescheduling, handoffs, and is available to team members who don't have Fathom access. If Andrew needs to run a demo next week, he should find this prep in HubSpot.

#### 8a: Load Reference Data
Read `references/esker-pipeline.md` and `references/esker-deal-properties.md` for property names and stage IDs.

#### 8b: Create HubSpot Note

Create a note associated with the deal (if one exists) AND the company:

**Note content:**

```
<h2>Pre-Call Research Brief</h2>
<p><strong>Prepared for:</strong> {meeting title}</p>
<p><strong>Meeting date:</strong> {date/time}</p>
<p><strong>Attendees:</strong> {list with titles}</p>
<hr>

<h3>Attendee Intel</h3>
{Condensed version of the attendee research — name, title, HubSpot status, prior call history, background}

<h3>Deal Context</h3>
{Current stage (using Esker pipeline names), amount, key history, recent activity}

<h3>Prior Conversation Summary</h3>
{From Fathom transcripts — what was discussed before, outstanding commitments}

<h3>Key Questions Planned</h3>
<ol>
<li>{question 1}</li>
<li>{question 2}</li>
</ol>

<h3>Research Sources</h3>
<p>{What was checked: HubSpot, Fathom, web research, Notion, Google Drive}</p>
```

Use `manage_crm_objects` with objectType `notes`, setting `hs_note_body` and `hs_timestamp`, with associations to deal and company.

#### 8c: Update Company Properties (if enriched)

If web research in Steps 2-4 found new data not already in HubSpot, update the company record:
- `erp_system` — if discovered and current HubSpot value is empty
- `annualrevenue` — if found from public filings and current value is empty
- `numberofemployees` — if found and current value is empty
- `ap_invoice_volume_annual` / `ar_invoice_volume_annual` — if estimated from filings

Use exact property names from `references/esker-deal-properties.md`. Only update properties where the current HubSpot value is empty/unknown. These are low-risk enrichments from public data — no user confirmation needed.

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
