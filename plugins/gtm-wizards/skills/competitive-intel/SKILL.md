---
description: Generate a competitive intelligence battlecard as an interactive HTML page with positioning, talk tracks, and win/loss data for a specific deal or competitor.
---

# /gtm:competitive-intel

Produce a competitive analysis for a deal or a named competitor. Combines HubSpot win/loss data, Notion competitive pages, Google Drive battle cards, and live web research into an interactive HTML battlecard.

## Usage

```
/gtm:competitive-intel Coupa
/gtm:competitive-intel "Acme Corp deal"
/gtm:competitive-intel SAP Ariba
```

## Instructions

### Step 1: Identify the Competitor(s)

If a company/deal name is given:
1. Search HubSpot for the deal — check for competitor fields, notes mentioning competitors, or loss reason data
2. Search Fathom transcripts for competitor mentions from prior calls

If a competitor name is given directly, proceed to research.

**Primary competitors to know:**
- **Coupa** — broad BSM platform, long implementations
- **SAP Ariba** — SAP ecosystem lock-in
- **Status Quo (manual processes)** — the most common "competitor"
- **Other**: Tipalti, BILL/Divvy, AvidXchange, Basware, Medius

### Step 2: Pull Internal Intel

1. **HubSpot** — search deals with win/loss data against this competitor. Look for:
   - Closed-Won deals where this competitor was displaced
   - Closed-Lost deals where we lost to this competitor
   - Deal notes mentioning competitor strengths/weaknesses
2. **Notion** — search for competitive intelligence pages, battle cards, win/loss analysis
3. **Google Drive** — search Esker folder for competitive battle cards, positioning docs

### Step 3: Web Research

1. **Competitor product updates** — recent launches, acquisitions, pricing changes
2. **Analyst coverage** — Gartner, Forrester, Ardent Partners mentions
3. **Customer reviews** — G2, TrustRadius for sentiment and common complaints
4. **Competitor case studies** — what industries/sizes are they winning?

### Step 4: Build the Battlecard

Reference `references/battlecard-data.md` for pre-loaded positioning data, and BRAND_GUIDE.md for Esker's competitive positioning section.

**Core positioning by competitor:**

**vs. Coupa:**
- Esker advantage: depth vs. breadth, 90-day PoV vs. 12-month implementation, purpose-built AI for AP/AR
- Coupa strength: unified platform, procurement + treasury
- When they win: prospect needs broad BSM, already committed to Coupa ecosystem
- When we win: AP/AR is the priority, speed to value matters, multi-ERP environment

**vs. SAP Ariba:**
- Esker advantage: ERP-agnostic vs. SAP lock-in, modern UX, independent deployment
- Ariba strength: deep SAP integration, upstream procurement
- When they win: all-SAP shop with SAP executive sponsorship
- When we win: multi-ERP, non-SAP primary, want independence from vendor lock-in

**vs. Status Quo:**
- This is the real competitor in most deals
- Quantify cost of doing nothing: cost per invoice, FTEs on manual work, DPO gap vs. peers, compliance risk
- Key reframe: "The question isn't whether to automate. It's how much another quarter of manual processing costs you."

### Step 5: Generate Interactive HTML Battlecard

Build a single-file HTML battlecard following the design system from DESIGN_SYSTEM.md:

**Sections:**
1. **Hero** — Competitor name, "Competitive Intelligence" subtitle, date
2. **Head-to-Head Comparison** — Side-by-side feature/capability grid (Esker vs. Competitor)
3. **Win/Loss Data** — Stats from HubSpot if available (win rate, avg deal size, common loss reasons)
4. **Talk Tracks** — Challenger-style objection handling for each competitor claim
5. **Landmines** — Questions to plant that expose competitor weaknesses
6. **Proof Points** — Esker case studies, Gartner MQ position, customer quotes
7. **Red Flags** — Signals that indicate the prospect is leaning toward the competitor

Save to: `~/Desktop/decks/{competitor-slug}-battlecard.html`

**Important:** Battlecards are INTERNAL ONLY. Never deploy to production. Use `/gtm:deploy --draft` if sharing with the team.

### Step 6: Output Summary

```
Competitive Battlecard: Esker vs. {Competitor}

Saved: ~/Desktop/decks/{slug}-battlecard.html

Win/Loss Data (HubSpot):
- Deals against {competitor}: {count}
- Win rate: {%}
- Common win reasons: {list}
- Common loss reasons: {list}

Key Differentiators:
{Top 3 Esker advantages}

Top Landmine Questions:
{3 questions to plant in conversations}

Deploy for team review: /gtm:deploy {path} --draft
```

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
