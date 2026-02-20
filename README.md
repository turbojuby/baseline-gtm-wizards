# GTM Wizards

Claude Code plugin for the Baseline Payments GTM team. Provides shared design system, brand assets, templates, and slash commands for generating branded HTML sales decks, ROI calculators, and digital deal rooms.

## Team

| Name | Role |
|------|------|
| Tyler Massey | Admin |
| Matt | Member |
| Marc | Member |

## Slash Commands

| Command | Description |
|---------|-------------|
| `/teaser-deck` | Generate a 4-section teaser deck for a prospect using public financial data and peer benchmarks |
| `/discovery-deck` | Generate a detailed discovery deck from a Fathom meeting transcript and CRM context |
| `/business-case` | Generate a financial business case with ROI modeling from discovery data |
| `/roi-calculator` | Generate an interactive ROI calculator with editable inputs and live outputs |
| `/check-design` | Validate an HTML file against the design system spec |
| `/deploy` | Deploy an HTML file to hub.baselinepayments.com with a secret URL |

## Quick Start

```bash
git clone https://github.com/turbojuby/baseline-gtm-wizards.git
```

Add the plugin directory to your Claude Code or Cowork configuration. All slash commands will be available immediately.

## Design System

Full spec in [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md). Key principles:

- Baseline navy color scheme (`#01395d` background)
- Plus Jakarta Sans typography (weights 300-800)
- Full-screen scroll-snap sections with glass card UI
- Reveal-on-scroll animations (fade up, scale, slide)
- Shimmer gradient text on hero titles
- Animated number counters for stats
- Floating particles and ambient glow orbs
- Single self-contained HTML files (inline CSS/JS)

Colors, fonts, and logos are defined in `assets/` — the single source of truth.

## Brand Guide

Voice, messaging, and persona targeting in [`BRAND_GUIDE.md`](BRAND_GUIDE.md). Covers:

- Challenger Sales methodology
- Persona messaging matrix (CFO, Controller, AP Manager, IT/CIO)
- Competitor positioning (vs Coupa, SAP Ariba, status quo)
- Content rules and prohibited elements

## Assets

```
assets/
  colors.css          # CSS custom properties (:root block)
  fonts.css           # Google Fonts import + font variables
  logos/
    baseline-logo.b64 # Base64-encoded Baseline Payments logo (webp)
    esker-logo.svg    # Esker logo as standalone SVG
    manifest.json     # Asset registry with sizing specs
```

## Templates

HTML section templates live in `templates/`. Each template is a standalone section that can be composed into full decks:

- `hero.html` — Cover slide with logos, shimmer title, subtitle, meta
- `hook.html` — Data hook with comparison bars, stat grid, closing provocation
- `value.html` — Value proposition with 3-card grid and credibility bar
- `cta.html` — Call to action with dot-list, contact block, footer logos

## Airtable Setup

Pricing and deal data live in Airtable (never in decks). See `airtable/README.md` for schema and integration details.

## Deployment

Generated decks deploy to `hub.baselinepayments.com` via Netlify:

```
https://hub.baselinepayments.com/d/{16-char-hex-string}
```

The `/deploy` slash command handles the full deployment flow — generates a secret path, copies the HTML, and deploys to the branded subdomain. URLs are unguessable (2^64 combinations) and not indexed.

## Repository Structure

```
baseline-gtm-wizards/
  .claude-plugin/
    plugin.json         # Plugin manifest
  assets/               # Colors, fonts, logos
  skills/               # Slash command definitions (SKILL.md per command)
  templates/            # HTML section templates
  airtable/             # Airtable schema and integration docs
  DESIGN_SYSTEM.md      # Full design system spec
  BRAND_GUIDE.md        # Voice, messaging, persona targeting
  marketplace.json      # Team distribution config
  README.md             # This file
```
