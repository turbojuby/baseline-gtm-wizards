---
description: Plan a full marketing campaign with audience targeting, channel strategy, content calendar, and HubSpot execution steps for Esker/Baseline GTM.
---

# /gtm:campaign-planning

Plan a complete marketing campaign for Baseline Payments' Esker GTM. Covers audience segmentation, channel strategy, content calendar, budget allocation, and HubSpot execution. Designed for B2B campaigns targeting Esker ICPs at mid-market enterprises.

## Usage

```
/gtm:campaign-planning "Q2 outbound to manufacturing CFOs"
/gtm:campaign-planning "webinar follow-up: AP automation trends"
/gtm:campaign-planning "account-based campaign for top 50 targets"
/gtm:campaign-planning "thought leadership series on working capital"
```

## How It Works

1. **Brief** — Parse campaign goals, audience, timeline, and constraints
2. **Audience** — Define ICP segments and persona messaging from BRAND_GUIDE.md
3. **Strategy** — Select channels, content types, and sequencing
4. **Calendar** — Build a week-by-week execution plan
5. **HubSpot Setup** — Map campaign to HubSpot lists, workflows, and tracking
6. **Report** — Deliver the full campaign plan

## Instructions

### Step 1: Define Campaign Parameters

Clarify with the user (or infer from the brief):

| Parameter | Options |
|-----------|---------|
| **Goal** | Pipeline generation, brand awareness, event promotion, nurture/re-engagement, thought leadership |
| **Audience** | ICP segment (industry, company size, persona) |
| **Timeline** | Campaign duration (2 weeks to 3 months typical) |
| **Budget** | Baseline operates at partner scale — optimize for high-impact, low-cost channels |
| **Success Metrics** | MQLs, meetings booked, pipeline created, engagement rate |

### Step 2: Audience Segmentation

Pull ICP definitions from BRAND_GUIDE.md:

```
Read: BRAND_GUIDE.md
```

**Primary ICPs for Esker campaigns:**

| Persona | Title Examples | Company Profile |
|---------|---------------|-----------------|
| CFO / VP Finance | CFO, VP Finance, SVP Finance, Treasurer | Mid-market ($100M-$5B revenue), 500-10,000 employees |
| Controller | Controller, Asst. Controller, Dir. of Accounting | Same company profile, operational buyer |
| AP Manager | AP Manager, AP Director, Shared Services Lead | Same company profile, end-user champion |
| CIO / IT Leader | CIO, VP IT, Dir. IT Applications | Same company profile, technical evaluator |

**Industry verticals (prioritize):**
1. Manufacturing (discrete and process)
2. Distribution and wholesale
3. Retail and consumer goods
4. Financial services
5. Healthcare
6. Energy and utilities

Search HubSpot for existing contacts and companies matching the campaign audience:

```
ToolSearch: "+hubspot search"
Tool: mcp__claude_ai_HubSpot__search_crm_objects
Parameters:
  objectType: "contacts"
  searchTerm: "{relevant title or company filter}"
```

### Step 3: Channel Strategy

Select from Baseline's B2B channel mix. Prioritize high-ROI channels for partner-scale budgets.

| Channel | Best For | Cost | Notes |
|---------|----------|------|-------|
| **LinkedIn (organic)** | Thought leadership, brand building | Free | Tyler + team personal profiles. 2-3 posts/week. |
| **LinkedIn (paid)** | ICP targeting, lead gen | $$ | Sponsored content + InMail. Target by title, industry, company size. |
| **Email sequences** | Outbound, nurture, event follow-up | Free (HubSpot) | Build with `/gtm:email-sequence`. 3-5 touch sequences. |
| **Webinars** | Education, pipeline acceleration | $ | Co-host with Esker. Use HubSpot landing pages for registration. |
| **In-person events** | Relationship building, late-stage deals | $$$ | Industry conferences, Esker-hosted events, executive dinners. |
| **Content marketing** | SEO, inbound, social proof | Free | Blog posts, case studies via `/gtm:content-creation`. |
| **Direct mail** | Executive engagement, ABM | $$ | Reserved for top-tier target accounts. |

**Default channel mix for a standard campaign:**
1. Email sequence (3-5 touches) — core outbound engine
2. LinkedIn organic (2-3 posts/week) — amplification and credibility
3. Content asset (blog post, case study, or one-pager) — value delivery
4. Optional: LinkedIn paid or webinar for larger campaigns

### Step 4: Content Planning

Map content to the campaign journey:

| Stage | Content Type | Purpose | Skill |
|-------|-------------|---------|-------|
| Awareness | LinkedIn post, blog post | Provoke thinking, establish credibility | `/gtm:draft-content` |
| Interest | Case study, white paper, webinar | Educate on the problem and Esker's approach | `/gtm:content-creation` |
| Consideration | Email sequence, teaser deck | Personalized outreach to target accounts | `/gtm:email-sequence`, `/gtm:teaser-deck` |
| Decision | ROI calculator, business case | Quantify value for the specific prospect | `/gtm:roi-calc`, `/gtm:business-case` |

Align all content to Esker proof points:
- Gartner MQ Leader (8 years) for credibility
- 90-day PoV for urgency and low-risk framing
- GenAI capabilities for innovation angle
- Specific customer results for social proof

### Step 5: Build Campaign Calendar

Create a week-by-week execution plan:

```
Campaign: {Name}
Duration: {X} weeks
Audience: {Persona} at {Industry/Segment}
Goal: {Primary KPI}

WEEK 1: LAUNCH
- [ ] Publish anchor content piece (blog/white paper)
- [ ] Send Email 1 to target list (problem-aware hook)
- [ ] Post LinkedIn teaser with key stat from content
- [ ] Set up HubSpot campaign tracking

WEEK 2: ENGAGE
- [ ] Send Email 2 (case study / proof point)
- [ ] LinkedIn post: customer result or industry benchmark
- [ ] Sales team shares content with active prospects
- [ ] Monitor opens/clicks, adjust subject lines

WEEK 3: CONVERT
- [ ] Send Email 3 (direct CTA — meeting request or webinar invite)
- [ ] LinkedIn post: thought leadership angle
- [ ] Follow up on engaged contacts (opens, clicks, replies)
- [ ] Sales outreach to high-intent signals

WEEK 4: CLOSE + MEASURE
- [ ] Final email touch (value recap + urgency)
- [ ] LinkedIn recap post with results/learnings
- [ ] Report on campaign metrics
- [ ] Hand off warm leads to sales pipeline
```

Adjust cadence based on campaign type:
- **Outbound blitz:** Compress to 2 weeks, daily touches
- **Thought leadership series:** Extend to 8-12 weeks, weekly cadence
- **Event-based:** Anchor around event date with pre/post sequences
- **ABM:** Longer cycle (6-8 weeks), highly personalized per account

### Step 6: HubSpot Execution Setup

Map the campaign to HubSpot objects:

**Lists:**
- Create a static or active list for the campaign audience
- Segment by persona, industry, or engagement level

**Workflows:**
- Enrollment trigger: list membership + campaign start date
- Email sequence with delays between sends
- Branch logic: if opened/clicked → fast-track; if not → alternate messaging
- Goal: meeting booked or deal created

**Tracking:**
- Create a HubSpot campaign object to group all assets
- UTM parameters for all links: `utm_campaign={name}&utm_medium={channel}&utm_source={specific source}`
- Track: email opens, clicks, replies, meetings booked, deals created

**Landing pages (if applicable):**
- Webinar registration
- Gated content download (white paper, case study)
- ROI calculator embed

```
ToolSearch: "+hubspot manage"
Tool: mcp__claude_ai_HubSpot__manage_crm_objects
```

### Step 7: Budget Estimation

Estimate costs at Baseline's partner scale:

| Line Item | Estimated Cost | Notes |
|-----------|---------------|-------|
| HubSpot (email + CRM) | Included | Existing subscription |
| LinkedIn Ads | $500-$2,000/campaign | $8-12 CPM for ICP targeting |
| Content creation | $0 (internal) | Generated via GTM Wizards skills |
| Webinar platform | $0-$200 | Zoom or HubSpot webinar tool |
| Direct mail | $50-$100/piece | For ABM only, top 10-20 accounts |
| Event sponsorship | $2,000-$10,000 | Industry conferences (selective) |

**Total typical campaign budget:** $500-$3,000 for a standard 4-week campaign.

### Step 8: Deliver Campaign Plan

```
Campaign Plan: {Name}
Created: {Date}

OVERVIEW
Goal: {Primary goal}
Audience: {Persona} at {Industry segment}
Duration: {X} weeks ({start} — {end})
Channels: {channel list}
Budget: ${X} estimated

AUDIENCE
Target size: {X} contacts in HubSpot
Persona: {primary persona}
Industry: {vertical}
Company profile: {size, revenue range}

CONTENT ASSETS NEEDED
1. {Asset type} — {topic} — Due: {date} — Skill: {/gtm:skill}
2. ...

WEEK-BY-WEEK CALENDAR
{Full calendar from Step 5}

HUBSPOT SETUP
- List: {list name and criteria}
- Workflow: {workflow description}
- Campaign: {campaign name}
- UTMs: {parameter structure}

SUCCESS METRICS
- {KPI 1}: Target {X}
- {KPI 2}: Target {X}
- {KPI 3}: Target {X}

NEXT STEPS
1. Approve campaign plan
2. Create content assets (use /gtm:content-creation and /gtm:email-sequence)
3. Build HubSpot lists and workflows
4. Launch Week 1
```

## Troubleshooting

### No contacts in HubSpot matching the audience
Build a prospect list first. Recommend using LinkedIn Sales Navigator or ZoomInfo to identify target contacts, then import to HubSpot. The campaign plan can be created in parallel with list building.

### Budget is zero
Focus entirely on organic channels: email sequences (HubSpot), LinkedIn organic posts, and content marketing. These are Baseline's highest-ROI channels and require only time investment.

### User wants a campaign for a single account (ABM)
Shift from campaign-scale to account-scale. Replace broad audience targeting with account-specific research, personalized content, and multi-threaded outreach. Use `/gtm:account-research` first, then plan 1:1 touches.
