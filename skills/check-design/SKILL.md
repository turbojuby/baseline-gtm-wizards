# /gtm:check-design

Validate an HTML file against the GTM Wizards design system. Checks for correct colors, typography, components, animations, responsiveness, and self-containment. Outputs a pass/fail checklist with specific fix instructions for any failures.

## Usage

```
/gtm:check-design ~/Desktop/decks/lululemon-teaser-deck.html
/gtm:check-design /path/to/any-deck.html
```

## How It Works

1. **Read** — Load the target HTML file and the design system spec
2. **Validate** — Check each design rule against the HTML source
3. **Report** — Output a checklist with pass/fail status and fix suggestions

## Instructions

### Step 1: Read the Files

Read the target HTML file and the design system:

```
Read: <target-file-path>
Read: baseline-gtm-wizards/DESIGN_SYSTEM.md
```

### Step 2: Run Validation Checks

Check each rule against the HTML source. For each check, scan the HTML content for the required patterns.

#### Check 1: CSS Custom Properties (No Hardcoded Colors)

**What to check:** All color values should reference CSS custom properties defined in `:root`. No hardcoded hex values like `#e85d56` in element styles — only in the `:root` definition block.

**How to check:**
- Find the `:root { ... }` block — extract all defined custom properties
- Scan all CSS outside of `:root` for hardcoded hex colors (`#[0-9a-fA-F]{3,8}`)
- Exceptions: `#fff`, `#000`, and colors inside `rgba()` / `hsla()` are acceptable
- Gradient definitions in `:root` custom properties are fine

**Pass:** All colors reference `var(--property-name)`
**Fail:** List each hardcoded color with its line number and suggest the matching custom property

#### Check 2: Reveal Animation Classes

**What to check:** Content elements (headings, paragraphs, cards, images, stat blocks) have `.reveal`, `.reveal-left`, `.reveal-right`, or `.reveal-scale` classes.

**How to check:**
- Find all content elements inside `<section>` tags
- Verify each has a reveal class
- Check that the corresponding CSS animation rules exist (`.reveal { opacity: 0; transform: ... }` and `.reveal.visible { ... }`)
- Check that the JavaScript IntersectionObserver (or scroll handler) adds the `.visible` class

**Pass:** All content elements have reveal classes and the JS observer exists
**Fail:** List elements missing reveal classes by tag and approximate location

#### Check 3: Self-Contained (No External Dependencies)

**What to check:** The HTML file has no external CSS or JS dependencies except Google Fonts.

**How to check:**
- Scan for `<link rel="stylesheet" href=...>` — only Google Fonts CDN allowed
- Scan for `<script src=...>` — none should exist (all JS must be inline `<script>` blocks)
- Scan for `url(http...)` in CSS — only Google Fonts and data URIs allowed
- Scan for `<img src="http...">` — images must be Base64 data URIs or inline SVG

**Pass:** Only Google Fonts as external dependency
**Fail:** List each external dependency with its URL and type

#### Check 4: Required Components

**What to check:** The deck includes all standard UI components.

| Component | Required Pattern |
|-----------|-----------------|
| Progress bar | `.progress-bar` element with fixed positioning and scroll-linked width |
| Navigation dots | `.nav-dots` or `.nav-dot` elements with fixed positioning |
| Floating particles | `.particle` elements or particle generation in JS |
| Ambient glow orbs | `.glow-orb` elements with blur filter and pulse animation |

**How to check:** Search for each class name and its associated CSS/JS.

**Pass:** All four components present with proper CSS
**Fail:** List missing components. Note: for single-page tools (like ROI calculator), progress bar and nav dots may not apply — note this as an acceptable skip.

#### Check 5: Responsive Breakpoints

**What to check:** CSS includes `@media` queries for responsive behavior.

**Required breakpoints:**
- Tablet: `max-width: 768px` (or similar)
- Mobile: `max-width: 480px` (or similar)

**How to check:**
- Scan for `@media` rules
- Verify they adjust layout (grid columns, font sizes, padding)
- Check that `clamp()` is used for fluid typography

**Pass:** At least 2 responsive breakpoints with meaningful layout changes
**Fail:** List what's missing and suggest specific responsive rules to add

#### Check 6: Base64 Logos Embedded

**What to check:** Logos are embedded inline, not loaded from external URLs.

**How to check:**
- Find `<img>` tags for logos — `src` should start with `data:image/` (Base64)
- Find `<svg>` tags for logos — should be inline SVG markup, not `<img src="logo.svg">`
- No references to `baseline-logo.png`, `esker-logo.svg` as external files

**Pass:** All logos embedded as Base64 or inline SVG
**Fail:** List each logo that references an external file

#### Check 7: Stat Counters Pattern

**What to check:** Animated number counters use the `data-target` attribute pattern.

**How to check:**
- Find elements displaying statistics/metrics
- Verify they have `data-target="<number>"` attributes
- Verify JS code reads `data-target` and animates from 0 to the target value
- Check for number formatting (commas, dollar signs, percentage suffixes)

**Pass:** Stat elements use `data-target` with JS counter animation
**Fail:** List stat elements without the pattern. Note: interactive calculators that update on slider change may use a different pattern — this is acceptable if the animation is still present.

#### Check 8: Glass Card Pattern

**What to check:** Card components use the glass morphism pattern.

**Required CSS properties:**
```css
background: var(--surface);           /* or rgba with low opacity */
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid var(--border);
border-radius: 16px;                  /* or 12px-20px range */
```

**How to check:**
- Find `.glass` class or card elements
- Verify `backdrop-filter: blur()` is present
- Verify `-webkit-backdrop-filter` prefix exists (Safari support)
- Check for hover state with `transform: translateY(-Xpx)` lift effect

**Pass:** Glass cards have all required properties including webkit prefix
**Fail:** List missing properties per card class

#### Check 9: Section Structure

**What to check:** Sections use full-height scroll-snap layout.

**Required:**
- `html { scroll-snap-type: y mandatory; }`
- `section { min-height: 100vh; scroll-snap-align: start; }`
- Each section has a `.section-inner` wrapper with `max-width`
- Sections have proper z-indexing (content above background elements)

**How to check:** Scan for `scroll-snap-type` on `html`, `min-height: 100vh` and `scroll-snap-align` on `section` elements.

**Pass:** Scroll-snap structure is correct
**Fail:** List what's missing. Note: single-page tools (ROI calculator) may not use scroll-snap — acceptable skip.

#### Check 10: Font Family

**What to check:** The correct font family is loaded and applied.

**Accepted fonts:**
- `Inter` (design system default)
- `Plus Jakarta Sans` (used in existing Baseline decks)

**How to check:**
- Verify a Google Fonts `<link>` loads the font with weight 800+ included
- Verify `body` or `*` selector sets `font-family` to the correct font
- Verify headlines use weight 800 or 900

**Pass:** Correct font loaded with appropriate weights
**Fail:** Identify the incorrect font and provide the correct Google Fonts link

### Step 3: Output the Report

Format the output as a checklist:

```
Design System Validation: {filename}

 [PASS] CSS Custom Properties — all colors use variables
 [PASS] Reveal Animations — 24 elements with reveal classes, JS observer present
 [FAIL] Self-Contained — external script found: chart.js CDN
         Fix: Inline the chart.js code or replace with CSS-only chart
 [PASS] Required Components — progress bar, nav dots, particles, glow orbs
 [PASS] Responsive Breakpoints — 768px and 480px breakpoints
 [PASS] Base64 Logos — both logos embedded inline
 [FAIL] Stat Counters — 3 stat elements missing data-target attribute
         Fix: Add data-target="1234567" to elements at lines 342, 356, 371
 [PASS] Glass Card Pattern — backdrop-filter with webkit prefix
 [PASS] Section Structure — scroll-snap with 6 sections
 [PASS] Font Family — Plus Jakarta Sans loaded, weight 800

Result: 8/10 checks passed — 2 issues to fix
```

For each `[FAIL]`, provide:
- What specifically is wrong (with line numbers if possible)
- The exact fix needed (code snippet or property to add)
- Why it matters (e.g., "Without webkit prefix, blur won't work in Safari")

### Step 4: Offer to Auto-Fix

If failures are found, offer:

```
Would you like me to fix these 2 issues automatically?
```

If the user agrees, use the Edit tool to apply the fixes directly to the HTML file, then re-run the validation to confirm all checks pass.

## Troubleshooting

### File is not an HTML deck (e.g., ROI calculator)
Single-page interactive tools may legitimately skip some checks:
- Progress bar and nav dots — not applicable for single-page layouts
- Scroll-snap sections — not applicable
- Mark these as `[SKIP]` instead of `[FAIL]` and note why

### Deck uses a different color scheme than DESIGN_SYSTEM.md
Some decks (especially older ones like the Lululemon deck) may use a different palette. Flag the difference but don't mark as fail if the deck uses consistent custom properties internally. Suggest migrating to the standard palette.

### Very large HTML file (>500 lines of CSS)
Focus validation on structural patterns rather than checking every single line. Sample 20-30 representative elements for reveal classes rather than checking exhaustively.
