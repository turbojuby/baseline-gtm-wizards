# /gtm:roi-calc

Generate a standalone interactive ROI calculator page for a prospect company. Pre-discovery tool — no pricing information, just value sizing. Designed to be shared before or during a discovery call to collaboratively quantify the opportunity.

## Usage

```
/gtm:roi-calc Lululemon
/gtm:roi-calc "Acme Manufacturing"
```

## How It Works

1. **CRM Pull** — Fetch HubSpot company data for pre-population
2. **Research** — Web search for company financials and industry benchmarks
3. **Design** — Load design system and assets
4. **Generate** — Build a single-page interactive calculator with real-time outputs
5. **Save** — Write to `~/Desktop/decks/{company}-roi-calculator.html`

## Instructions

### Step 1: Load MCP Tools

```
ToolSearch: "+hubspot search"
```

### Step 2: Pull Company Data

Search HubSpot for the company:

```
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "companies"
  searchTerm: "<company-name>"
```

Extract:
- `ar_invoice_volume_annual`, `ap_invoice_volume_annual`
- `dso_current`
- `erp_system`
- Revenue (if available)
- Employee count

If the company is not in HubSpot, proceed with web research and use the data to pre-populate slider defaults.

### Step 3: Research Company Data

Use `WebSearch` to find:
- Annual revenue
- Employee count
- Industry and sub-industry
- Public DPO/DSO from 10-K filings
- Industry benchmarks for AP/AR processing costs

Estimate invoice volumes if not available:
- **Manufacturing:** ~2,000-5,000 AP invoices per $100M revenue
- **Retail:** ~3,000-8,000 AP invoices per $100M revenue
- **Services:** ~500-2,000 AP invoices per $100M revenue
- **General rule:** ~1 AP invoice per employee per week

### Step 4: Check Airtable for Defaults

If the company has an existing deal in Airtable, read default assumptions from the Assumptions table:

```
Read: baseline-gtm-wizards/airtable/schema.json
```

Use Airtable defaults for slider starting positions if available. Otherwise, use industry benchmarks.

### Step 5: Load Design Assets

```
Read: baseline-gtm-wizards/DESIGN_SYSTEM.md
Read: baseline-gtm-wizards/BRAND_GUIDE.md
Read: baseline-gtm-wizards/assets/logos/baseline-logo.b64
Read: baseline-gtm-wizards/assets/logos/esker-logo.svg
Read: baseline-gtm-wizards/assets/colors.css
Read: baseline-gtm-wizards/assets/fonts.css
```

### Step 6: Generate the HTML Calculator

Build a single self-contained HTML file. This is NOT a scroll-snap deck — it is a single-page application layout optimized for interactive use.

**General rules:**
- All CSS/JS inline, no external deps except Google Fonts
- CSS custom properties from `:root`
- Responsive: works on desktop for screen sharing AND tablets for in-person
- Inline Base64/SVG logos
- Glass card components for input groups and output displays
- Animated number counters on output values (update on slider change)
- **NO pricing information anywhere** — this is purely a value-sizing tool

**Layout:**

```
+--------------------------------------------------+
|  [Baseline Logo]  [Esker Logo]                   |
|  ROI Calculator — {Company Name}                 |
|  "Pre-Discovery Value Assessment"                |
+--------------------------------------------------+
|                                                  |
|  INPUT PANEL                OUTPUT PANEL         |
|  +-----------+              +-----------+        |
|  | Slider 1  |              | Annual AP |        |
|  | Slider 2  |              | Savings   |        |
|  | Slider 3  |              | $XXX,XXX  |        |
|  | Slider 4  |              +-----------+        |
|  | Slider 5  |              +-----------+        |
|  | Slider 6  |              | FTE       |        |
|  | Slider 7  |              | Realloc.  |        |
|  +-----------+              | $XXX,XXX  |        |
|                             +-----------+        |
|                             +-----------+        |
|                             | Working   |        |
|                             | Capital   |        |
|                             | $X.XM     |        |
|                             +-----------+        |
|                             +-----------+        |
|                             | TOTAL     |        |
|                             | ANNUAL    |        |
|                             | BENEFIT   |        |
|                             | $X.XM     |        |
|                             +-----------+        |
|                                                  |
|  +--------------------------------------------+  |
|  |  3-Year Summary Bar  |  Payback  |  ROI %  |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
|  Baseline Payments | Confidential | {Date}       |
+--------------------------------------------------+
```

**Slider Inputs:**

Each slider has: label, current value display, min/max range, step size.

| Input | Default | Range | Step |
|-------|---------|-------|------|
| Annual AP Invoice Volume | from research | 1,000 — 1,000,000 | 1,000 |
| Current Cost Per Invoice | $18 | $5 — $40 | $0.50 |
| FTE Fully Loaded Hourly Rate | $45 | $20 — $100 | $1 |
| FTEs in AP/AR | from research | 1 — 100 | 1 |
| Current DSO (days) | from research | 15 — 120 | 1 |
| Target DSO Reduction (days) | 8 | 1 — 30 | 1 |
| Company Discount Rate (%) | 8 | 2 — 20 | 0.5 |

Pre-populate defaults from HubSpot data and web research. Each slider's starting value should reflect the best available data for this specific company.

**Calculated Outputs:**

All formulas run client-side in JavaScript. Outputs update instantly when any slider changes.

```javascript
// Annual AP Savings
const eskerCostPerInvoice = 4.50; // internal estimate, not displayed
const apSavings = (costPerInvoice - eskerCostPerInvoice) * apVolume;

// FTE Reallocation Value
const currentMinutesPerInvoice = 12; // industry avg for manual processing
const eskerMinutesPerInvoice = 2;    // with automation
const hoursSaved = (currentMinutesPerInvoice - eskerMinutesPerInvoice) / 60 * apVolume;
const ftesFreed = Math.min(hoursSaved / 2080, ftesInAP * 0.6); // cap at 60% of current FTEs
const fteValue = ftesFreed * hourlyRate * 2080;

// Working Capital Freed
// Note: needs annual revenue — estimate from invoice volume if not known
const annualRevenue = estimatedRevenue; // from research or slider
const workingCapitalFreed = dsoReduction * (annualRevenue / 365);

// Total Annual Benefit
const totalAnnualBenefit = apSavings + fteValue + workingCapitalFreed;

// Payback Period (months) — uses estimated total cost, NOT displayed
const estimatedAnnualCost = apVolume * 1.5; // rough internal estimate
const paybackMonths = (estimatedAnnualCost / (totalAnnualBenefit / 12));

// 3-Year ROI
const threeYearBenefit = totalAnnualBenefit * 3 * 1.03; // 3% annual improvement
const threeYearCost = estimatedAnnualCost * 3;
const threeYearROI = ((threeYearBenefit - threeYearCost) / threeYearCost) * 100;

// NPV (3-year)
const discountRate = companyDiscountRate / 100;
let npv = -estimatedAnnualCost; // Year 0 investment
for (let year = 1; year <= 3; year++) {
  const yearBenefit = totalAnnualBenefit * Math.pow(1.03, year - 1);
  const yearCost = year === 1 ? 0 : estimatedAnnualCost * 0.7; // lower ongoing cost
  npv += (yearBenefit - yearCost) / Math.pow(1 + discountRate, year);
}
```

**Important:** The internal cost estimates used for payback and ROI calculations are baked into the JavaScript but NOT displayed as line items. The calculator shows benefit-side metrics prominently. Cost-side numbers are only used to compute payback and ROI, and the prospect cannot see or adjust them. This keeps the focus on value without revealing pricing.

**Output Display:**

Each output metric shown in a glass card with:
- Metric label (dim text, uppercase, small)
- Value (large, bold, animated counter)
- Trend indicator or context line (e.g., "per year" or "of current AP team")

Bottom summary bar: 3-Year Total Benefit | Payback Period | 3-Year ROI % | NPV — all in a single row of compact stat cards.

**Number formatting:**
- Dollar amounts: `$1,234,567` or `$1.2M` for values over $1M
- Percentages: `234%` with a `%` suffix
- Months: `8.2 months`
- FTEs: `3.4 FTEs`

**Animation:**
- Slider changes trigger smooth counter animations (count up/down to new value)
- Use `requestAnimationFrame` for smooth 60fps counting
- Duration: 400ms per counter update
- Easing: ease-out

### Step 7: Save the Calculator

```bash
mkdir -p ~/Desktop/decks
```

Save to: `~/Desktop/decks/{company-slug}-roi-calculator.html`

### Step 8: Report to User

```
ROI calculator ready:
  ~/Desktop/decks/{company}-roi-calculator.html

Company: {name}
Industry: {industry}

Pre-populated Values:
- AP Volume: {value} ({source})
- Cost/Invoice: ${value} ({source})
- DSO: {value} days ({source})
- FTEs in AP: {value} ({source})
- Revenue: ${value} ({source})

Default Calculation:
- Annual AP Savings: ${value}
- FTE Reallocation: ${value}
- Working Capital Freed: ${value}
- Total Annual Benefit: ${value}

Interactive: 7 slider inputs, all calculations client-side
Pricing: None displayed (pre-discovery tool)

Next steps:
- Review pre-populated defaults
- Deploy with /gtm:deploy {path} --draft for internal review
- Share with prospect via /gtm:deploy {path} for production link
```

## Troubleshooting

### Revenue not found for working capital calculation
If annual revenue is unavailable, estimate from invoice volume and industry:
- Average invoice value x AP volume = rough AP spend = ~30-50% of revenue
- Or use employee count x revenue-per-employee industry benchmark
Add a note to the user about the estimate.

### Slider ranges don't fit the company
Adjust slider min/max/default values based on company size. The ranges listed above are defaults — a Fortune 500 company needs different ranges than a mid-market company. Scale accordingly.

### Outputs show negative values
This can happen if the current cost per invoice is set below the internal Esker estimate ($4.50). Add a floor in the JavaScript: `Math.max(0, apSavings)`. Display "$0" rather than negative numbers.

### User wants to add revenue as an input slider
If the company's revenue is not public and working capital calculation is important, add an Annual Revenue slider (range: $10M-$10B, step: $10M). This is the only case where the standard 7 sliders should be expanded.
