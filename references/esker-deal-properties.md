# Esker Deal Property Map

Use the exact property names and enumeration values below when writing to HubSpot. Do NOT query HubSpot's property definitions to discover values — this file is the source of truth for Esker deal CRM writes.

For deal stages, see `references/esker-pipeline.md`.

---

## Deal Properties

### ERP System (`erp_system`)

Type: Enumeration. Use the `value` field (left column) when writing.

| Value | Label |
|-------|-------|
| `Acumatica` | Acumatica |
| `Aderant` | Aderant |
| `Epicor BisTrack` | Epicor BisTrack |
| `Epicor Eclipse` | Epicor Eclipse |
| `Infor LN` | Infor LN |
| `Infor M3` | Infor M3 |
| `Infor SyteLine / Infor CloudSuite Industrial` | Infor SyteLine / CloudSuite Industrial |
| `Macola ERP` | Macola ERP |
| `Microsoft Dynamics GP` | Microsoft Dynamics GP |
| `Microsoft Dynamics 365 Supply Chain Management` | Dynamics 365 SCM |
| `MS Dynamics 365` | MS Dynamics 365 Business Central |
| `Oracle Cloud ERP` | Oracle Cloud ERP |
| `Oracle Financials Cloud` | Oracle Financials Cloud |
| `Oracle Netsuite` | Oracle NetSuite |
| `QuickBooks Desktop` | QuickBooks Desktop |
| `QuickBooks Online` | QuickBooks Online |
| `Sage Intacct` | Sage Intacct |
| `Sage300` | Sage 300 |
| `SageX3` | Sage X3 |
| `SAP Business One` | SAP Business One |
| `SAP ECC` | SAP ECC |
| `SAP S/4HANA` | SAP S/4HANA |
| `SYSPRO` | SYSPRO |
| `Viewpoint Vista` | Viewpoint Vista |
| `Workday` | Workday |
| `Xero` | Xero |

If the prospect's ERP is not in this list, use the closest match or note it in the deal description.

### Esker Modules Offered (`esker_modules_offered`)

Type: Multiple checkboxes. Use semicolon-separated `value` strings when writing multiple.

| Value | Label |
|-------|-------|
| `accounts_payable_automation` | Accounts Payable |
| `accounts_receivable_automation` | Collections |
| `cash_application` | Cash Application |
| `Credit Management` | Credit Management |
| `order_management` | Claims & Deductions |
| `procurement_automation` | Procurement |
| `document_delivery` | Invoice Delivery |
| `expense_management` | Expense Management |
| `supplier_management` | Supplier Management |
| `Contract Management` | Contract Management |

**Mapping from conversation context:**
- AP pain, invoice processing, approvals → `accounts_payable_automation`
- AR pain, collections, past-due, aging → `accounts_receivable_automation`
- Cash application, remittance matching → `cash_application`
- Credit risk, credit limits → `Credit Management`
- Claims, deductions, disputes → `order_management`
- Procurement, purchasing, POs → `procurement_automation`
- Invoice delivery, e-invoicing → `document_delivery`

### Qualification & Narrative Fields

| Property | Type | Description | When to Update |
|----------|------|-------------|----------------|
| `situation_overview` | Text | Current state narrative — what the customer is dealing with | After discovery or any call revealing their situation |
| `business_impact_description` | Text | Quantified business impact of the problem | After needs analysis, when impact is articulated |
| `decision_process` | Text | How they buy — who approves, what steps, what timeline | After discovery reveals buying process |
| `champion_notes` | Text | Champion identity, engagement level, motivations | After any call revealing champion dynamics |
| `key_pain_points` | Text | Top pain points, semicolon-separated | After any call — append, don't overwrite |
| `hs_next_step` | Text | Agreed next step with date and owner | After EVERY call — always update this |
| `description` | Text | Deal description / summary | On deal creation or major milestone |

### ROI / Sizing Fields

| Property | Type | Description |
|----------|------|-------------|
| `roi_average_ar_balance_cad` | Number | Average AR balance (CAD) |
| `roi_current_dso_days` | Number | Current DSO in days |
| `roi_collections_team_size` | Number | FTEs in collections |
| `roi_cash_app_team_size` | Number | FTEs in cash application |
| `roi_surcharging_enabled` | String | Whether company surcharges CC payments (yes/no) |
| `roi_current_unapplied_cash_balance_cad` | Number | Unapplied/unidentified cash balance |

### Volume & Firmographic Fields (on Deal)

| Property | Type | Description |
|----------|------|-------------|
| `current_dso` | Number | Current DSO (days) |
| `ar_payments_per_year` | Number | AR payment transactions per year |
| `ap_invoices_per_year` | Number | AP invoices processed annually |
| `invoices_per_year` | Number | AR invoices per year |
| `ar_credit_customers` | Number | Number of credit customers |

---

## Company Properties

Update these on the company record when new data is learned:

| Property | Type | Description |
|----------|------|-------------|
| `annualrevenue` | Number | Annual revenue |
| `numberofemployees` | Number | Employee count |
| `industry` | Enumeration | HubSpot standard industry values |
| `erp_system` | Text | ERP system (company-level, free text) |
| `ap_invoice_volume_annual` | Number | AP invoice volume (annual) |
| `ar_invoice_volume_annual` | Number | AR invoice volume (annual) |
| `dso_current` | Number | Current DSO |
| `strategic_goals_summary` | Text | Strategic priorities / initiatives |

---

## Contact Properties

Update these when new contact info is learned:

| Property | Type | Description |
|----------|------|-------------|
| `jobtitle` | Text | Job title |
| `phone` | Text | Phone number |
| `firstname` | Text | First name |
| `lastname` | Text | Last name |
| `email` | Text | Email address |

---

## Creating HubSpot Notes

Notes use objectType `notes` with these properties:

```json
{
  "objectType": "notes",
  "properties": {
    "hs_note_body": "<note content — supports HTML>",
    "hs_timestamp": "<ISO 8601 timestamp>"
  },
  "associations": [
    {"targetObjectId": 12345, "targetObjectType": "deals"},
    {"targetObjectId": 67890, "targetObjectType": "companies"},
    {"targetObjectId": 11111, "targetObjectType": "contacts"}
  ]
}
```

Always associate notes with the deal, company, AND all relevant contacts.
