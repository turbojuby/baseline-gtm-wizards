---
description: Quick-turn marketing copy — blog posts, LinkedIn posts, email newsletters, case study drafts — in Baseline brand voice with Esker proof points.
---

# /gtm:draft-content

Generate quick-turn marketing copy in Baseline's brand voice. Faster and lighter than `/gtm:content-creation` — designed for rapid content production when you know what you want and just need it written well.

## Usage

```
/gtm:draft-content "LinkedIn post about 90-day PoV advantage"
/gtm:draft-content "blog post: why CFOs should care about AP automation in 2026"
/gtm:draft-content "email newsletter recap of Q1 wins"
/gtm:draft-content "case study draft for {company}"
/gtm:draft-content "3 LinkedIn posts for this week"
```

## How It Works

1. **Parse** — Identify content type, topic, persona, and length
2. **Research** — Pull relevant data from connectors and web
3. **Draft** — Write in Baseline brand voice with Esker proof points
4. **Deliver** — Output formatted copy ready to publish or edit

## Instructions

### Step 1: Identify Content Type and Requirements

| Type | Length | Tone | Output Format |
|------|--------|------|---------------|
| LinkedIn post | 100-300 words | Provocative, concise, personal voice | Plain text (no markdown in posts) |
| Blog post | 800-1,500 words | Data-led, educational, Challenger framing | Markdown with headers |
| Email newsletter | 300-600 words | Conversational, value-packed, scannable | HTML-ready or plain text |
| Case study draft | 600-1,000 words | Results-focused, metric-heavy | Challenge → Solution → Results format |
| Social media batch | 3-5 posts, 50-200 words each | Mix of provocative, data-driven, personal | Plain text per post |

### Step 2: Load Brand Voice

```
Read: baseline-gtm-wizards/plugins/gtm-wizards/BRAND_GUIDE.md
```

**Voice checklist for all content:**
- [ ] Data-led: opens with a stat, metric, or quantified insight — not a feature
- [ ] Concise: no filler sentences, no throat-clearing intros
- [ ] Provocative: reframes the reader's thinking (Challenger approach)
- [ ] Peer-anchored: references real benchmarks, competitors, or industry data
- [ ] No generic claims: no "best-in-class," "world-leading," "cutting-edge"

### Step 3: Research Context

**Search Notion for content guidelines and existing content:**
```
ToolSearch: "+notion search"
Tool: mcp__claude_ai_Notion__notion-search
Parameters:
  query: "{topic}" OR "content" OR "brand voice"
```

**Search Google Drive Esker folder for reference materials:**
Look for case studies, white papers, and data sheets relevant to the topic. Pull specific statistics and customer results to weave into the content.

**Web search for current data:**
- Fresh industry statistics (Ardent Partners, Gartner, Forrester)
- Esker news and customer announcements
- Trending topics in the AP/AR automation space

**Esker proof points library (use as relevant):**

| Proof Point | Use When |
|-------------|----------|
| Gartner MQ Leader, 8 consecutive years | Credibility, awareness content |
| 90-day Proof of Value | Urgency, differentiation, risk reduction |
| GenAI-powered invoice processing | Innovation, tech leadership content |
| 80-90% touchless invoice rates | Efficiency, AP transformation content |
| Cost per invoice: $15-22 → $2-4 | ROI, cost reduction content |
| ERP-agnostic (SAP, Oracle, NetSuite, Dynamics) | Technical, IT-focused content |
| 6,000+ customers globally | Scale, trust content |
| DSO reduction: 5-15 days typical | Cash flow, CFO-focused content |

### Step 4: Draft the Content

**LinkedIn post guidelines:**
- Hook in first 2 lines (this is what shows before "See more")
- No markdown formatting — LinkedIn renders plain text only
- Use line breaks for readability, not bullet points
- End with a question or opinion that invites engagement
- 3-5 relevant hashtags at the bottom
- Write in first person (Tyler's voice) unless specified otherwise
- No emojis unless the user requests them

Example structure:
```
[Hook — provocative stat or question]

[2-3 short paragraphs expanding the insight]

[Implication for the reader]

[Question to drive engagement]

#APAutomation #FinanceTransformation #Esker
```

**Blog post guidelines:**
- Title: 8-12 words, includes primary keyword, provocative angle
- Subtitle: One sentence expanding the title
- Open with a stat or scenario, not "In today's business environment..."
- Use H2 subheadings every 200-300 words
- Include 2-3 data callouts (bold stat + context)
- Close with a soft CTA (not "contact us today")
- Suggest meta description (150-160 chars) and 2 alternate titles

**Email newsletter guidelines:**
- Subject line: 5-8 words, curiosity or value-driven
- Preview text: extends the subject line's promise
- Body: 3-4 short sections, each with a bold headline and 2-3 sentences
- One primary CTA (link to content, event, or meeting)
- Plain, confident tone — no markdown formatting in email body
- Sign off as Tyler or the Baseline team

**Case study draft guidelines:**
- Follow Esker's format: Challenge → Solution → Results
- Challenge section: 2-3 specific pain points with quantified impact
- Solution section: what Esker modules deployed, how the PoV worked
- Results section: 3-5 specific metrics with before/after numbers
- Include a pull quote (draft one if no real quote available, mark as "[Draft quote — needs customer approval]")
- Bottom line: one sentence ROI summary

### Step 5: Deliver Output

For each piece of content, provide:

```
TYPE: {content type}
TOPIC: {topic}
TARGET PERSONA: {persona}
WORD COUNT: {count}

---

{The content}

---

NOTES:
- Proof points used: {list}
- Suggested keywords: {if blog}
- Social pull quotes: {2-3 excerpts for LinkedIn sharing, if blog or white paper}
- Next steps: {publish to X, share with team, etc.}
```

If the user requested multiple pieces (e.g., "3 LinkedIn posts for this week"), deliver all in sequence with brief context for each.

## Troubleshooting

### Topic is too vague
Ask: "Who's the target reader, and what's the one takeaway?" If the user says "something about AP automation," push for specificity: a stat, an angle, a persona.

### No relevant Esker data found
Use industry-level statistics from Ardent Partners, Gartner, or other analyst firms. Frame insights around the category (AP automation) rather than Esker specifically. Note which proof points are Esker-specific vs. industry-general.

### User wants to match a specific voice
Ask for a sample or reference. Analyze its tone, sentence length, vocabulary, and structure before drafting. Adapt Baseline voice principles to match the reference style.

### Content needs legal/compliance review
Flag any claims that reference specific customer results, ROI numbers, or competitive comparisons. Mark these with "[Verify]" so the user knows to confirm before publishing.
