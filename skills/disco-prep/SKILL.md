---
description: Full discovery call preparation — one command to research, build call brief, generate deck, and deploy
---

# /gtm:disco-prep

**The flagship meta-skill.** One command to fully prepare for any discovery call.

## Usage

```
/gtm:disco-prep {company}
```

## What This Does

This is the "press one button, get everything you need for a discovery call" workflow. It chains four skills together, feeding each output into the next, and delivers a complete preparation package with a shareable deck URL.

## Steps

### Step 1: Account Research
Invoke `/gtm:account-research {company}` using the Skill tool.

This produces: full company intelligence — firmographics, financial signals, ICP score, key contacts, pain indicators, competitive landscape, and recent news.

### Step 2: Call Prep Brief
Invoke `/gtm:call-prep {company}` using the Skill tool.

Feed in the account research from Step 1. This produces: structured call agenda, discovery questions tailored to the company's pain signals, likely objections with responses, and a qualification checklist (BANT/3Ps).

**Note:** Both `/gtm:account-research` (Step 1) and `/gtm:call-prep` (this step) now write to HubSpot automatically. By the time Step 3 runs, the company record will have been enriched with research data, and a pre-call research brief note will be logged to HubSpot. This means the research and prep work are available to the entire team — not just whoever ran this command.

### Step 3: Discovery Deck
Invoke `/gtm:discovery-deck {company}` using the Skill tool.

Feed in the research and call prep from Steps 1-2. This produces: an interactive HTML discovery presentation customized to the target company — industry context, pain hypotheses, Esker solution mapping, and ROI indicators.

### Step 4: Deploy Draft
Invoke `/gtm:deploy {deck-file} --draft` using the Skill tool.

Deploy the generated deck HTML to a draft Firebase preview URL for review and sharing.

## Deliverables

Return all of the following to the user:

1. **Research Summary** — Key company intelligence in a scannable format
2. **Call Prep Brief** — Agenda, discovery questions, objection handling, qualification checklist
3. **Draft Deck URL** — Shareable link to the interactive discovery presentation
4. **Key Talking Points** — Top 3-5 conversation starters based on the research (pain signals, recent news, industry trends)

## Example Output

> **Discovery Prep Complete for {company}**
>
> **Research**: {company} is a $X revenue {industry} company running {ERP}. ICP Tier {N}. Key pain: {pain signals}.
>
> **Call Brief**: 30-min agenda ready. {N} tailored discovery questions. {N} objection responses prepped.
>
> **Deck**: [Draft URL] — {N} slides covering industry context, pain hypotheses, and Esker fit.
>
> **Top Talking Points**:
> 1. {talking point based on research}
> 2. {talking point based on research}
> 3. {talking point based on research}
