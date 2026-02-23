---
description: Post-call summary from Fathom transcripts with Esker-specific extraction, HubSpot updates, and follow-up email drafting.
---

# /gtm:call-summary

Pull a call transcript from Fathom, produce a structured summary with Esker-specific extraction, and offer to update HubSpot and draft follow-up emails.

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

### Step 2: Pull CRM Context

Search HubSpot for the company/contacts from the call:
- Existing deal stage, amount, pipeline
- Contact records for attendees
- Prior activity and notes for context on what was discussed before

### Step 3: Generate Structured Summary

```
## Call Summary: {Meeting Title}

### Meeting Details
- Date: {date}
- Duration: {minutes}
- Attendees: {list with titles}
- Meeting Type: {discovery / demo / follow-up / negotiation / other}

### Executive Summary
{3-5 sentence overview of what was discussed and key outcomes}

### Key Discussion Points
{Bulleted list of major topics covered}

### Esker-Specific Extraction

**Pain Points Identified:**
{Map each pain point to an Esker solution area:}
- {Pain point} → {Esker capability: AP Automation / AR Automation / S2P / etc.}

**Competitor Mentions:**
- {Coupa / SAP Ariba / AvidXchange / Manual / None mentioned}
- Context: {what was said about them}

**ERP Environment:**
- System(s): {SAP / Oracle / NetSuite / Dynamics / Other / Not discussed}
- Context: {any integration concerns or migration plans mentioned}

**Invoice Volumes:**
- AP: {volume mentioned or "Not discussed"}
- AR: {volume mentioned or "Not discussed"}

**Budget / Timeline:**
- Budget: {mentioned or "Not discussed"}
- Timeline: {urgency signals or "Not discussed"}
- Decision process: {who else is involved, approval steps mentioned}

### Commitments Made
**We committed to:**
{Bulleted list of our action items}

**They committed to:**
{Bulleted list of their action items}

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

### Step 4: Offer HubSpot Updates

After generating the summary, offer to:
1. **Update deal stage** — if the call moved the deal forward
2. **Log a call activity** — attach the summary to the deal/contact record
3. **Create tasks** — for each commitment we made
4. **Update contact properties** — title, role, or other details learned
5. **Update company properties** — ERP, invoice volumes, strategic goals if newly learned

Use `mcp__claude_ai_HubSpot__manage_crm_objects` for updates. Always confirm with the user before writing to CRM.

### Step 5: Draft Follow-Up Email

Draft a follow-up email using Baseline voice from BRAND_GUIDE.md:
- Reference specific discussion points from the call
- Restate commitments (ours and theirs)
- Attach or link any materials promised
- Clear next step with a specific date/time proposal
- Tone: consultative, not salesy. Data-led per brand guide.

Offer to create the draft in Gmail.

### Step 6: Output

```
Call Summary: {Meeting Title}
Date: {date}
Company: {company}
Deal Stage: {current → recommended}

Key Findings:
- Pain: {primary pain points}
- Competitors: {mentioned or "None"}
- ERP: {system or "Unknown"}
- Volumes: {AP/AR volumes or "TBD"}

Actions Available:
1. Update HubSpot deal stage → {recommended stage}
2. Log call activity to {deal/contact}
3. Create {N} follow-up tasks
4. Draft follow-up email

Reply with which actions to take, or "all" to execute everything.
```

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
