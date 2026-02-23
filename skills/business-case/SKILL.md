---
description: Generate a full ROI business case deck with locked Airtable pricing, 3-year projection, and implementation timeline.
---

# /gtm:business-case

Generate a full ROI business case deck with locked pricing from Airtable. This is the post-discovery proposal — comprehensive financial model, 3-year projection, implementation timeline, and investment summary.

## Usage

```
/gtm:business-case Lululemon
/gtm:business-case "Acme Manufacturing"
```

## How It Works

1. **CRM Pull** — Fetch HubSpot company, deal, and contact data
2. **Airtable Pull** — Fetch pricing, assumptions, and deal-specific data from Airtable
3. **Research** — Supplement with web research for any missing data points
4. **Design** — Load design system, brand guide, and assets
5. **Generate** — Build a 10-section HTML deck with interactive business case calculator
6. **Save** — Write to `~/Desktop/decks/{company}-business-case.html`

## Instructions

### Step 1: Load MCP Tools

```
ToolSearch: "+hubspot search"
```

### Step 2: Pull HubSpot Data

Search for the company and all associated records:

```
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "companies"
  searchTerm: "<company-name>"
```

Fetch:
- **Company** — all financial properties, ERP, strategic goals
- **Deal** — stage, amount, close date, pipeline
- **Contacts** — names, titles (for "Prepared for" header)

A deal SHOULD exist at this stage. If no deal is found, warn the user — business case decks are typically generated for active opportunities.

### Step 3: Pull Airtable Data

Read the Airtable schema to understand the data structure:

```
Read: airtable/schema.json
```

The Airtable base contains four key tables:

**Deals table** — deal-specific overrides and notes
- Company name, deal stage, Esker modules selected, implementation timeline

**Companies table** — prospect company data
- Revenue, employee count, industry, invoice volumes, current costs, ERP system

**Pricing table** — Esker pricing (CONFIDENTIAL)
- License fees, implementation costs, annual subscription
- Per-module pricing breakdowns
- Discount tiers

**Assumptions table** — ROI calculation defaults
- Industry benchmarks for cost-per-invoice, processing time, touchless rates
- Default FTE costs, discount rates, DSO reduction targets

Note: If Airtable data is not programmatically accessible in this session, prompt the user to provide the key pricing values manually:
- Total Year 1 cost (license + implementation)
- Annual subscription (Year 2+)
- Per-module breakdown (if applicable)

**CRITICAL:** Pricing values from Airtable are baked into the HTML as non-editable display values. They must not be adjustable by the prospect. Only assumption inputs (FTE rate, DSO target, etc.) are editable via sliders.

### Step 4: Supplemental Web Research

Fill gaps not covered by HubSpot or Airtable:
- Latest company news and strategic direction
- Industry-specific ROI benchmarks for AP/AR automation
- Relevant Esker case studies
- Competitor automation initiatives

### Step 5: Load Design Assets

Read the design assets:

```
Read: DESIGN_SYSTEM.md
Read: BRAND_GUIDE.md
Read: assets/logos/baseline-logo.b64
Read: assets/logos/esker-logo.svg
Read: assets/colors.css
Read: assets/fonts.css
Read: templates/stage-decks/business-case.html    — structural template
Read: templates/sections/                          — reusable section patterns
```

### Step 6: Build the Financial Model

The business case calculator runs entirely client-side in JavaScript. Structure the model as follows:

**Fixed inputs (from Airtable pricing — NOT editable by prospect):**
- Year 1 Total Investment (license + implementation + subscription)
- Year 2+ Annual Subscription
- Per-module costs (displayed in investment summary)

**Editable inputs (sliders for prospect to adjust assumptions):**
- FTE fully loaded hourly rate (default: $45, range: $25-$85)
- Current cost per invoice (default: $18, range: $8-$35)
- Current DSO in days (default: from research, range: 20-90)
- Target DSO reduction in days (default: 8, range: 2-20)
- Annual AP invoice volume (default: from research, range: 10K-500K)
- Annual AR invoice volume (default: from research, range: 5K-200K)
- FTEs in AP (default: from research, range: 1-50)
- FTEs in AR (default: from research, range: 1-30)
- Expected touchless rate (default: 80%, range: 50%-95%)
- Company discount rate for NPV (default: 8%, range: 4%-15%)

**Calculated outputs:**
```
AP Processing Savings = (Current Cost/Invoice - Esker Cost/Invoice) x AP Volume
AR Collection Improvement = DSO Reduction x (Revenue / 365) x Cost of Capital
FTE Reallocation = FTEs Freed x Hourly Rate x 2,080
Early Payment Discounts = AP Volume x Avg Invoice Value x 2% x Capture Rate Improvement
Total Annual Benefit = AP Savings + AR Improvement + FTE Reallocation + Discounts

Payback Period (months) = Year 1 Investment / (Total Annual Benefit / 12)
3-Year Total Benefit = Annual Benefit x 3 (with 3% year-over-year improvement)
3-Year Total Cost = Year 1 Investment + (Year 2 Subscription x 2)
3-Year ROI = (3-Year Benefit - 3-Year Cost) / 3-Year Cost x 100
NPV = sum of discounted annual net cash flows over 3 years
```

### Step 7: Generate the HTML Deck

Build a single self-contained HTML file with 10 full-screen scroll-snap sections.

**General rules (same as other decks):**
- All CSS/JS inline, no external deps except Google Fonts
- CSS custom properties, `.reveal` classes, progress bar, nav dots, particles, glow orbs
- Inline logos, glass cards, responsive layout

**Section 1 — Hero:**
- Logo row: Baseline + Esker
- Company name headline with shimmer text
- Subtitle: "Business Case & ROI Analysis"
- "Prepared for [Contact Name], [Title]" (from HubSpot contacts)
- Date and confidentiality notice

**Section 2 — Executive Summary:**
- Section label: "EXECUTIVE SUMMARY"
- 4 headline metrics in large stat cards (animated counters):
  - Total 3-Year Benefit
  - Payback Period (months)
  - 3-Year ROI (%)
  - NPV
- One paragraph of executive context: what this business case covers and why now
- These values update live when the prospect adjusts assumptions later in the deck

**Section 3 — Current State Analysis:**
- Section label: "CURRENT STATE"
- Visual representation of their current AP/AR workflow pain:
  - Cost per invoice (with industry comparison)
  - Current DSO vs industry benchmark
  - Manual processing percentage
  - FTE allocation to AP/AR
- Data sourced from HubSpot properties and research
- Each metric shown as a glass card with the current value prominently displayed

**Section 4 — Proposed Solution:**
- Section label: "PROPOSED SOLUTION"
- Esker modules selected for this deal (from Airtable or deal notes):
  - AP Automation, AR Automation, Procurement, etc.
- For each module: what it does, key capability, expected outcome
- Architecture diagram if applicable (simple CSS-only flow chart)
- ERP integration callout (specific to their system if known)

**Section 5 — ROI Model (Interactive Business Case Calculator):**
- Section label: "YOUR BUSINESS CASE"
- Left panel: slider inputs for editable assumptions
- Right panel: real-time calculated outputs with animated number counters
- All calculations in client-side JavaScript
- Clear separation between fixed pricing (displayed, not editable) and adjustable assumptions
- Benefit breakdown: stacked bar or pie showing contribution of each savings category

**Section 6 — 3-Year Financial Projection:**
- Section label: "3-YEAR PROJECTION"
- Table view:
  | | Year 1 | Year 2 | Year 3 | Total |
  |---|---|---|---|---|
  | AP Savings | | | | |
  | AR Improvement | | | | |
  | FTE Reallocation | | | | |
  | Early Pay Discounts | | | | |
  | **Total Benefit** | | | | |
  | Investment | | | | |
  | **Net Benefit** | | | | |
  | **Cumulative ROI** | | | | |
- CSS-only bar chart showing cumulative benefit vs cumulative cost over 3 years
- Values update when assumptions change in Section 5

**Section 7 — Implementation Timeline:**
- Section label: "IMPLEMENTATION"
- 90-Day Proof of Value timeline (horizontal CSS timeline):
  - Phase 1 (Weeks 1-2): Setup, integration, configuration
  - Phase 2 (Weeks 3-6): Pilot with subset of invoices
  - Phase 3 (Weeks 7-10): Expand, optimize, train
  - Phase 4 (Weeks 11-12): Go-live, measure, report
- Key milestones marked on the timeline
- Esker's implementation methodology highlights

**Section 8 — Case Studies:**
- Section label: "PROVEN RESULTS"
- 2-3 case study cards (same industry or adjacent)
- Each card: logo/name, industry, key stat (e.g., "85% touchless rate"), quote if available
- Source: Esker website case studies found via web research

**Section 9 — Investment Summary:**
- Section label: "INVESTMENT"
- Pricing table (non-editable, from Airtable):
  - Year 1: license + implementation + first-year subscription
  - Year 2+: annual subscription
  - Per-module breakdown if applicable
- Comparison: investment vs annual benefit (visual ratio)
- Payback period callout prominently displayed
- "This pricing is valid for [X] days" if applicable

**Section 10 — CTA & Next Steps:**
- Headline: "Ready to Move Forward"
- 3-step next steps (glass cards):
  1. "Align internally" — share this business case with stakeholders
  2. "Technical validation" — ERP integration review with Esker team
  3. "90-day proof of value" — start the implementation
- Contact card: Tyler Massey, Baseline Payments
- Urgency element if applicable (quarter-end, budget cycle, etc.)

### Step 8: Save the Deck

```bash
mkdir -p ~/Desktop/decks
```

Save to: `~/Desktop/decks/{company-slug}-business-case.html`

### Step 9: Report to User

```
Business case deck ready:
  ~/Desktop/decks/{company}-business-case.html

Company: {name}
Deal: {deal name} — {stage}
Contact: {name}, {title}
Data Sources: {HubSpot | Airtable | Web Research}

Financial Summary:
- 3-Year Total Benefit: ${X}M
- Total Investment: ${X}K
- Payback Period: {X} months
- 3-Year ROI: {X}%
- NPV: ${X}K

Pricing Source: {Airtable | Manual Input | Placeholder}
Editable Assumptions: {N} slider inputs
Fixed Pricing: Baked from {source}

Sections: Hero | Exec Summary | Current State | Solution | ROI Calculator | 3-Year Projection | Implementation | Case Studies | Investment | CTA

Next steps:
- Review pricing values — ensure they match the latest proposal
- Adjust default assumption values if needed
- Deploy with /gtm:deploy {path}
- Validate with /gtm:check-design {path}
```

## Troubleshooting

### No deal in HubSpot
Warn the user: "No active deal found for {company}. Business case decks are typically for active opportunities. Proceed anyway?" If yes, generate without deal-specific data and note placeholders.

### Airtable pricing unavailable
Prompt the user to provide pricing manually:
- "What is the Year 1 total investment (license + implementation + subscription)?"
- "What is the annual subscription for Year 2+?"
Mark pricing sections as "DRAFT — Pricing to be confirmed" if using estimates.

### Financial model values look unrealistic
The calculator uses conservative defaults, but extreme input combinations can produce outlier results. Add a disclaimer line in the deck: "Projections based on industry benchmarks and stated assumptions. Actual results may vary."

### Large company with complex multi-entity structure
Focus the business case on a single business unit or pilot scope. Note in the executive summary that this represents one phase, with potential to expand across entities.
