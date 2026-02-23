---
description: Morning pipeline snapshot combining Google Calendar, HubSpot pipeline, Gmail inbox, and Fathom transcripts into a prioritized daily action plan.
---

# /gtm:daily-briefing

Generate a morning briefing with today's meetings, pipeline health, unread emails needing attention, and priority actions for the day.

## Usage

```
/gtm:daily-briefing
/gtm:daily-briefing tomorrow
```

## Instructions

### Step 1: Google Calendar — Today's Meetings

Pull today's (or specified day's) calendar:
- Meeting title, time, duration, attendees
- For each meeting: note the company and any HubSpot deal association
- Flag meetings that need prep (discovery calls, demos, executive meetings)
- Highlight back-to-back blocks where prep time is limited

### Step 2: HubSpot — Pipeline Snapshot

Load HubSpot tools and pull pipeline data:

1. **Deals by stage** — search for all open deals, group by stage:
   - Qualification
   - Discovery
   - Proposal / PoV
   - Negotiation
   - Closed Won (this month)
2. **Deal alerts** — flag deals that need attention:
   - Close date passed or within 7 days
   - No activity in 14+ days (stale)
   - Stage hasn't changed in 30+ days (stuck)
   - High-value deals ($100K+) without next steps logged
3. **Pipeline value** — total open pipeline, weighted pipeline, deals closing this month/quarter

### Step 3: Gmail — Inbox Scan

Check Gmail for unread messages needing response:
- Emails from contacts associated with active deals
- Emails from prospects or partners
- Flag anything urgent or time-sensitive
- Skip newsletters, notifications, and automated emails

### Step 4: Fathom — Recent Transcripts

Check Fathom (`mcp__claude_ai_Fathom__list_meetings`) for:
- Calls from the last 2 business days that haven't been summarized
- Any transcripts with action items that are due today
- Flag calls that need follow-up (use `/gtm:call-summary` to process)

### Step 5: Build the Daily Briefing

```
## Daily Briefing — {Day, Month Date, Year}

### Today's Schedule
{Chronological list of meetings:}
- **{Time}** — {Meeting Title} with {Key Attendee(s)}
  - Deal: {deal name, stage, value} or "No associated deal"
  - Prep needed: {Yes/No — link to /gtm:call-prep if yes}

### Pipeline Snapshot
- Open Deals: {count} totaling {$X.XM}
- Weighted Pipeline: {$X.XM}
- Closing This Month: {count} deals, {$X.XM}

**By Stage:**
| Stage | Deals | Value |
|-------|-------|-------|
| {stage} | {n} | {$X} |

### Deal Alerts
{Prioritized list of deals needing attention:}
- {Alert icon} **{Company}** — {issue: stale, overdue, stuck, etc.}
  - Last activity: {date}
  - Recommended action: {specific next step}

### Emails Needing Response
{Top priority emails:}
- **{From}** — {Subject} ({time received})
  - Context: {associated deal or relationship}

### Unprocessed Calls
{Fathom transcripts needing review:}
- **{Meeting}** ({date}) — Run `/gtm:call-summary` to process

### Priority Actions
{Ranked list of 3-5 actions for today:}
1. {Action} — {why it matters, deadline}
2. {Action} — {why it matters, deadline}
3. {Action} — {why it matters, deadline}
```

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
