# GTM Wizards

Claude Code plugin marketplace for the Baseline Payments GTM team. Provides shared design system, brand assets, templates, and slash commands for generating branded HTML sales decks, ROI calculators, and digital deal rooms.

## Install

**Step 1:** Add the marketplace

```
/plugin marketplace add turbojuby/baseline-gtm-wizards
```

**Step 2:** Install the plugin

```
/plugin install gtm-wizards@baseline-gtm-wizards
```

Skills are available immediately after install.

## Slash Commands

| Command | Description |
|---------|-------------|
| `/gtm:teaser-deck <company>` | Pre-discovery teaser deck with industry benchmarks and peer DPO comparison |
| `/gtm:discovery-deck <company>` | Discovery presentation with interactive ROI calculator |
| `/gtm:business-case <company>` | Full ROI proposal deck with locked Airtable pricing |
| `/gtm:roi-calc <company>` | Standalone interactive ROI calculator (no pricing) |
| `/gtm:check-design <file>` | Validate HTML against the design system spec |
| `/gtm:deploy <file>` | Deploy to hub.baselinepayments.com with an unguessable URL |

## Design System

Full spec in [`plugins/gtm-wizards/DESIGN_SYSTEM.md`](plugins/gtm-wizards/DESIGN_SYSTEM.md). Key principles:

- Baseline navy color scheme (`#01395d` background)
- Plus Jakarta Sans typography (weights 300-800)
- Full-screen scroll-snap sections with glass card UI
- Reveal-on-scroll animations (fade up, scale, slide)
- Shimmer gradient text on hero titles
- Animated number counters for stats
- Single self-contained HTML files (inline CSS/JS)

## Brand Guide

Voice, messaging, and persona targeting in [`plugins/gtm-wizards/BRAND_GUIDE.md`](plugins/gtm-wizards/BRAND_GUIDE.md).

## Airtable Setup

Pricing and deal data live in Airtable (never in decks). See [`plugins/gtm-wizards/airtable/README.md`](plugins/gtm-wizards/airtable/README.md) for schema and setup.

## Repository Structure

```
baseline-gtm-wizards/
  .claude-plugin/
    marketplace.json              # Marketplace catalog
  plugins/
    gtm-wizards/
      .claude-plugin/
        plugin.json               # Plugin manifest
      skills/                     # Slash command definitions (SKILL.md per command)
        teaser-deck/
        discovery-deck/
        business-case/
        roi-calculator/
        check-design/
        deploy/
      assets/                     # Colors, fonts, logos
      templates/                  # HTML section + stage deck templates
      airtable/                   # Airtable schema and setup guide
      DESIGN_SYSTEM.md            # Full design system spec
      BRAND_GUIDE.md              # Voice, messaging, persona targeting
  README.md
```

## Team

| Name | Role |
|------|------|
| Tyler Massey | Admin |
| Matt | Member |
| Marc | Member |
