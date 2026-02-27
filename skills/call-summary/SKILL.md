---
description: Post-call summary from Fathom transcripts with Esker-specific extraction, mandatory HubSpot writeback (company, contacts, deal, cumulative note), and follow-up email drafting.
---

# /gtm:call-summary

Pull a call transcript from Fathom, produce a structured summary with Esker-specific extraction, write all findings to HubSpot, and draft a follow-up email.

## Usage

```
/gtm:call-summary
/gtm:call-summary "Acme Corp discovery call"
/gtm:call-summary latest
```

## Instructions

### Step 1: Find the Call in Fathom

Load Fathom tools (`mcp__claude_ai_Fathom__list_meetings`):
- If a meeting name is given, search for it
- If "latest" or no argument, get the most recent call
- Pull the transcript (`mcp__claude_ai_Fathom__get_transcript`) and summary (`mcp__claude_ai_Fathom__get_summary`)
- Note the Fathom recording ID — you'll need the share link for the HubSpot note

### Step 2: Pull CRM Context and Prior History

**Read reference files first:**
- Read `references/esker-pipeline.md` — for deal stage IDs
- Read `references/esker-deal-properties.md` — for property names and valid values

**Search HubSpot for the company/contacts from the call:**
- Company record with properties from the deal properties reference
- Contact records for all attendees
- Existing deal — stage, amount, pipeline, associated company
- **All existing notes on the deal** — fetch using `search_crm_objects` with objectType `notes` and association filter for the deal ID. These are needed for cumulative synthesis in Step 3.

**Search Fathom for ALL prior calls with this account:**
- Search by company name in `list_meetings`
- Pull summaries for all matching calls (not just this one)
- These are needed for cumulative synthesis in Step 3

### Step 3: Generate Structured Summary

```
## Call Summary: {Meeting Title}

### Meeting Details
- Date: {date}
- Duration: {minutes}
- Attendees: {list with titles}
- Meeting Type: {discovery / demo / follow-up / negotiation / other}
- Fathom Link: {share URL}

### Executive Summary
{3-5 sentence overview of what was discussed and key outcomes from THIS call}

### Key Discussion Points
{Bulleted list of major topics covered}

### Esker-Specific Extraction

**Pain Points Identified:**
{Map each pain point to an Esker solution area:}
- {Pain point} → {Esker module from esker-deal-properties.md}

**Competitor Mentions:**
- {Coupa / SAP Ariba / AvidXchange / Manual / None mentioned}
- Context: {what was said about them}

**ERP Environment:**
- System(s): {match to valid erp_system enumeration value from reference}
- Context: {any integration concerns or migration plans mentioned}

**Invoice Volumes:**
- AP: {volume mentioned or "Not discussed"}
- AR: {volume mentioned or "Not discussed"}

**Budget / Timeline:**
- Budget: {mentioned or "Not discussed"}
- Timeline: {urgency signals or "Not discussed"}
- Decision process: {who else is involved, approval steps mentioned}

### Cumulative Deal Status
{CRITICAL SECTION — Synthesize ALL prior Fathom transcripts + ALL prior HubSpot notes into a "story so far" narrative. This is NOT just this call. Include:
- How the relationship started (first touchpoint, who initiated, when)
- Key information gathered across ALL prior interactions
- Evolution of requirements and pain points over time
- All commitments made by both sides (fulfilled and still outstanding)
- Current qualification state (BANT/3Ps) based on cumulative knowledge
- What changed or was confirmed in THIS call

If this is the FIRST call, state that and summarize what was learned as the baseline.}

### Commitments Made
**We committed to:**
{Bulleted list of our action items from THIS call}

**They committed to:**
{Bulleted list of their action items from THIS call}

### Qualification Update (BANT)
- Budget: {known / unknown / signals}
- Authority: {decision maker identified? who?}
- Need: {confirmed pain? urgency level?}
- Timeline: {target dates? triggers?}

### Recommended Next Steps
{Prioritized actions:}
1. {Action — who, by when}
2. {Action — who, by when}
3. {Action — who, by when}
```

### Step 4: Prepare HubSpot Writeback

After generating the summary, prepare ALL of the following updates. Present them to the user as a diff table (current value vs. proposed value), then execute all when the user replies "go" (or any affirmative). The user can skip specific items, but the default is to write everything.

**This is NOT optional. Writeback is the expected outcome of every call summary.**

#### 4a: Company Record Updates

Update these properties on the company record if new information was extracted from the call:
- `erp_system` — if ERP was discussed (use company-level property)
- `annualrevenue` — if revenue was mentioned
- `numberofemployees` — if employee count was mentioned
- `ap_invoice_volume_annual` / `ar_invoice_volume_annual` — if volumes discussed
- `dso_current` — if DSO was mentioned
- `strategic_goals_summary` — if strategic priorities were mentioned

Use exact property names and values from `references/esker-deal-properties.md`.

#### 4b: Contact Record Updates

**For each attendee on the call:**
1. Search HubSpot for the contact by email
2. If found: update `jobtitle`, `phone`, or other properties if new info was learned
3. If NOT found: CREATE the contact with `firstname`, `lastname`, `email`, `jobtitle`, and associate with company AND deal
4. Ensure all contacts are associated with both the company and the deal

**For new contacts mentioned during the call (not on the call but referenced by name/title):**
1. Create a contact with whatever info is available (name, title, role mentioned)
2. Associate with company and deal
3. Flag to user: "Created contact {name} ({title}) based on call mention — needs email address"

#### 4c: Deal Record Updates

**Read `references/esker-pipeline.md` for stage IDs. NEVER look up stages via the HubSpot API.**

Update the deal record with ALL applicable properties:
- `dealstage` + `pipeline` — if the call moved the deal forward. ALWAYS set both using hardcoded IDs from the pipeline reference
- `hs_next_step` — from the "Recommended Next Steps" section (always update this)
- `key_pain_points` — semicolon-separated pain points from extraction
- `situation_overview` — if this is a discovery or early-stage call, or if situation significantly evolved
- `decision_process` — if buying process was discussed
- `champion_notes` — if champion information was revealed or updated
- `erp_system` — use valid enumeration value from deal properties reference
- `esker_modules_offered` — based on which Esker solutions were discussed, semicolon-separated
- `business_impact_description` — if business impact was quantified
- ROI fields (`roi_current_dso_days`, `roi_collections_team_size`, `roi_cash_app_team_size`, `roi_average_ar_balance_cad`, etc.) — if specific numbers were mentioned
- Volume fields (`ap_invoices_per_year`, `invoices_per_year`, `ar_payments_per_year`, `current_dso`) — if discussed

#### 4d: Create HubSpot Note

Create a note associated with the deal, company, AND all relevant contacts.

**Note content:**

```
<h2>Call Summary: {Meeting Title}</h2>
<p><strong>Date:</strong> {date} | <strong>Duration:</strong> {duration} | <strong>Type:</strong> {meeting type}</p>
<p><strong>Attendees:</strong> {list with titles}</p>
<p><strong>Fathom Recording:</strong> <a href="{fathom_share_url}">View Recording</a></p>
<hr>

<h3>Executive Summary</h3>
<p>{3-5 sentence summary of THIS specific call}</p>

<h3>Cumulative Deal Status</h3>
<p>{The full "story so far" narrative from Step 3 — synthesized from ALL prior Fathom transcripts and HubSpot notes. Anyone reading this note should get the complete picture without needing Fathom access or reading prior notes.}</p>

<h3>Key Discussion Points</h3>
<ul>
<li>{point 1}</li>
<li>{point 2}</li>
</ul>

<h3>Pain Points</h3>
<ul>
<li>{pain point} → {Esker module}</li>
</ul>

<h3>Commitments</h3>
<p><strong>We committed to:</strong></p>
<ul><li>{items}</li></ul>
<p><strong>They committed to:</strong></p>
<ul><li>{items}</li></ul>

<h3>Next Steps</h3>
<ol>
<li>{action — who, by when}</li>
</ol>
```

Use `manage_crm_objects` with objectType `notes`, setting `hs_note_body` (HTML content) and `hs_timestamp`, with associations to the deal, company, and all contacts.

#### 4e: Verify Deal-Company Association

After all updates:
1. Check the deal's associations — confirm it is associated with the correct company
2. If no company association exists, CREATE the association
3. If a WRONG company is associated, flag to the user (do NOT auto-fix — it could be intentional)

### Step 5: Execute Writeback

Present the diff table to the user:

```
HubSpot Updates Prepared:
| Record              | Property               | Current → Proposed          |
|---------------------|------------------------|-----------------------------|
| Deal: {name}        | dealstage              | Discovery → Needs Analysis  |
| Deal: {name}        | hs_next_step           | (empty) → Send SOW by 3/10  |
| Deal: {name}        | esker_modules_offered  | (empty) → ar;cash_app       |
| Company: {name}     | erp_system             | (empty) → SAP S/4HANA       |
| Contact: {name}     | jobtitle               | (empty) → VP Treasury       |
| NEW Contact         | {name} ({title})       | Created — needs email       |
| Note                | Call Summary           | {N} associations            |
| Association         | Deal ↔ Company         | Verified ✓                  |

Reply "go" to execute all updates, or specify items to skip.
```

Execute all updates using `manage_crm_objects`. Confirm each write succeeded.

### Step 6: Draft Follow-Up Email

Draft a follow-up email using Baseline voice from BRAND_GUIDE.md:
- Reference specific discussion points from the call
- Restate commitments (ours and theirs)
- Attach or link any materials promised
- Clear next step with a specific date/time proposal
- Tone: consultative, not salesy. Data-led per brand guide.

Offer to create the draft in Gmail.

### Step 7: Output

```
Call Summary: {Meeting Title}
Date: {date}
Company: {company}
Deal Stage: {current → updated}

HubSpot Writeback: ✓ Complete
- {N} properties updated across deal, company, contacts
- Note created with cumulative deal context
- {N} contacts created/updated
- Deal-company association verified

Follow-up email draft: {ready / created in Gmail}
```

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
