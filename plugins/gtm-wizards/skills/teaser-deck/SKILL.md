---
description: Generate a pre-discovery teaser deck for a prospect company. Short, punchy, data-driven, Challenger Sales framing.
---

# /gtm:teaser-deck

Generate a pre-discovery teaser deck for a prospect company. Designed to provoke interest before the first meeting — short, punchy, data-driven, Challenger Sales framing.

## Usage

```
/gtm:teaser-deck Lululemon
/gtm:teaser-deck "Acme Manufacturing"
```

## How It Works

1. **Lookup** — Search HubSpot for the company to pull any existing CRM data
2. **Research** — Web search for company financials, industry benchmarks, and peer DPO/DSO comparisons
3. **Design** — Load design system, brand guide, and logo assets
4. **Generate** — Build a 4-section HTML deck: Hero, Hook, Value, CTA
5. **Save** — Write to `~/Desktop/decks/{company}-teaser-deck.html`

## Instructions

### Step 1: Load MCP Tools

Load HubSpot tools for company lookup:

```
ToolSearch: "+hubspot search"
```

### Step 2: Search HubSpot

Search for the company in HubSpot CRM:

```
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "companies"
  searchTerm: "<company-name>"
```

Extract any available data:
- Company name, domain, industry
- `ar_invoice_volume_annual`, `ap_invoice_volume_annual`
- `dso_current`, `erp_system`
- Associated deals (stage, amount)

If the company is not in HubSpot, proceed with web research only. The deck is still valuable as a cold outreach tool.

### Step 3: Research the Company

Use `WebSearch` to gather:

1. **Company profile** — revenue, employee count, industry, headquarters, public/private status
2. **Financial metrics** — search for `"{company name}" 10-K DSO DPO days payable outstanding` or `"{company name}" annual report accounts payable`
3. **Industry peers** — search for `"{industry}" average DPO DSO benchmark` to find 3-4 peer companies for comparison
4. **Pain signals** — search for `"{company name}" accounts payable automation` or `"{company name}" ERP digital transformation` to find any public mentions of AP/AR challenges

Key metrics to find or estimate:
- **DPO** (Days Payable Outstanding) — how long they take to pay suppliers
- **DSO** (Days Sales Outstanding) — how long it takes to collect from customers
- **Annual revenue** — for working capital calculations
- **Invoice volume** — estimate from employee count and industry (rough: 1 AP invoice per employee per week for manufacturing, less for services)

If exact figures are unavailable, use industry averages and label them as "Industry Benchmark" in the deck.

### Step 4: Research Peer Benchmarks

Find 3-4 peer companies in the same industry and size range. For each peer, try to find their DPO and DSO from public filings. This powers the comparison bar chart in the Hook section.

Structure the data as:
```
Company A: DPO 45, DSO 38
Company B: DPO 52, DSO 41
Company C: DPO 39, DSO 44
[Target Company]: DPO ??, DSO ??
Industry Average: DPO 45, DSO 40
```

### Step 5: Load Design Assets

Read the following files from the plugin directory (`baseline-gtm-wizards/`):

```
Read: DESIGN_SYSTEM.md        — full color system, typography, components, animation patterns
Read: BRAND_GUIDE.md          — voice, tone, persona targeting for CFO/VP Finance audience
Read: assets/logos/baseline-logo.b64  — Base64-encoded Baseline Payments logo
Read: assets/logos/esker-logo.svg     — Esker SVG logo markup
Read: assets/colors.css               — CSS custom properties
Read: assets/fonts.css                — Google Fonts import
```

Also read the teaser template for structural guidance:

```
Read: templates/stage-decks/teaser.html
```

The template provides the section skeleton. The generated deck must follow its structure but fill in all company-specific data.

### Step 6: Calculate Projections

Using the researched data, calculate headline metrics for the deck:

**Working Capital Opportunity:**
```
Working Capital Freed = DSO Reduction (days) x (Annual Revenue / 365)
```
Assume a conservative 5-10 day DSO reduction. Present as "The $XM Question."

**AP Processing Savings:**
```
Current Cost Per Invoice = ~$15-22 (industry average for manual processing)
Esker Cost Per Invoice = ~$3-5
Annual Savings = (Current - Esker) x Annual Invoice Volume
```

**FTE Reallocation:**
```
Hours Saved = Annual Invoice Volume x (Current Minutes - Esker Minutes) / 60
FTEs Freed = Hours Saved / 2,080
```

Use conservative estimates. Label projections as "Estimated" or "Projected" — never present estimates as exact figures.

### Step 7: Generate the HTML Deck

Build a single self-contained HTML file with 4 full-screen scroll-snap sections.

**General rules:**
- All CSS and JS inline — no external dependencies except Google Fonts
- Use CSS custom properties from `:root` — never hardcode colors
- Every content element gets a `.reveal` class (or `.reveal-left`, `.reveal-right`, `.reveal-scale`)
- Include: progress bar, nav dots, floating particles, ambient glow orbs
- Embed logos as inline Base64/SVG — no external image URLs
- Font: Inter (or Plus Jakarta Sans per design system) via Google Fonts, weight 800 for headlines
- Stat counters use `data-target` attribute for animated counting
- Glass card pattern: `background: var(--surface); backdrop-filter: blur(20px); border: 1px solid var(--border);`
- Responsive: works on 1920x1080 for screen sharing AND tablets for in-person

**Section 1 — Hero:**
- Logo row: Baseline logo + divider + Esker logo
- Company name in large shimmer-text headline
- Subtitle: "The Working Capital Opportunity" (or relevant hook based on research)
- Meta line: "Confidential | Prepared for [Company] | [Month Year]"

**Section 2 — The Hook:**
- Section label: "THE OPPORTUNITY" (uppercase, accent color)
- Peer DPO/DSO comparison bar chart (CSS-only, no charting library)
  - Horizontal bars for each peer company + target company + industry average
  - Target company bar highlighted in accent color
  - If target data unknown, show as "?" with dimmed bar
- Provocative stat grid (2-3 glass cards):
  - "The $[X]M Question" — working capital opportunity
  - "[X]% of invoices" — still processed manually (industry stat)
  - "[X] days" — average payment delay costing $[Y] per day

**Section 3 — The Value:**
- Three glass cards in a row:
  1. **GenAI Invoice Processing** — "AI-powered capture and coding, 80%+ touchless rate"
  2. **Intelligent Workflow Automation** — "Dynamic routing, auto-matching, exception handling"
  3. **Strategic Cash Management** — "Real-time visibility, early payment optimization"
- Each card gets a subtle icon (CSS-only or unicode), bold title, and one line of benefit text specific to the prospect's industry

**Section 4 — CTA:**
- Headline: "15 Minutes to Quantify the Opportunity"
- Subtext: "A brief conversation to validate these projections with your actual data"
- Contact card (glass): Tyler Massey, Baseline Payments, tyler@baselinepayments.com
- Esker partnership badge at bottom

**Persona awareness:** Default tone targets CFO / VP Finance. Use financial language — "working capital," "DPO optimization," "cost per invoice," "touchless processing rate." Avoid generic tech marketing language.

### Step 8: Save the Deck

```bash
mkdir -p ~/Desktop/decks
```

Save to: `~/Desktop/decks/{company-slug}-teaser-deck.html`

Slug rules: lowercase, hyphens, no special characters. Example: `lululemon-teaser-deck.html`, `acme-manufacturing-teaser-deck.html`.

### Step 9: Report to User

```
Teaser deck ready:
  ~/Desktop/decks/{company}-teaser-deck.html

Company: {name}
Industry: {industry}
Data Sources: {HubSpot | Web Research | Industry Estimates}

Key Metrics Used:
- DPO: {value} ({source})
- DSO: {value} ({source})
- Revenue: {value} ({source})
- Working Capital Opportunity: ${X}M

Sections: Hero | Hook (peer benchmarks) | Value Props | CTA

Next steps:
- Review the deck and adjust any estimates
- Deploy with /gtm:deploy {path}
- Validate design with /gtm:check-design {path}
```

## Troubleshooting

### HubSpot company not found
The deck works without HubSpot data. Web research provides the primary data. Note in the output that no CRM data was used.

### No public financial data available
Use industry averages for DPO/DSO. Label all figures as "Industry Benchmark" in the deck. Focus the Hook section on industry-wide pain points rather than company-specific metrics.

### Company is private (no 10-K filings)
Search for press releases, news articles mentioning revenue ranges, or Crunchbase/PitchBook data. Estimate invoice volume from employee count and industry norms.
