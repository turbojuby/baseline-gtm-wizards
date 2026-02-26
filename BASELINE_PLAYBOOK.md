# Baseline Playbook

The DNA file for all GTM skills. Every `/gtm:*` skill references this playbook as its foundational context.

---

## Company Identity

**Baseline Payments** is Esker's North American go-to-market partner. We sell **Supply-to-Pay (S2P)** and **Procure-to-Pay (P2P)** automation powered by Esker's AI platform to mid-market enterprise accounts.

- **Sales methodology:** Challenger Sales
- **Esker credibility:** Gartner Magic Quadrant Leader 8 consecutive years
- **Proof model:** 90-day Proof of Value (PoV) — live production results, not sandbox demos
- **Deal motion:** Land with AP automation pain, expand into full S2P suite

---

## Connector Priority List

| Need | Connector | When to use |
|------|-----------|-------------|
| CRM | HubSpot | Always — companies, contacts, deals, pipeline |
| Company knowledge | Notion | Sales methodology, ICPs, personas, playbooks, team wiki |
| Documents | Google Drive | Esker folder (top-level) for white papers, case studies, "How Esker Sells Esker" PDF, technical docs |
| Email | Gmail | Sending follow-ups, checking threads |
| Calendar | Google Calendar | Meeting context, attendee lookup |
| Team chat | Google Chat | Team notifications, deal updates |
| Meeting recordings | Fathom | Call transcripts, summaries, action items |
| Deploy | Firebase Hosting (via GTM MCP) | Publishing HTML decks/assets |
| Deal data | Airtable (via GTM MCP) | Pricing, assumptions, ROI calculations |

---

## Knowledge Source Map

Where to find what — always go to the live source, never rely on cached data.

| What you need | Where to find it | Connector |
|---------------|------------------|-----------|
| "How Esker Sells Esker" PDF | Google Drive > Esker folder (top-level) | Google Drive |
| Esker technical documentation | Google Drive > Esker folder | Google Drive |
| White papers, case studies, one-pagers | Google Drive > Esker folder | Google Drive |
| Sales methodology, discovery framework | Notion | Notion |
| ICP definitions, persona messaging | Notion | Notion |
| BANT/3Ps qualification criteria | Notion | Notion |
| Company/contact/deal data | HubSpot | HubSpot |
| Pricing and ROI assumptions | Airtable | Airtable |
| Past meeting context, call transcripts | Fathom | Fathom |
| Team discussions, deal updates | Google Chat | Google Chat |

---

## Standing Instructions

**Live-first approach.** Every task must fetch current data from connectors. Local/cached knowledge is a fallback, never the primary source.

1. **For EVERY task:** Search Notion and Google Drive for relevant context. Do not rely on cached or local knowledge alone.
2. **Esker-related tasks:** ALWAYS search Google Drive Esker folder for the "How Esker Sells Esker" document and reference it.
3. **Account research:** ALWAYS check HubSpot first for company/contact/deal data, then enrich with web search.
4. **Sales methodology, ICPs, personas, qualification:** ALWAYS search Notion — this is the team's living knowledge base.
5. **Esker collateral** (white papers, case studies, one-pagers, technical docs): ALWAYS search Google Drive Esker folder.
6. **Meeting history / call context:** ALWAYS check Fathom for recent transcripts.
7. **Freshness guarantee:** Notion and Google Drive are updated multiple times daily. Always fetch live. Never assume local reference files are current.

---

## Skill Reference

All available `/gtm:` skills organized by category.

### Deck Creation
| Skill | Purpose |
|-------|---------|
| `/gtm:design` | Freeform branded HTML generation (catch-all) |
| `/gtm:teaser-deck` | Pre-meeting teaser — company-specific, 5-7 slides |
| `/gtm:discovery-deck` | Post-discovery presentation with pain points and value mapping |
| `/gtm:business-case` | Executive business case with ROI and implementation plan |
| `/gtm:roi-calculator` | Interactive ROI calculator with live inputs |

### Deployment
| Skill | Purpose |
|-------|---------|
| `/gtm:deploy` | Deploy HTML output to Firebase Hosting (draft or prod) |
| `/gtm:check-design` | Screenshot and visually QA an HTML file before deploy |

### Sales Intelligence
| Skill | Purpose |
|-------|---------|
| `/gtm:account-research` | Deep-dive company research from HubSpot + web |
| `/gtm:call-prep` | Pre-call brief with attendee intel and talk tracks |
| `/gtm:call-summary` | Post-call summary with action items from Fathom |
| `/gtm:daily-briefing` | Morning pipeline snapshot and priority actions |
| `/gtm:draft-outreach` | Personalized outreach email/sequence for a contact |
| `/gtm:competitive-intel` | Competitive landscape analysis for a deal |
| `/gtm:forecast` | Pipeline forecast with risk flags |
| `/gtm:pipeline-review` | Full pipeline health check with recommendations |

### Marketing
| Skill | Purpose |
|-------|---------|
| `/gtm:content-creation` | Long-form content (blog, whitepaper, case study) |
| `/gtm:draft-content` | Quick-turn marketing copy |
| `/gtm:email-sequence` | Multi-touch email campaign |
| `/gtm:campaign-planning` | Full campaign strategy and timeline |

### Workflow Orchestrators
Multi-step workflows that chain skills together automatically.

| Skill | Purpose |
|-------|---------|
| `/gtm:disco-prep` | Discovery meeting prep: account research + call prep + discovery deck |
| `/gtm:outbound-prep` | Outbound sequence: account research + draft outreach + teaser deck |
| `/gtm:deal-review` | Deal health check: pipeline review + forecast + competitive intel |
| `/gtm:morning-brief` | Start-of-day: daily briefing + pipeline review + calendar scan |
| `/gtm:teaser-prep` | Teaser flow: account research + teaser deck + deploy |
