---
description: Prepare personalized outbound for a target company — research, draft emails, and LinkedIn messages
---

# /gtm:outbound-prep

One command to prepare a complete personalized outbound package for a target company.

## Usage

```
/gtm:outbound-prep {company}
```

## What This Does

Chains account research into personalized outreach drafts. Produces ready-to-send emails and LinkedIn messages tailored to the target company's specific pain signals, industry, and contacts.

## Steps

### Step 1: Account Research
Invoke `/gtm:account-research {company}` using the Skill tool.

This produces: full company intelligence — firmographics, financial signals, ICP score, key contacts, pain indicators, competitive landscape, and recent news. The research output feeds directly into the outreach personalization in Step 2.

### Step 2: Draft Outreach
Invoke `/gtm:draft-outreach {company}` using the Skill tool.

Feed in the account research from Step 1. This produces: personalized email drafts, LinkedIn connection requests, and a follow-up sequence — all customized to the company's pain signals, industry context, and identified contacts.

## Deliverables

Return all of the following to the user:

1. **Research Summary** — Key company intelligence: industry, revenue, ERP, ICP tier, pain signals, key contacts
2. **Email Drafts** — Personalized cold emails (initial outreach + 2-3 follow-ups) targeting identified contacts
3. **LinkedIn Connection Request** — Short, personalized connection message for each key contact
4. **Follow-Up Sequence** — Timing and messaging for a multi-touch outbound cadence

## Example Output

> **Outbound Prep Complete for {company}**
>
> **Target**: {company} — $X revenue, {industry}, running {ERP}. ICP Tier {N}.
>
> **Key Contacts**:
> - {Name}, {Title} — {why they matter}
> - {Name}, {Title} — {why they matter}
>
> **Email Sequence**: {N} personalized emails ready. Hook: {pain signal}.
>
> **LinkedIn**: Connection requests drafted for {N} contacts.
>
> **Cadence**: Day 1 email > Day 3 LinkedIn > Day 5 follow-up > Day 10 value-add > Day 15 break-up.
