---
description: Generate any branded HTML output — deck, one-pager, dashboard, report, meeting agenda, landing page — using the Baseline design system. Freeform prompt, flexible structure, adapts tone to context.
---

# /gtm:design

Generate any branded HTML output from a freeform description. Adapts structure, section count, tone, and data sourcing to match the request — from prospect-facing Challenger Sales decks to internal team updates.

## Usage

```
/gtm:design Create a light meeting deck for my 1:1 with Sarah
/gtm:design Build an internal team update page for Q1 pipeline progress
/gtm:design Make a one-pager summarizing our new pricing tiers
/gtm:design 3-section partner overview for Esker field sales
```

## How It Works

1. **Parse** — Understand content type, section count, tone, and whether data is needed
2. **Gather** — Pull CRM/deal data only if the request references a company or metrics
3. **Load** — Read design system, brand guide, and logo assets
4. **Generate** — Build a self-contained HTML file following the design system exactly
5. **Validate** — Run the 10-point checklist inline and fix any failures
6. **Save** — Write to `~/Desktop/decks/{descriptive-slug}.html`

## Instructions

### Step 1: Load Design Assets

Read the following files from the plugin directory (`baseline-gtm-wizards/`):

```
Read: DESIGN_SYSTEM.md        — full color system, typography, components, animation patterns
Read: BRAND_GUIDE.md          — voice, tone, persona targeting
Read: assets/logos/baseline-logo.b64  — Base64-encoded Baseline Payments logo
Read: assets/logos/esker-logo.svg     — Esker SVG logo markup
Read: assets/colors.css               — CSS custom properties
Read: assets/fonts.css                — Google Fonts import
```

### Step 2: Parse the Request

Determine the following from the user's prompt:

**Content type:**
- `deck` — multi-section scroll-snap (prospect-facing or internal)
- `one-pager` — single-page, dense layout, no scroll-snap
- `dashboard` — data-heavy, stat grids, charts
- `report` — longer-form, scrollable, mixed content
- `agenda` — meeting structure, time blocks, owners
- `landing` — single call-to-action, hero + content

**Section count:**
- Explicit: user says "3-section" → use that number
- Implicit by type: deck → 4-6 sections; one-pager → 1; agenda → 1; report → flexible
- Default for unspecified decks: 4 sections

**Tone:**
- `prospect-facing` — Challenger Sales voice, financial language, CFO/VP Finance persona, high polish
- `internal` — relaxed but still branded, plain language, collaborative framing
- Signals for prospect: mentions a company name, "discovery," "teaser," "partner," "client"
- Signals for internal: "team," "1:1," "update," "Q1," "all-hands," "pipeline review," "Sarah"

**Data needed:**
- Yes: request references a specific company, deal, or live metrics
- No: purely creative, internal, or user provides all content inline

### Step 3: Gather Data (Only If Needed)

Skip this step entirely if the request is internal or purely creative.

If a company or deal is referenced:

**HubSpot lookup:**
```
ToolSearch: "+hubspot search"
Tool: mcp__claude_ai_HubSpot__search_crm_objects
  objectType: "companies"
  searchTerm: "<company-name>"
```

**Airtable deal data:**
```
Tool: mcp__airtable-gtm__get_deal
```

**External research (if needed):**
```
WebSearch: "{company} revenue industry financials"
```

Extract relevant fields: company name, industry, deal stage, revenue, ERP, invoice volume, DPO/DSO, contacts.

### Step 4: Design the Structure

Before coding, outline the sections and their purpose. For clear, unambiguous requests proceed directly. For requests where structure is genuinely unclear (e.g., "make something about pricing"), briefly state the intended structure and proceed — don't ask unless the content itself is missing.

**Standard section patterns by type:**

Prospect deck (4 sections):
1. Hero — logos, company name, hook headline, date
2. Insight/Hook — industry data, peer benchmarks, provocative stat
3. Value — 3-column glass cards with capabilities/benefits
4. CTA — next step, contact, partnership badge

Internal update (3 sections):
1. Header — title, date, presenter, agenda preview
2. Content — metrics, highlights, narrative
3. Next Steps — actions, owners, dates

One-pager:
- Single scrollable page: headline, 2-3 content blocks, footer CTA

Agenda:
- Single page: meeting title, time blocks with owners, parking lot

### Step 5: Generate the HTML

Build a single self-contained HTML file. Apply these rules without exception:

**Structure:**
- Multi-section (deck): `html { scroll-snap-type: y mandatory; }`, each `section { min-height: 100vh; scroll-snap-align: start; }`
- Single-page (one-pager, agenda): standard scrollable layout, no scroll-snap
- Every section has a `.section-inner` wrapper with `max-width: 1200px; margin: 0 auto;`

**Colors — use CSS custom properties only:**
```css
:root {
  --bg: #0a0e1a;           /* or current design system value */
  --surface: rgba(255,255,255,0.05);
  --border: rgba(255,255,255,0.1);
  --text: #e8eaf6;
  --text-dim: rgba(232,234,246,0.6);
  --accent: /* from colors.css */;
}
```
Never hardcode hex values outside `:root` (except `#fff`, `#000`, and `rgba()` alphas).

**Typography:**
- Font: Plus Jakarta Sans via Google Fonts, weights 400/600/800
- Headlines: `font-weight: 800; font-size: clamp(2rem, 5vw, 4rem);`
- Body: `font-size: clamp(1rem, 1.5vw, 1.125rem);`
- Shimmer headline on hero: `background: linear-gradient(...); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200%; animation: shimmer 3s ease infinite;`

**Reveal animations — every content element gets one:**
```css
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-left { opacity: 0; transform: translateX(-30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-left.visible { opacity: 1; transform: none; }
.reveal-right { opacity: 0; transform: translateX(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-right.visible { opacity: 1; transform: none; }
.reveal-scale { opacity: 0; transform: scale(0.9); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal-scale.visible { opacity: 1; transform: none; }
```
IntersectionObserver in JS adds `.visible` class when elements enter viewport.

**Required components (multi-section decks):**
- Progress bar: `position: fixed; top: 0; width: 0%; height: 3px; background: var(--accent); z-index: 1000;` — updated on scroll
- Nav dots: `position: fixed; right: 1.5rem; top: 50%; transform: translateY(-50%);` — one dot per section, click to scroll
- Floating particles: 15-20 `<div class="particle">` elements, random position/animation via JS
- Ambient glow orbs: 2-3 `<div class="glow-orb">` with `filter: blur(80px); animation: pulse`

**Glass cards:**
```css
.glass {
  background: var(--surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.glass:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
```

**Stat counters (when stats are present):**
```html
<span class="counter" data-target="1500000">0</span>
```
JS reads `data-target`, animates from 0 to value with easing, formats with commas/prefix/suffix.

**Logos:**
- Baseline: embed the full Base64 string from `baseline-logo.b64` as `<img src="data:image/png;base64,..."/>`
- Esker: paste the full SVG markup inline

**Responsive breakpoints:**
```css
@media (max-width: 768px) { /* tablet adjustments */ }
@media (max-width: 480px) { /* mobile adjustments */ }
```

**Tone adjustments:**
- Prospect-facing: Challenger Sales framing ("The $XM Question"), financial terminology, urgency language, no team names
- Internal: plain headline, bullets over stats, names/owners visible, lighter copy

### Step 6: Validate Against the 10-Point Checklist

Before saving, mentally scan the generated HTML for each check. Fix failures inline — do not save a failing file.

| # | Check | Pass Condition |
|---|-------|---------------|
| 1 | CSS Custom Properties | No hardcoded colors outside `:root` |
| 2 | Reveal Animations | Every content element has `.reveal*` class + JS observer |
| 3 | Self-Contained | No external deps except Google Fonts |
| 4 | Required Components | Progress bar, nav dots, particles, glow orbs (deck only) |
| 5 | Responsive Breakpoints | `@media` at 768px and 480px with layout changes |
| 6 | Logos Embedded | Both logos as Base64/inline SVG, no external URLs |
| 7 | Stat Counters | `data-target` + JS animation (if stats present) |
| 8 | Glass Card Pattern | `backdrop-filter` + `-webkit-backdrop-filter` + hover lift |
| 9 | Section Structure | `scroll-snap-type` on html, `scroll-snap-align` on sections (deck only) |
| 10 | Font | Plus Jakarta Sans loaded, weight 800 on headlines |

Single-page layouts (one-pager, agenda) may skip checks 4 and 9 — mark as `[SKIP]`.

### Step 7: Save the File

```bash
mkdir -p ~/Desktop/decks
```

Save to: `~/Desktop/decks/{descriptive-slug}.html`

Slug rules: lowercase, hyphens, describe the content. Examples:
- `q1-pipeline-update.html`
- `pricing-tiers-one-pager.html`
- `sarah-1on1-deck.html`
- `esker-partner-overview.html`

### Step 8: Report to User

```
Design complete:
  ~/Desktop/decks/{slug}.html

Type: {deck | one-pager | dashboard | agenda | report}
Sections: {N} ({Section 1} | {Section 2} | ...)
Tone: {prospect-facing | internal}
Data: {HubSpot | Airtable | None — content from prompt}

Design checks: 10/10 passed

Next steps:
  Deploy:   /gtm:deploy ~/Desktop/decks/{slug}.html
  Validate: /gtm:check-design ~/Desktop/decks/{slug}.html
```

## Comparison with Specialized Skills

| Aspect | `/gtm:teaser-deck`, `/gtm:discovery-deck`, etc. | `/gtm:design` |
|--------|--------------------------------------------------|----------------|
| Structure | Fixed sections and types | Flexible — follows the prompt |
| Data | Always HubSpot + web research | Only if the request needs it |
| Tone | Always Challenger Sales, prospect-facing | Adapts to context |
| Output name | `{company}-{type}-deck.html` | `{descriptive-slug}.html` |
| Content | Prescribed (Hero, Hook, Value, CTA…) | Freeform from user |

Use specialized skills when building a known deliverable for a prospect. Use `/gtm:design` for everything else.

## Troubleshooting

### Request is too vague ("make something nice")
Pick a reasonable default structure (4-section internal deck) and proceed. State the structure in the output so the user knows what was built.

### User provides all content inline
Skip Steps 2 and 3 entirely. Use the provided content verbatim, formatted with the design system.

### Single-page output doesn't need scroll-snap
Omit the scroll-snap properties, progress bar, and nav dots. Mark checks 4 and 9 as `[SKIP]` in the validation report.

### Logos unavailable or B64 file missing
Render logos as SVG text placeholders with the correct brand colors. Flag the missing asset in the output.

### Request references a company not in HubSpot
Proceed with the content the user provided. Note in the output that no CRM data was found.
