---
description: Create long-form marketing content (blog posts, white papers, case studies) with Baseline brand voice, Esker proof points, and SEO optimization.
---

# /gtm:content-creation

Create long-form marketing content aligned with Baseline's brand voice and Esker's value propositions. Handles blog posts, white papers, case studies, and thought leadership articles with built-in SEO optimization and proof point integration.

## Usage

```
/gtm:content-creation "blog post about AP automation ROI"
/gtm:content-creation "case study for {company}"
/gtm:content-creation "white paper on P2P transformation"
/gtm:content-creation "thought leadership: CFO priorities 2026"
```

## How It Works

1. **Brief** — Parse the content type, topic, target persona, and goals
2. **Research** — Pull Esker proof points, industry data, and existing content from connectors
3. **Outline** — Generate a structured outline with key messages and proof points
4. **Draft** — Write the full content in Baseline brand voice
5. **Optimize** — Apply SEO keywords, CTAs, and formatting for the target channel

## Instructions

### Step 1: Determine Content Type

Identify which format to produce:

| Type | Length | Structure | Use Case |
|------|--------|-----------|----------|
| Blog post | 800-1,500 words | Hook → Problem → Insight → Solution → CTA | Thought leadership, SEO, social sharing |
| White paper | 2,000-4,000 words | Executive summary → Challenge → Analysis → Solution → Proof → Recommendation | Lead gen gated content |
| Case study | 800-1,200 words | Challenge → Solution → Results (with metrics) → Quote | Social proof, sales enablement |
| Thought leadership | 600-1,000 words | Provocative premise → Data → Reframe → Implication | LinkedIn, exec visibility |

### Step 2: Research and Gather Proof Points

**Search Notion for existing content guidelines:**
```
ToolSearch: "+notion search"
Tool: mcp__claude_ai_Notion__notion-search
Parameters:
  query: "content guidelines" OR "brand voice" OR "{topic}"
```

**Search Google Drive for Esker materials:**
Search the Esker folder for case studies, white papers, and data sheets relevant to the topic. Reference specific statistics and customer results.

**Web research for current data:**
- Industry statistics and trends (Ardent Partners, Levvel Research, PayStream Advisors)
- Esker press releases and customer announcements
- Competitor content for differentiation angles

**Esker proof points to weave in (use where relevant):**
- Gartner Magic Quadrant Leader — 8 consecutive years
- 90-day Proof of Value model (vs. 6-12 month implementations)
- GenAI-powered invoice processing
- ERP-agnostic (SAP, Oracle, NetSuite, Dynamics)
- Touchless invoice processing rates: 80-90% achievable
- Cost-per-invoice reduction: $15-22 manual → $2-4 automated
- DSO reduction: 5-15 days typical improvement
- Customer base: 6,000+ companies globally

### Step 3: Load Brand Voice

Read the brand guide:

```
Read: baseline-gtm-wizards/plugins/gtm-wizards/BRAND_GUIDE.md
```

Apply these voice principles to all content:
- **Data-led, not feature-led** — lead with outcomes and metrics, not product capabilities
- **Concise, not verbose** — every sentence earns its place
- **Provocative, not aggressive** — Challenger framing: reframe the reader's assumptions
- **Peer-anchored** — use real benchmarks and comparisons, not generic claims

### Step 4: Target Persona Alignment

Match content angle to the target persona from BRAND_GUIDE.md:

| Persona | Content Angle |
|---------|---------------|
| CFO / VP Finance | Financial impact, working capital, peer benchmarks, strategic positioning |
| Controller | Process efficiency, error reduction, compliance, audit readiness |
| AP Manager | Workflow transformation, team capacity, touchless processing |
| IT / CIO | Integration simplicity, ERP agnosticism, maintenance burden, security |

Default to CFO/VP Finance unless the content brief specifies otherwise.

### Step 5: SEO Optimization

Target keywords in Esker's space (select 1-2 primary, 3-5 secondary):

**Primary keywords:**
- accounts payable automation
- invoice processing automation
- P2P automation / procure-to-pay automation
- AP automation software
- invoice management solution

**Secondary keywords:**
- cost per invoice reduction
- touchless invoice processing
- accounts payable AI
- working capital optimization
- DPO improvement
- ERP invoice integration
- AP workflow automation

**SEO rules:**
- Primary keyword in title, H1, first paragraph, and 2-3 subheadings
- Natural keyword density (1-2% for primary, sprinkled for secondary)
- Meta description: 150-160 characters with primary keyword and value proposition
- Internal linking suggestions to related Baseline/Esker content

### Step 6: Write the Content

**Blog post structure:**
1. **Hook** (1-2 sentences) — Provocative stat or question that reframes the reader's thinking
2. **Problem** (1-2 paragraphs) — Quantify the pain. Use specific dollar amounts and industry benchmarks.
3. **Insight** (2-3 paragraphs) — The "teaching moment" (Challenger approach). What most companies get wrong or don't realize.
4. **Solution framing** (2-3 paragraphs) — How the best companies solve this. Reference Esker capabilities without being salesy. Use case study data.
5. **CTA** (1-2 sentences) — Soft ask: "See what this looks like for your AP team" or similar.

**Case study structure (Challenge → Solution → Results):**
1. **Company snapshot** — Name, industry, size, ERP environment
2. **Challenge** — 2-3 specific pain points with quantified impact
3. **Solution** — What Esker modules were deployed, how implementation went
4. **Results** — 3-5 specific metrics with before/after comparison
5. **Quote** — Customer voice (if available from research)
6. **Bottom line** — One sentence summary of ROI or transformation

**White paper structure:**
1. **Executive summary** — The thesis in 3-4 sentences
2. **The challenge landscape** — Industry data, trends, peer benchmarks
3. **What's changing** — Market forces driving urgency
4. **The solution framework** — How leading companies approach this (Esker methodology woven in)
5. **Proof points** — Case studies, statistics, third-party validation
6. **Recommendation** — Clear next steps for the reader
7. **About Baseline + Esker** — Brief company context

### Step 7: Format and Deliver

Output the content as clean markdown with:
- Suggested title (and 2 alternates)
- Meta description
- Target keywords
- Word count
- Suggested hero image concept
- Social media pull quotes (2-3 ready-to-post excerpts for LinkedIn)

If the user wants HTML output, apply the design system from DESIGN_SYSTEM.md and generate a branded page.

### Step 8: HubSpot Distribution (Optional)

If the user wants to publish via HubSpot:

```
ToolSearch: "+hubspot manage"
```

Provide instructions for:
- Creating a blog post in HubSpot CMS
- Setting up a landing page for gated content (white papers)
- Email distribution to relevant lists

## Troubleshooting

### Topic is too broad
Narrow the scope. Ask: "Who is the primary reader, and what's the one thing you want them to do after reading this?" Focus on a single persona and a single action.

### No Esker case studies found for the topic
Use general Esker statistics and proof points. Supplement with third-party industry research (Ardent Partners, Gartner, Forrester). Note which proof points are Esker-specific vs. industry-general.

### User wants to match an existing piece's style
Ask for a link or copy of the reference piece. Analyze its tone, structure, and formatting before drafting.
