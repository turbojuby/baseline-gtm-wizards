---
description: Build multi-touch email sequences for HubSpot — cold outbound, post-event follow-up, nurture, PoV proposal, and re-engagement with Esker value props.
---

# /gtm:email-sequence

Build a multi-touch email sequence for execution in HubSpot. Covers the full range of Baseline's outbound and nurture motions — cold outbound, post-event follow-up, post-discovery nurture, PoV proposal, and re-engagement sequences. All emails use Challenger Sales framing, Esker proof points, and persona-specific messaging.

## Usage

```
/gtm:email-sequence "cold outbound to manufacturing CFOs"
/gtm:email-sequence "post-event follow-up for AP Summit attendees"
/gtm:email-sequence "PoV proposal for {company}"
/gtm:email-sequence "re-engage gone-dark deals"
/gtm:email-sequence "post-discovery nurture for {company}"
```

## How It Works

1. **Brief** — Parse sequence type, audience, and context
2. **Persona** — Load persona messaging from BRAND_GUIDE.md
3. **Research** — Pull relevant data for personalization
4. **Draft** — Write the full sequence with timing and subject lines
5. **HubSpot** — Provide setup instructions for HubSpot sequences

## Instructions

### Step 1: Identify Sequence Type

| Type | Touches | Cadence | Goal |
|------|---------|---------|------|
| Cold outbound | 4-5 emails | Days 1, 3, 7, 14, 21 | Book a discovery meeting |
| Post-event follow-up | 3-4 emails | Days 1, 3, 7, 14 | Convert event connection to meeting |
| Post-discovery nurture | 3-4 emails | Days 2, 7, 14, 28 | Keep momentum after initial call |
| PoV proposal | 3 emails | Days 1, 4, 10 | Get PoV agreement signed |
| Re-engagement (gone dark) | 3-4 emails | Days 1, 7, 21, 45 | Restart stalled conversation |

### Step 2: Load Persona Messaging

```
Read: BRAND_GUIDE.md
```

Match email angle to the target persona:

| Persona | Email Angle | Lead With |
|---------|-------------|-----------|
| CFO / VP Finance | Financial impact, peer benchmarks | "$X working capital freed" or "Your DPO vs. peers" |
| Controller | Process efficiency, compliance | "Cost per invoice: $18 → $3" or "Audit prep: 40 hours → 4" |
| AP Manager | Team capacity, automation rates | "80% touchless processing" or "Your team on strategic work" |
| CIO / IT | Integration speed, maintenance | "Live in 90 days, any ERP" or "Zero maintenance overhead" |

### Step 3: Research for Personalization

**For account-specific sequences (PoV proposal, post-discovery, named outbound):**

```
ToolSearch: "+hubspot search"
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "companies"
  searchTerm: "{company-name}"
```

Pull:
- Company data: industry, revenue, ERP, invoice volumes, DSO
- Contact data: name, title, last interaction
- Deal data: stage, amount, notes from last activity
- Fathom: recent call transcripts for context

```
ToolSearch: "+fathom"
Tool: mcp__claude_ai_Fathom__list_meetings
```

**For segment-based sequences (cold outbound, event follow-up):**
- Web search for industry trends and pain points
- Esker case studies in the target industry
- Recent news or triggers (earnings, M&A, leadership changes)

### Step 4: Write the Sequence

**Baseline email style rules:**
- **Confident, data-led, concise** — no hedge words ("just checking in," "I hope this finds you well")
- **No markdown formatting** — emails render as plain text in most clients. No bold, no bullet points, no headers.
- **Short paragraphs** — 1-3 sentences max per paragraph
- **One idea per email** — each email has a single point and a single ask
- **Subject lines** — 4-8 words, curiosity or value-driven, no clickbait
- **Challenger framing** — teach them something, reframe their thinking, push toward action
- **Personalization** — reference their company, industry, or specific situation in the first sentence
- **CTA** — one clear ask per email (reply, meeting, resource)

---

### Sequence Templates

**COLD OUTBOUND (Challenger Approach)**

```
Email 1 — The Reframe (Day 1)
Subject: {provocative stat about their industry}

{First name},

{One sentence connecting a specific company/industry fact to AP/AR pain.}

{The insight: what most companies in their space get wrong about AP automation.
Reference a peer benchmark or industry stat.}

{One sentence on what the best companies are doing differently.}

Worth a 15-minute conversation to see if this applies to {company}?

Tyler
Baseline Payments
```

```
Email 2 — The Proof Point (Day 3)
Subject: {case study hook: "How [similar company] cut invoice costs 78%"}

{First name},

{Reference Email 1 briefly — "I mentioned {topic} last week."}

{Specific case study or data point. Name the customer result:
touchless rate, cost reduction, DSO improvement.}

{One sentence tying the result to their situation.}

Happy to share how this would look for {company}. 15 minutes this week?

Tyler
```

```
Email 3 — The Teaching Moment (Day 7)
Subject: {educational angle: "The $X question for {industry} AP teams"}

{First name},

{Share a non-obvious insight about their industry or AP challenge.
Challenger Sales = teach them something they didn't know.}

{2-3 sentences expanding the insight with data.}

{Connect to Esker's approach without being salesy.}

If this resonates, I'd like to show you what we're seeing across {industry}. Quick call?

Tyler
```

```
Email 4 — The Direct Ask (Day 14)
Subject: {straightforward: "AP automation for {company}"}

{First name},

{Brief recap of value prop — 1 sentence.}

{The ask: specific meeting request with a reason to act now.
Reference 90-day PoV as low-risk next step.}

Would {day} or {day} work for a 20-minute call?

Tyler
```

```
Email 5 — The Breakup (Day 21)
Subject: {closing: "Closing the loop"}

{First name},

{Acknowledge they're busy — no guilt trip.}

{Leave one compelling resource (stat, case study link, or insight).}

{Open door: "If timing changes, I'm here."}

Tyler
```

---

**POST-EVENT FOLLOW-UP**

```
Email 1 — Day 1 (Same day or next morning)
Subject: {event reference: "Good meeting you at {event}"}

{Personalized reference to the conversation or session they attended.}
{One specific takeaway or shared interest from the event.}
{Soft next step: "Would love to continue the conversation."}
```

```
Email 2 — Day 3 (Value add)
Subject: {resource: "{relevant case study or stat}"}

{Share something directly relevant to what you discussed.}
{Tie it to their company or role specifically.}
{CTA: meeting or reply.}
```

```
Email 3 — Day 7 (Direct ask)
Subject: {meeting: "Picking up where we left off"}

{Brief reminder of event connection.}
{Specific reason to meet now — reference their pain point or initiative.}
{Concrete meeting ask with proposed times.}
```

---

**POST-DISCOVERY NURTURE**

```
Email 1 — Day 2 (Summary + next steps)
Subject: {recap: "Following up on our {topic} conversation"}

{Reference specific points from the discovery call.}
{Summarize 2-3 key findings or pain points discussed.}
{Confirm next steps agreed on the call.}
{Attach or link relevant resource (teaser deck, case study).}
```

```
Email 2 — Day 7 (Proof point)
Subject: {case study relevant to their top pain}

{Connect a case study to their #1 pain point from discovery.}
{Specific metric from the case study.}
{Frame the 90-day PoV as the logical next step.}
```

```
Email 3 — Day 14 (Champion enablement)
Subject: {internal selling: "Sharing with your team"}

{Provide a resource they can share internally — ROI calculator link, one-pager, business case summary.}
{Frame it as helping them build the internal case.}
{Offer to join an internal presentation if helpful.}
```

---

**POV PROPOSAL**

```
Email 1 — Day 1 (The proposal)
Subject: {direct: "90-Day Proof of Value — {company}"}

{Recap the business case: key metrics from discovery.}
{Outline the PoV structure: 90 days, live production data, measurable results.}
{Specific outcomes they'll validate.}
{Attach the PoV proposal or business case deck.}
{Ask for a call to walk through together.}
```

```
Email 2 — Day 4 (Objection handling)
Subject: {risk reduction: "Why 90 days, not 12 months"}

{Address the most common objection: time, risk, or internal buy-in.}
{Contrast with typical 6-12 month implementations.}
{Reference a similar company that started with PoV and expanded.}
```

```
Email 3 — Day 10 (Urgency)
Subject: {timeline: "PoV timeline for {company}"}

{Reference specific business trigger or timeline they mentioned.}
{Map the 90-day PoV to their fiscal calendar or initiative deadline.}
{Clear next step to get started.}
```

---

**RE-ENGAGEMENT (GONE DARK)**

```
Email 1 — Day 1 (The pattern interrupt)
Subject: {short and different: "Quick question"}

{Don't reference the silence. Start fresh with a new insight.}
{Share something that's changed since you last spoke — new case study, product update, industry shift.}
{Low-pressure ask: "Still on your radar?"}
```

```
Email 2 — Day 7 (The value drop)
Subject: {resource: "{relevant stat or case study}"}

{Share a high-value resource with no ask.}
{One sentence of context on why it's relevant to them.}
{No CTA — just give value.}
```

```
Email 3 — Day 21 (The direct check-in)
Subject: {straightforward: "{company} + Esker"}

{Acknowledge priorities change.}
{Brief recap of the value case (1 sentence).}
{Ask if they want to re-engage or if you should check back next quarter.}
```

### Step 5: HubSpot Setup Instructions

Provide setup steps for the sequence:

```
HUBSPOT SEQUENCE SETUP

Sequence Name: {descriptive name}
Enrollment: {manual / workflow-triggered / list-based}
Sender: Tyler Massey (or specified team member)

STEPS:
1. Email — "{Subject}" — Day 0 — Template: {template name}
2. Email — "{Subject}" — Day {X} — Template: {template name}
3. Email — "{Subject}" — Day {X} — Template: {template name}
...

SETTINGS:
- Send window: 8am-6pm ET, business days only
- Unenroll on: reply, meeting booked, deal created
- Thread emails: No (each email gets its own subject line)
- Tracking: opens, clicks enabled

PERSONALIZATION TOKENS:
- {{contact.firstname}}
- {{company.name}}
- {{company.industry}}
- {any custom tokens needed}
```

### Step 6: Deliver the Sequence

```
Email Sequence: {Name}
Type: {sequence type}
Persona: {target persona}
Touches: {number}
Cadence: {day spacing}

{Full email sequence with subject lines, body copy, and timing}

HubSpot Setup:
{Setup instructions from Step 5}

A/B Test Suggestions:
- Subject line variant for Email 1: {alternate}
- Opening line variant for Email 1: {alternate}

Performance Benchmarks:
- Open rate target: 35-45% (B2B cold), 50-65% (warm/nurture)
- Reply rate target: 5-10% (cold), 15-25% (warm)
- Meeting book rate: 2-5% of sequence (cold), 10-20% (warm)
```

## Troubleshooting

### No company data for personalization
Use industry-level personalization instead of company-specific. Reference their title and industry pain points rather than company metrics. Flag to the user that personalization will improve with HubSpot data.

### User wants a sequence for a persona not in the matrix
Map the new persona to the closest existing one and adapt the messaging angle. Ask the user what this persona cares about most to calibrate the content.

### Sequence feels too long or too short
Adjust based on the relationship warmth:
- Cold/unknown: 4-5 touches over 3 weeks
- Warm/event-met: 3 touches over 2 weeks
- Active deal/nurture: 3-4 touches over 4 weeks
- Gone dark: 3 touches over 6 weeks (longer spacing)

### Emails sound too salesy
Remove any sentence that starts with "We" or "Esker." Every email should start with "you" or a reference to the prospect's world. Cut any sentence that describes a feature without quantifying its impact.
