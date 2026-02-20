---
description: Generate a discovery presentation deck with interactive ROI calculator, pain mapping, case studies, and discussion framework.
---

# /gtm:discovery-deck

Generate a discovery presentation deck for a prospect company. Deeper than the teaser — includes interactive ROI calculator, industry pain mapping, case studies, and a structured discussion framework for the discovery call.

## Usage

```
/gtm:discovery-deck Lululemon
/gtm:discovery-deck "Acme Manufacturing"
```

## How It Works

1. **CRM Pull** — Fetch HubSpot company, contact, and deal data
2. **Research** — Deep web research on company, industry trends, and peer benchmarks
3. **Airtable Check** — Pull deal-specific data from Airtable if it exists
4. **Design** — Load design system, brand guide, assets, and section templates
5. **Generate** — Build a 6-8 section HTML deck with interactive elements
6. **Save** — Write to `~/Desktop/decks/{company}-discovery-deck.html`

## Instructions

### Step 1: Load MCP Tools

```
ToolSearch: "+hubspot search"
```

### Step 2: Pull HubSpot Data

Search for the company and pull all available context:

```
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "companies"
  searchTerm: "<company-name>"
```

Then fetch associated records:
- **Contacts** — who at this company has Tyler been talking to? Get names, titles, emails
- **Deals** — active deal stage, amount, pipeline, close date
- **Company properties** — `ar_invoice_volume_annual`, `ap_invoice_volume_annual`, `dso_current`, `erp_system`, `strategic_goals_summary`

Use `mcp__claude_ai_HubSpot__get_crm_objects` or `mcp__claude_ai_HubSpot__get_properties` to pull specific records and properties as needed.

### Step 3: Deep Web Research

Conduct more thorough research than the teaser deck:

1. **Company overview** — revenue, employees, industry, recent news, strategic initiatives
2. **Financial metrics** — 10-K/10-Q filings for DPO, DSO, AP/AR turnover, revenue growth
3. **Industry pain points** — search `"{industry}" accounts payable challenges 2025 2026"` for current trends
4. **Competitive landscape** — what are their competitors doing with AP/AR automation?
5. **ERP environment** — search `"{company}" ERP SAP Oracle NetSuite` to identify their tech stack
6. **Case studies** — search `"Esker" "{industry}" case study` for relevant Esker customer stories
7. **Peer benchmarks** — 4-5 peer companies with DPO/DSO data for comparison charts

### Step 4: Check Airtable Data

If the company has an existing deal, there may be data in Airtable with pricing and assumptions. Reference the schema at `airtable/schema.json` for table and field names.

Note: Airtable access may require manual lookup or API integration. If Airtable data is not programmatically accessible, note this in the output and use HubSpot + web research data instead. Pre-populate the interactive calculator with whatever data is available.

### Step 5: Load Design Assets

Read from the plugin directory (`baseline-gtm-wizards/`):

```
Read: DESIGN_SYSTEM.md
Read: BRAND_GUIDE.md
Read: assets/logos/baseline-logo.b64
Read: assets/logos/esker-logo.svg
Read: assets/colors.css
Read: assets/fonts.css
Read: templates/stage-decks/discovery.html    — structural template
Read: templates/sections/                     — reusable section patterns
```

Read any relevant section templates for components like comparison charts, calculator layouts, and case study cards.

### Step 6: Calculate Pre-Discovery Projections

Same formulas as the teaser deck, but with more granularity:

**AP Processing Savings:**
```
Current Cost Per Invoice = industry average ($15-22) or HubSpot data
Esker Cost Per Invoice = $3-5 (estimate)
Annual AP Savings = (Current - Esker) x AP Invoice Volume
```

**AR Collection Improvement:**
```
Working Capital Freed = DSO Reduction (days) x (Annual Revenue / 365)
Annual Interest Saved = Working Capital Freed x Cost of Capital (assume 6-8%)
```

**FTE Reallocation:**
```
Hours Saved Per Invoice = Current Processing Time - Esker Processing Time
Annual Hours Saved = Hours Saved x Invoice Volume
FTEs Reallocated = Annual Hours Saved / 2,080
FTE Value = FTEs Reallocated x Avg Loaded Cost ($75K-$95K)
```

**Early Payment Discounts:**
```
Discount Capture = Invoice Volume x Average Invoice Value x 2% x Capture Rate Improvement
```

Use conservative estimates. All projections labeled as "Pre-Discovery Estimates" in the deck.

### Step 7: Generate the HTML Deck

Build a single self-contained HTML file with 6-8 full-screen scroll-snap sections.

**General rules (same as teaser):**
- All CSS/JS inline, no external deps except Google Fonts
- CSS custom properties from `:root` only
- `.reveal` classes on all content elements
- Progress bar, nav dots, floating particles, glow orbs
- Inline Base64/SVG logos
- Glass card components
- Responsive for screen sharing (1920x1080) and tablets

**Section 1 — Hero:**
- Logo row: Baseline + Esker
- Company name headline with shimmer text
- Subtitle: "Discovery Presentation" or industry-specific hook
- Date and confidentiality notice
- If contact names are known from HubSpot, add "Prepared for [Name], [Title]"

**Section 2 — Industry Landscape:**
- Section label: "YOUR INDUSTRY"
- Peer DPO/DSO comparison chart (horizontal bars, CSS-only)
- 3 industry trend cards (glass): key challenges facing their industry in AP/AR
- Source attribution on all data points

**Section 3 — Pain Point Identification:**
- Section label: "THE CHALLENGE"
- 3-4 pain point cards mapped to their specific industry and size:
  - Manual invoice processing costs
  - Cash flow visibility gaps
  - Compliance and audit exposure
  - Supplier relationship friction
- Each card: bold stat + supporting context + how it manifests in their business
- If HubSpot has `strategic_goals_summary`, weave those goals into the framing

**Section 4 — Opportunity Sizing (Interactive Calculator):**
- Section label: "THE OPPORTUNITY"
- Pre-populated with researched data but editable via sliders
- Input sliders:
  - Annual invoice volume (AP)
  - Current cost per invoice
  - Current DSO (days)
  - Target DSO reduction (days)
  - FTEs in AP/AR
  - Average FTE hourly rate
- Real-time calculated outputs (animated counters):
  - Annual AP savings
  - Working capital freed
  - FTE reallocation value
  - Total annual benefit
- All calculations run client-side in JavaScript
- Note: NO pricing information in this section — this is a pre-discovery sizing tool

**Section 5 — Esker Platform Overview:**
- Section label: "THE SOLUTION"
- 3 capability cards:
  1. Source-to-Pay (S2P): Procurement, AP automation, expense management
  2. Order-to-Cash (O2C): AR automation, collections, cash application, credit management
  3. AI & Analytics: GenAI document capture, predictive analytics, real-time dashboards
- Each card: icon, title, 2-3 bullet capabilities, one company-specific benefit

**Section 6 — Case Studies:**
- Section label: "PROVEN RESULTS"
- 2-3 case study cards from web research (Esker customer stories in similar industry/size)
- Each card: company name, industry, key metric improvement, one-line quote if available
- If no industry-specific cases found, use best-fit cases from adjacent industries

**Section 7 — Discussion Framework:**
- Section label: "DISCOVERY AGENDA"
- Structured as a visual agenda for the discovery call
- 4-5 glass cards, each with:
  - Topic area (e.g., "Current AP Workflow," "Cash Flow Priorities," "Technology Landscape")
  - 2-3 specific questions to ask
  - Why this matters (dim text below)
- This section serves as both a presentation slide and a conversation guide

**Section 8 — CTA:**
- Headline: "Let's Build Your Business Case"
- Subtext: "Next step: a deeper dive with your specific data to build a custom ROI model"
- Contact card: Tyler Massey, Baseline Payments
- Timeline hint: "From discovery to proof-of-value in 90 days"

### Step 8: Save the Deck

```bash
mkdir -p ~/Desktop/decks
```

Save to: `~/Desktop/decks/{company-slug}-discovery-deck.html`

### Step 9: Report to User

```
Discovery deck ready:
  ~/Desktop/decks/{company}-discovery-deck.html

Company: {name}
Industry: {industry}
Deal Stage: {stage or "No active deal"}
Data Sources: {HubSpot | Airtable | Web Research | Industry Estimates}

Key Metrics:
- Revenue: {value}
- AP Volume: {value} ({source})
- DSO: {value} ({source})
- ERP: {system or "Unknown"}
- Total Opportunity: ${X}M/year (pre-discovery estimate)

Sections: Hero | Industry Landscape | Pain Points | Interactive Calculator | Platform | Case Studies | Discussion Framework | CTA

Interactive Elements:
- ROI calculator with {N} slider inputs
- All calculations client-side JS

Next steps:
- Review and adjust pre-populated calculator values
- Deploy with /gtm:deploy {path}
- Validate with /gtm:check-design {path}
```

## Troubleshooting

### No deal in HubSpot
The deck works without a deal record. Focus on company-level data and industry benchmarks. The calculator section uses editable sliders so the prospect can input their own data during the call.

### Calculator values seem off
All calculator inputs are editable sliders. Pre-populated values come from research and may need adjustment. The deck is designed for Tyler to walk through and adjust collaboratively with the prospect.

### No Esker case studies found for the industry
Use adjacent industry cases (e.g., if target is food manufacturing, use general manufacturing cases). Note the industry in the case study card so it's transparent.

### ERP system unknown
Leave the ERP-specific integration messaging generic. Add a question about ERP to the Discussion Framework section so it gets covered in the call.
