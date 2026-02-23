---
description: Daily sales briefing — calendar, pipeline, emails, Fathom calls, and prioritized action list
---

# /gtm:morning-brief

Extended daily sales briefing. Builds on the base daily briefing with pipeline snapshot, email triage, and call transcript review.

## Usage

```
/gtm:morning-brief
```

No arguments needed — pulls data for today automatically.

## What This Does

Start your day with one command. Gets your calendar, pipeline status, unread emails, and recent call transcripts, then synthesizes everything into a prioritized action list with your #1 priority highlighted.

## Steps

### Step 1: Base Daily Briefing
Invoke `/gtm:daily-briefing` using the Skill tool.

This produces: today's calendar overview, pipeline summary, and flagged items needing attention. This is the foundation that the remaining steps build on.

### Step 2: Esker Pipeline Snapshot from HubSpot
Pull the current pipeline state from HubSpot:

- Deals by stage (count and total value per stage)
- Total pipeline value
- Deals closing this week (names, amounts, next steps needed)
- Deals closing this month (names, amounts, current status)
- Any deals that have slipped past their close date

### Step 3: Email Triage
Check Gmail for unread emails needing attention from active deal contacts:

- Unread emails from contacts associated with active HubSpot deals
- Flag urgent responses needed (e.g., prospect asking a question, legal review request, meeting confirmation)
- Highlight any new inbound interest or replies to outbound sequences

### Step 4: Recent Call Review
Check Fathom for any recent call transcripts to review:

- Calls from the last 24-48 hours
- Key takeaways and action items from each call
- Any commitments made that need follow-up today

### Step 5: Synthesize Prioritized Action List
Combine all inputs into a single prioritized action list:

- Rank actions by urgency and deal impact
- Highlight the **#1 priority** for the day — the single most important thing to do first
- Group remaining actions: urgent (do today), important (do this week), monitor (keep on radar)

## Deliverables

Return a structured daily brief to the user:

1. **Today's Schedule** — Meetings and calls with context on each
2. **Pipeline Snapshot** — Deals by stage, total value, deals closing soon
3. **Email Flags** — Unread emails needing response from deal contacts
4. **Call Follow-Ups** — Action items from recent Fathom transcripts
5. **Prioritized Action List** — Numbered list with #1 priority highlighted

## Example Output

> **Morning Brief — {date}**
>
> **Schedule**: {N} meetings today. Next: {meeting} at {time} with {company}.
>
> **Pipeline**: $X total across {N} deals. {N} closing this week ($X).
>
> **Emails**: {N} unread from deal contacts. Urgent: {contact} at {company} asking about {topic}.
>
> **Call Follow-Ups**: {N} action items from yesterday's calls.
>
> **#1 Priority**: {specific action} — {why it matters and what's at stake}
>
> **Today**:
> 1. {action}
> 2. {action}
> 3. {action}
>
> **This Week**:
> - {action}
> - {action}
