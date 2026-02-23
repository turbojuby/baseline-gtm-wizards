# GTM Wizards

Claude Code plugin for the Baseline Payments GTM team. Provides branded design system, sales intelligence, outreach automation, pipeline management, and marketing content generation — all as `/gtm:*` slash commands.

## Install

### Option A: GitHub install (once DNS bug is resolved)

```
claude plugin add turbojuby/baseline-gtm-wizards
```

### Option B: Local install (recommended — works around Anthropic DNS bug [#26951])

```bash
git clone https://github.com/turbojuby/baseline-gtm-wizards.git ~/Desktop/tyler_projects/baseline-gtm-wizards
claude plugin add ~/Desktop/tyler_projects/baseline-gtm-wizards
```

After install, all `/gtm:*` commands are available immediately.

## Slash Commands

### Sales Decks & Deliverables

| Command | Description |
|---------|-------------|
| `/gtm:teaser-deck <company>` | Pre-discovery teaser deck with industry benchmarks and peer DPO comparison |
| `/gtm:discovery-deck <company>` | Discovery presentation with interactive ROI calculator |
| `/gtm:business-case <company>` | Full ROI proposal deck with locked Airtable pricing |
| `/gtm:roi-calculator <company>` | Standalone interactive ROI calculator (no pricing) |
| `/gtm:competitive-intel <competitor>` | Competitive battlecard with positioning and talk tracks |
| `/gtm:design <description>` | Freeform branded HTML output — decks, dashboards, one-pagers, anything |
| `/gtm:check-design <file>` | Validate HTML against the design system (10-point checklist) |
| `/gtm:deploy <file>` | Deploy to hub.baselinepayments.com or draft URL |

### Sales Intelligence & Prep

| Command | Description |
|---------|-------------|
| `/gtm:account-research <company>` | Deep account research combining HubSpot, web, and Esker collateral |
| `/gtm:call-prep` | Pre-call brief from calendar, Fathom, HubSpot, and Esker methodology |
| `/gtm:disco-prep <company>` | Full discovery prep — research, deck, deploy, and outreach in one command |
| `/gtm:teaser-prep <company>` | Quick pre-discovery — research, teaser deck, deploy, and draft message |
| `/gtm:call-summary` | Post-call summary from Fathom with HubSpot updates and follow-up email |

### Pipeline & Forecasting

| Command | Description |
|---------|-------------|
| `/gtm:pipeline-review` | Pipeline health check with deal scoring and action recommendations |
| `/gtm:deal-review <company>` | Single deal health review with scorecard and next steps |
| `/gtm:forecast [period]` | Weighted pipeline forecast with commit/upside/best-case scenarios |
| `/gtm:daily-briefing` | Morning pipeline snapshot with prioritized action plan |
| `/gtm:morning-brief` | Daily sales briefing — calendar, pipeline, emails, calls |

### Outreach & Sequences

| Command | Description |
|---------|-------------|
| `/gtm:draft-outreach <company>` | Personalized outreach emails and LinkedIn messages |
| `/gtm:outbound-prep <company>` | Full outbound preparation — research, emails, and LinkedIn messages |
| `/gtm:email-sequence <brief>` | Multi-touch email sequences for HubSpot (cold, nurture, PoV, re-engage) |

### Marketing Content

| Command | Description |
|---------|-------------|
| `/gtm:campaign-planning <brief>` | Full campaign plan with audience, channels, calendar, and HubSpot setup |
| `/gtm:content-creation <brief>` | Long-form content — blog posts, white papers, case studies |
| `/gtm:draft-content <brief>` | Quick-turn copy — LinkedIn posts, blog posts, newsletters |

## Repository Structure

```
baseline-gtm-wizards/
  .claude-plugin/
    plugin.json             # Plugin manifest (v2.0.0)
    marketplace.json        # Marketplace catalog
  skills/                   # 24 slash command definitions (SKILL.md each)
  templates/                # HTML section + stage deck templates
  assets/                   # Colors, fonts, logos (Base64/SVG)
  airtable/                 # Airtable schema and setup guide
  mcp-servers/              # MCP server configs (Airtable)
  DESIGN_SYSTEM.md          # Full design system spec
  BRAND_GUIDE.md            # Voice, messaging, persona targeting
  BASELINE_PLAYBOOK.md      # Esker sales playbook
  CLAUDE.md                 # Project instructions
```

## Design System

Full spec in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md). Dark mode, glass card UI, scroll-snap sections, reveal animations, shimmer text, animated counters. All outputs are single self-contained HTML files.

## Brand Guide

Voice, messaging, and persona targeting in [`BRAND_GUIDE.md`](BRAND_GUIDE.md). Challenger Sales framing, data-led copy, CFO/VP Finance default persona.

## Airtable

Pricing and deal data live in Airtable (never in decks). See [`airtable/README.md`](airtable/README.md) for schema and setup.

## Team

| Name | Role |
|------|------|
| Tyler Massey | Admin |
| Matt | Member |
| Marc | Member |
| JS | Member |
