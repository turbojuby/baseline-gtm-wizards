---
description: Draft personalized outreach emails and LinkedIn messages using HubSpot contact data, Esker value props, and Challenger Sales methodology.
---

# /gtm:draft-outreach

Research a prospect and draft personalized outreach — cold email, warm follow-up, or LinkedIn message — using Challenger Sales methodology and Esker-specific value props.

## Usage

```
/gtm:draft-outreach "Jane Smith at Acme Corp"
/gtm:draft-outreach <contact-name-or-company>
/gtm:draft-outreach "CFO at Lululemon" --linkedin
```

## Instructions

### Step 1: Research the Prospect

1. **HubSpot** — search contacts and companies for the prospect. Pull:
   - Contact: name, title, email, last activity, lifecycle stage
   - Company: industry, revenue, employee count, ERP, invoice volumes
   - Deals: any existing deal, stage, history
   - Activity: prior emails, calls, meetings logged
2. **Web search** — LinkedIn profile, recent posts, speaking engagements, company news
3. **Fathom** — check for prior call transcripts with this person or company

### Step 2: Determine Outreach Context

Based on what you find:
- **Cold outreach** — no prior contact, no HubSpot record or stale record
- **Warm follow-up** — existing relationship, prior meetings, active deal
- **Re-engagement** — went dark, deal stalled, need to restart conversation
- **Referral/intro** — warm intro path available

### Step 3: Select Persona Messaging

Match the prospect to a persona from BRAND_GUIDE.md:

| Persona | Lead With | Avoid |
|---------|-----------|-------|
| **CFO / VP Finance** | Peer DPO benchmarks, working capital impact, cash flow visibility | Feature lists, technical details |
| **Controller** | Cost per invoice, error rates, audit risk, close cycle time | Big-picture strategy language |
| **AP Manager** | Daily workflow transformation, team capacity, touchless rates | Financial jargon, executive framing |
| **IT / CIO** | ERP integration simplicity, implementation timeline, security | Business process details |

Default to CFO messaging if the persona is unclear.

### Step 4: Apply Challenger Sales Framework

Every outreach should follow the Challenger pattern:
1. **Teach** — lead with an insight they don't already know (peer benchmark, industry trend, cost data)
2. **Tailor** — connect the insight to their specific situation (company, industry, role)
3. **Take Control** — propose a specific next step with a clear value exchange

**Do NOT:**
- Lead with "I'd love to learn more about your business" (passive)
- Lead with Esker features or product descriptions (feature-led)
- Ask for "15 minutes of your time" without offering value first

### Step 5: Draft the Message

**For email (default):**
- Subject line: 6-10 words, specific and curiosity-driving. Reference a data point or peer company.
- Body: 4-6 sentences max. Structure:
  1. Hook — one sentence with a specific insight or data point
  2. Bridge — connect to their company/role
  3. Proof — one proof point (case study, stat, Gartner MQ)
  4. CTA — one specific ask (15-min call to share the analysis, not "learn more")
- Tone: Baseline voice from BRAND_GUIDE.md — confident, data-led, concise

**For LinkedIn (with --linkedin flag):**
- Connection request note: 2-3 sentences max (300 char limit)
- InMail: 3-4 sentences, more conversational than email
- Reference something specific from their profile or recent activity

**Key Esker value props to weave in (pick 1-2, don't list all):**
- 90-day Proof of Value — live production results, not sandbox demos
- Gartner MQ Leader 8 consecutive years
- GenAI-powered invoice processing
- ERP-agnostic — connects to SAP, Oracle, NetSuite, Dynamics
- Cost per invoice: $12-15 manual to $2-3 automated

### Step 6: Create Gmail Draft (if email)

If drafting an email, use Gmail to create a draft:
- To: prospect's email from HubSpot or research
- Subject: the drafted subject line
- Body: the drafted message

### Step 7: Output

```
## Outreach Draft: {Prospect Name}

### Prospect Profile
- Name: {name}
- Title: {title}
- Company: {company}
- Persona: {CFO / Controller / AP Manager / CIO}
- HubSpot Status: {existing contact / new}
- Outreach Type: {cold / warm / re-engagement}

### Email Draft
Subject: {subject line}

{Body text}

### Alternative Subject Lines
1. {option 2}
2. {option 3}

{If --linkedin:}
### LinkedIn Message
{Connection note or InMail}

### Messaging Rationale
- Challenger insight used: {what you taught}
- Proof point: {what evidence you cited}
- Persona alignment: {why this angle for this role}

### Suggested Follow-Up Sequence
- Day 3: {follow-up angle}
- Day 7: {different value prop or proof point}
- Day 14: {breakup or new channel}
```

See BASELINE_PLAYBOOK.md for full connector instructions and knowledge source map.
