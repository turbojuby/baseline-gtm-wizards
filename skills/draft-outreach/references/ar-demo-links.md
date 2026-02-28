# Esker AR Demo Board Links (Consensus)

Personalized Consensus demo board links for Esker's Invoice-to-Cash (I2C / AR) solutions. Each link opens an interactive demo experience pre-filled with the prospect's information — no login required, no "Who Are You?" form.

---

## How to Construct a Personalized URL

Each link below is a **template**. Replace the placeholders with the prospect's actual data:

| Placeholder | Replace With | Example |
|-------------|-------------|---------|
| `{first}` | Prospect's first name | `Jane` |
| `{last}` | Prospect's last name | `Smith` |
| `{email}` | Prospect's email address | `jane.smith@acme.com` |
| `{company}` | Prospect's company name, **URL-encoded** | `Acme%20Corp` |

### URL Encoding Rules

- **Spaces** in company names MUST be replaced with `%20`
- Examples:
  - `Acme Corp` → `Acme%20Corp`
  - `Johnson & Johnson` → `Johnson%20%26%20Johnson`
  - `US Foods` → `US%20Foods`
  - `IBM` → `IBM` (no encoding needed)
- When in doubt, URL-encode any special characters: `&` → `%26`, `+` → `%2B`, `#` → `%23`

### Example

Prospect: Jane Smith, jane.smith@acme.com, Acme Corp, CFO

Constructed URL:
```
https://play.goconsensus.com/b139e4499?fn=Jane&ln=Smith&em=jane.smith@acme.com&co=Acme%20Corp
```

---

## The 7 AR Demo Links

### 1. Full I2C Suite — CFO / Strategic

**Template:** `https://play.goconsensus.com/b139e4499?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** Complete Invoice-to-Cash platform overview — credit decisioning, collections prioritization, cash application, and deductions management in one branching experience. Strategic framing: working capital impact, DSO reduction, full AR transformation.

**Use for:** CFOs, VPs of Finance, Treasurers. When the conversation is about cash flow visibility, working capital optimization, or evaluating a full AR transformation.

**HubSpot snippet shortcut:** `#ar-i2c-cfo`

---

### 2. Full I2C Suite — AR Operations

**Template:** `https://play.goconsensus.com/bfd086df3?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** Same I2C branching demo as #1, but this link tracks separately in Consensus Demolytics. Framed for operational buyers: daily workflow improvements, team capacity, automation rates, DSO impact on their KPIs.

**Use for:** AR Managers, AR Directors, Order-to-Cash Leads. When the prospect owns AR operations and cares about efficiency, automation, and team productivity. **This is the default/safest link when the persona is unclear.**

**HubSpot snippet shortcut:** `#ar-i2c-ops`

---

### 3. Collections & Invoice Management (CIM)

**Template:** `https://play.goconsensus.com/s24f64d66?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** Focused on Esker's Collection & Invoice Management module — AI-scored collection worklists, automated dunning cadences, dispute tracking, aging analysis. Shows how teams prioritize which accounts to call and automate routine follow-ups.

**Use for:** Collections Managers, AR Managers with collections-specific pain. When the prospect mentions: collections backlog, manual dunning, prioritization challenges, dispute resolution delays, or DSO creeping up because of collections inefficiency.

**HubSpot snippet shortcut:** `#ar-cim`

---

### 4. Cash Application

**Template:** `https://play.goconsensus.com/u9385fea5?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** AI-powered cash application — remittance matching, lockbox processing, multi-format payment handling (checks, ACH, wire, EDI). Shows straight-through processing rates, exception handling, and bank reconciliation acceleration.

**Use for:** Cash Application Specialists, Controllers, AR Managers. When the prospect mentions: unapplied receipts, manual remittance matching, low straight-through processing rates, bank reconciliation delays, or high volume of payment exceptions.

**HubSpot snippet shortcut:** `#ar-cashapp`

---

### 5. Credit Management

**Template:** `https://play.goconsensus.com/ue517bcb6?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** Credit scoring, automated credit limit recommendations, real-time risk monitoring, credit hold management, and audit trail. Shows how credit teams consolidate data sources and accelerate credit decisions.

**Use for:** Credit Managers, Credit Analysts, Risk Managers. When the prospect mentions: slow credit approvals, bad debt write-offs, credit hold delays frustrating sales, manual credit reviews, or lack of portfolio-wide risk visibility.

**HubSpot snippet shortcut:** `#ar-credit`

---

### 6. Claims & Deductions

**Template:** `https://play.goconsensus.com/bf8fea9e9?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** Claims & deductions resolution workflow — claim creation, root cause coding, workflow routing, resolution tracking, and prevention of invalid/recurring deductions. Shows how teams clear deductions backlogs and recover revenue.

**Use for:** AR Managers, Deductions Analysts, Revenue Recovery teams. When the prospect mentions: deductions backlog, margin erosion from invalid deductions, manual root cause investigation, slow claims resolution, or retailer/distributor deduction complexity.

**HubSpot snippet shortcut:** `#ar-deductions`

---

### 7. I2C AI Vision — IT / Technical

**Template:** `https://play.goconsensus.com/a33ee1edd?fn={first}&ln={last}&em={email}&co={company}`

**Demo content:** Technical walkthrough of Esker's I2C AI capabilities — GenAI-powered processing, 70+ ERP connectors (SAP, Oracle, NetSuite, Dynamics, Sage), cloud-native architecture, security model, and 90-day Proof of Value on live production data.

**Use for:** IT Directors, CIOs, ERP Admins, Solution Architects. When the prospect is the technical evaluator: concerned about ERP integration, implementation timeline, maintenance burden, data security, or AI/ML capabilities.

**HubSpot snippet shortcut:** `#ar-i2c-it`

---

## Persona Selection Guide

When drafting an email and choosing which demo link to include, match the prospect's role:

| Prospect Role | Demo Link | Why |
|--------------|-----------|-----|
| CFO / VP Finance / Treasurer | #1 Full I2C - CFO | Strategic framing, working capital, full transformation |
| Controller / Accounting Director | #4 Cash App (or #1 if strategic) | Controllers care about reconciliation and close cycle |
| AR Director / AR Manager (broad) | #2 Full I2C - AR Ops | Covers everything, operational framing |
| AR Manager (collections focus) | #3 CIM | Collections-specific pain |
| AR Manager (deductions focus) | #6 Claims & Deductions | Deductions-specific pain |
| Collections Manager | #3 CIM | Their exact function |
| Cash Application Specialist | #4 Cash App | Their exact function |
| Credit Manager / Credit Analyst | #5 Credit Management | Their exact function |
| IT Director / CIO / ERP Admin | #7 I2C AI Vision - IT | Technical evaluation |
| Unknown role / general AR interest | #2 Full I2C - AR Ops | Safest default — covers everything |

---

## Embedding in Emails

When including a demo link in an email, embed it as a hyperlink — never paste the raw URL. Use a clear CTA:

**Good:**
> I put together a quick walkthrough tailored to your team — [see how Esker handles cash application automation](https://play.goconsensus.com/u9385fea5?fn=Jane&ln=Smith&em=jane@acme.com&co=Acme%20Corp).

**Bad:**
> Here's a link: https://play.goconsensus.com/u9385fea5?fn=Jane&ln=Smith&em=jane@acme.com&co=Acme%20Corp

Keep the CTA text natural and specific to the demo content. Don't say "click here" — describe what they'll see.
