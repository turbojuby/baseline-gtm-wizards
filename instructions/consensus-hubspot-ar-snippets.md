# Esker AR Demo Board — Consensus Mail Merge Links + HubSpot Snippets

## Instructions for Claude Chrome Extension

You are helping create a library of 7 AR (Accounts Receivable / Invoice-to-Cash) demo board mail merge links in Consensus, then create 7 corresponding HubSpot snippets that contain those links. Execute each phase sequentially.

---

## Phase A: Create 7 Mail Merge Links in Consensus

### How to navigate
1. Go to **https://app.goconsensus.com** (you should already be logged in)
2. In the left sidebar, click **Settings** (gear icon, bottom-left)
3. Click **Mail Merge**
4. Click **"Create New"** (or "Create Mail Merge Link")

### For each of the 7 links below, repeat these steps:

1. **Mail Merge Link Name** — Enter the name from the table below
2. **Demo** — Select the exact demo name from the dropdown (scroll or search)
3. **Platform** — Select **HubSpot**
4. **Field mapping** — Map these fields:
   - First Name → HubSpot first name token
   - Last Name → HubSpot last name token
   - Email → HubSpot email token
   - Company → HubSpot company token
   - Title → HubSpot job title token (optional)
5. **Additional Options** — Add **Andrew Galang** as a notifier so Demolytics appear in his dashboard
6. Click **"Create the Link"**
7. **Copy the generated URL** and paste it into the tracking table at the bottom of this document

Then click "Create New" again and repeat for the next link.

### The 7 Links to Create

| # | Mail Merge Link Name | Demo to Select (exact name in dropdown) |
|---|----------------------|-----------------------------------------|
| 1 | `BL - AR - Full I2C Suite - CFO` | **I2C Solutions - Branching Demo** |
| 2 | `BL - AR - Full I2C Suite - AR Ops` | **I2C Solutions - Branching Demo** |
| 3 | `BL - AR - Collections & Invoicing` | **CIM Focused - Standard Personalization** |
| 4 | `BL - AR - Cash Application` | **Cash App Focused - Standard Personalization** |
| 5 | `BL - AR - Credit Management` | **Credit Mgmt Focused - Standard Personalization** |
| 6 | `BL - AR - Claims & Deductions` | **Claims & Deductions Focused - Standard Personalization** |
| 7 | `BL - AR - I2C AI Vision - IT` | **I2C Vision Gen - Standard Personalization** |

> **Note:** Links 1 and 2 use the same demo but are separate mail merge links. This is intentional — they target different personas (CFO vs. AR Ops) and will have separate Demolytics tracking and separate HubSpot snippets with different copy.

---

## Phase B: Create 7 HubSpot Snippets

### How to navigate
1. Go to **https://app.hubspot.com**
2. Navigate to **CRM → Snippets** (or search "Snippets" in the top search bar)
3. Click **"Create snippet"**

### For each of the 7 snippets below, repeat these steps:

1. **Internal name** — Enter the snippet name from the table
2. **Shortcut** — Enter the shortcut (without the `#` — HubSpot adds it automatically)
3. **Snippet body** — Type/paste the snippet text from below
4. **For the hyperlinked CTA text** (the bold text in brackets):
   - Type the CTA text (e.g., "View the AR Transformation Demo")
   - Select/highlight the CTA text
   - Click the **link icon** in the toolbar
   - Paste the corresponding Consensus mail merge URL from Phase A
   - Click "Apply" or "Save"
5. **For personalization tokens** (where you see `{{ company.name }}`):
   - Delete the placeholder text `{{ company.name }}`
   - Click the **"Personalize"** dropdown in the toolbar
   - Select **Company** → **Company name**
   - Click **Insert**
6. Click **"Save"**

Then click "Create snippet" again and repeat for the next one.

### The 7 Snippets to Create

---

#### Snippet 1

| Field | Value |
|-------|-------|
| **Name** | `AR - Full I2C - CFO Demo Link` |
| **Shortcut** | `ar-i2c-cfo` |
| **Target persona** | CFO, VP Finance, Treasurer |

**Body:**

I put together a quick interactive walkthrough of Esker's Invoice-to-Cash platform — covers credit, collections, cash application, and deductions in one view. Companies using it cut DSO by 20+ days. Gartner MQ Leader 8 years running.

**[View the AR Transformation Demo →]({PASTE MAIL MERGE URL #1 HERE})**

---

#### Snippet 2

| Field | Value |
|-------|-------|
| **Name** | `AR - Full I2C - AR Ops Demo Link` |
| **Shortcut** | `ar-i2c-ops` |
| **Target persona** | AR Manager, AR Director, Order-to-Cash Lead |

**Body:**

Here's an interactive walkthrough of Esker's I2C platform built for AR operations — prioritized collection worklists, AI-powered cash application, automated dunning. Takes about 4 minutes and is tailored to `{{ company.name }}`.

**[See the Full I2C Platform →]({PASTE MAIL MERGE URL #2 HERE})**

> Remember: Insert `{{ company.name }}` using the Personalize dropdown (Company → Company name), not by typing it manually.

---

#### Snippet 3

| Field | Value |
|-------|-------|
| **Name** | `AR - Collections & Invoicing Demo Link` |
| **Shortcut** | `ar-cim` |
| **Target persona** | AR Manager, Collections Manager |

**Body:**

Built a short demo focused on Esker's Collection & Invoice Management — AI-scored collection worklists, automated dunning, and dispute tracking. Companies see 15-30% faster resolution and measurable DSO reduction within 90 days.

**[Explore Collections & Invoice Management →]({PASTE MAIL MERGE URL #3 HERE})**

---

#### Snippet 4

| Field | Value |
|-------|-------|
| **Name** | `AR - Cash Application Demo Link` |
| **Shortcut** | `ar-cashapp` |
| **Target persona** | Cash Application Specialist, Controller |

**Body:**

Here's a focused walkthrough of Esker's AI-powered cash application. Companies matching remittances manually run at 30-40% straight-through; Esker customers hit 85-95%. Fewer unapplied receipts, faster reconciliation.

**[See Cash Application Automation →]({PASTE MAIL MERGE URL #4 HERE})**

---

#### Snippet 5

| Field | Value |
|-------|-------|
| **Name** | `AR - Credit Management Demo Link` |
| **Shortcut** | `ar-credit` |
| **Target persona** | Credit Manager, Risk Manager |

**Body:**

Put together a demo of Esker's Credit Management module — consolidated credit data, automated scoring, real-time risk visibility across your portfolio. Faster decisions, fewer bad debt write-offs, clear audit trail.

**[Explore Credit Management →]({PASTE MAIL MERGE URL #5 HERE})**

---

#### Snippet 6

| Field | Value |
|-------|-------|
| **Name** | `AR - Claims & Deductions Demo Link` |
| **Shortcut** | `ar-deductions` |
| **Target persona** | AR Manager, Deductions Analyst |

**Body:**

Here's a focused demo of Esker's Claims & Deductions module — centralized root cause coding, workflow routing, and resolution tracking. Clears backlogs faster and prevents invalid deductions from recurring.

**[See Claims & Deductions Management →]({PASTE MAIL MERGE URL #6 HERE})**

---

#### Snippet 7

| Field | Value |
|-------|-------|
| **Name** | `AR - I2C AI Vision - IT Demo Link` |
| **Shortcut** | `ar-i2c-it` |
| **Target persona** | IT Director, CIO, ERP Admin |

**Body:**

Built a technical walkthrough of Esker's I2C AI capabilities — cloud-native, 70+ ERP connectors (SAP, Oracle, NetSuite, Dynamics), 90-day Proof of Value on live production data. No sandbox, no 12-month implementation.

**[Review I2C AI & Integration Architecture →]({PASTE MAIL MERGE URL #7 HERE})**

---

## Persona Selection Guide

When deciding which snippet to use for a prospect, match their job title/role:

```
WHO is the recipient?
|
+-- CFO / VP Finance / Treasurer
|   --> #ar-i2c-cfo
|
+-- Controller / Accounting Director
|   --> #ar-cashapp (if cash app focus) or #ar-i2c-cfo (if strategic)
|
+-- AR Director / AR Manager / Order-to-Cash Lead
|   +-- Broad AR pain (DSO, efficiency)  --> #ar-i2c-ops
|   +-- Collections-specific pain        --> #ar-cim
|   +-- Deductions/claims backlog        --> #ar-deductions
|
+-- Credit Manager / Credit Analyst
|   --> #ar-credit
|
+-- Cash Application Manager / Specialist
|   --> #ar-cashapp
|
+-- IT Director / CIO / ERP Admin
|   --> #ar-i2c-it
|
+-- Unknown role or general AR interest
|   --> #ar-i2c-ops (safest default)
```

---

## URL Tracking Table

Fill this in as you create each mail merge link in Phase A. These URLs are then used in Phase B when creating the HubSpot snippets.

| # | Mail Merge Link Name | Consensus Mail Merge URL |
|---|----------------------|--------------------------|
| 1 | BL - AR - Full I2C Suite - CFO | _(paste URL here)_ |
| 2 | BL - AR - Full I2C Suite - AR Ops | _(paste URL here)_ |
| 3 | BL - AR - Collections & Invoicing | _(paste URL here)_ |
| 4 | BL - AR - Cash Application | _(paste URL here)_ |
| 5 | BL - AR - Credit Management | _(paste URL here)_ |
| 6 | BL - AR - Claims & Deductions | _(paste URL here)_ |
| 7 | BL - AR - I2C AI Vision - IT | _(paste URL here)_ |

---

## Verification Checklist

After completing both phases, verify:

- [ ] All 7 mail merge links created in Consensus and URLs recorded above
- [ ] All 7 snippets created in HubSpot with correct names and shortcuts
- [ ] Hyperlinks in snippets point to the correct Consensus mail merge URLs
- [ ] Personalization tokens (where used) inserted via Personalize dropdown, not typed manually
- [ ] Test: From a HubSpot contact record, compose an email and type `#ar-i2c-ops` — confirm snippet inserts correctly
- [ ] Test: In Gmail with HubSpot extension, use More → Snippets → search for "AR" — confirm snippets appear and insert correctly
- [ ] Test: Click a mail merge link from a sent test email — confirm Consensus demoboard loads with recipient data pre-filled
