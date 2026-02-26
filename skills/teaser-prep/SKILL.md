---
description: Quick pre-discovery outreach — research, generate teaser deck, deploy, and draft outreach message
---

# /gtm:teaser-prep

Quick pre-discovery outreach workflow. Research a target, generate a teaser deck, deploy it, and get a suggested outreach message to send with the link.

## Usage

```
/gtm:teaser-prep {company}
```

## What This Does

Lighter-weight than `/gtm:disco-prep`. This is for early-stage outreach when you want to send a compelling teaser before a discovery call is even scheduled. The teaser deck is designed to pique interest and earn the meeting.

## Steps

### Step 1: Account Research
Invoke `/gtm:account-research {company}` using the Skill tool.

Quick research pass — firmographics, ICP score, pain indicators, key contacts, and industry context. This feeds the teaser deck personalization.

### Step 2: Teaser Deck
Invoke `/gtm:teaser-deck {company}` using the Skill tool.

Feed in the research from Step 1. This produces: a concise, visually compelling HTML teaser presentation — industry pain framing, Esker value proposition, relevant proof points, and a clear CTA to schedule a discovery call.

### Step 3: Deploy Draft
Invoke `/gtm:deploy {deck-file} --draft` using the Skill tool.

Deploy the teaser deck to a draft Firebase preview URL for review and sharing.

### Step 4: Draft Outreach Message
Based on the research, draft a suggested outreach message (email or LinkedIn) to send alongside the teaser deck link. The message should:

- Reference a specific pain signal or trigger from the research
- Be concise (3-4 sentences max)
- Include the draft URL as a "thought you might find this relevant" value-add
- End with a soft CTA (e.g., "Worth a 15-minute conversation?")

## Deliverables

Return all of the following to the user:

1. **Research Summary** — Key company intelligence in a scannable format
2. **Teaser Deck Draft URL** — Shareable link to the deployed teaser presentation
3. **Suggested Outreach Message** — Ready-to-send email or LinkedIn message with the deck link embedded

## Example Output

> **Teaser Prep Complete for {company}**
>
> **Target**: {company} — $X revenue, {industry}, running {ERP}. ICP Tier {N}.
>
> **Teaser Deck**: [Draft URL] — {N} slides: industry pain, Esker fit, proof points, CTA.
>
> **Suggested Outreach**:
>
> Subject: {industry} AP automation — thought this might resonate
>
> Hi {contact name},
>
> {Personalized hook based on pain signal}. Put together a quick overview of how companies like {peer company} are tackling this — [link to teaser deck].
>
> Worth a 15-minute conversation?
>
> Best,
> {sender}
