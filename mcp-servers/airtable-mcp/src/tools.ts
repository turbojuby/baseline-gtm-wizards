/**
 * MCP tool definitions and handlers for GTM Wizards Airtable base.
 *
 * Tables:
 *   Deals             — pipeline deals with stage, AE owner, linked company
 *   Companies         — company financial metrics (revenue, DSO, DPO, invoice volume, FTEs, ERP)
 *   Pricing           — AE-configured Esker pricing per deal
 *   Assumptions       — editable ROI assumptions per deal
 *   Calculated Outputs — formula-driven ROI outputs (AP savings, FTEs freed, payback, 3yr ROI, NPV)
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  listRecords,
  getRecord,
  updateRecord,
  searchRecords,
  firstLinkedId,
  AirtableRecord,
} from "./airtable.js";

// ─── Table name constants ────────────────────────────────────────────────────
// These match the actual Airtable table names. If the base uses IDs instead,
// swap these for the IDs from base-config.json once it's available.
const TABLE_DEALS = "Deals";
const TABLE_COMPANIES = "Companies";
const TABLE_PRICING = "Pricing";
const TABLE_ASSUMPTIONS = "Assumptions";
const TABLE_OUTPUTS = "Calculated Outputs";

// ─── Shape helpers ───────────────────────────────────────────────────────────

function shapeDealSummary(r: AirtableRecord) {
  return {
    id: r.id,
    name: r.fields["Name"] ?? r.fields["Deal Name"] ?? "",
    stage: r.fields["Stage"] ?? r.fields["Deal Stage"] ?? "",
    ae_owner: r.fields["AE Owner"] ?? r.fields["Owner"] ?? "",
    company_ids: r.fields["Company"] ?? r.fields["Companies"] ?? [],
    created_time: r.createdTime,
  };
}

function shapeCompany(r: AirtableRecord) {
  return {
    id: r.id,
    name: r.fields["Name"] ?? r.fields["Company Name"] ?? "",
    annual_revenue: r.fields["Annual Revenue"] ?? r.fields["Revenue"] ?? null,
    dso: r.fields["DSO"] ?? r.fields["Days Sales Outstanding"] ?? null,
    dpo: r.fields["DPO"] ?? r.fields["Days Payable Outstanding"] ?? null,
    ar_invoice_volume: r.fields["AR Invoice Volume"] ?? r.fields["Annual AR Invoices"] ?? null,
    ap_invoice_volume: r.fields["AP Invoice Volume"] ?? r.fields["Annual AP Invoices"] ?? null,
    ap_ftes: r.fields["AP FTEs"] ?? r.fields["AP Full-Time Employees"] ?? null,
    ar_ftes: r.fields["AR FTEs"] ?? r.fields["AR Full-Time Employees"] ?? null,
    erp_system: r.fields["ERP System"] ?? r.fields["ERP"] ?? "",
    industry: r.fields["Industry"] ?? "",
    website: r.fields["Website"] ?? "",
    notes: r.fields["Notes"] ?? "",
  };
}

function shapePricing(r: AirtableRecord) {
  return {
    id: r.id,
    deal_ids: r.fields["Deal"] ?? r.fields["Deals"] ?? [],
    saas_annual: r.fields["SaaS Annual"] ?? r.fields["Annual SaaS Fee"] ?? null,
    implementation_fee: r.fields["Implementation Fee"] ?? null,
    discount_pct: r.fields["Discount %"] ?? r.fields["Discount Percentage"] ?? null,
    total_year_1: r.fields["Total Year 1"] ?? null,
    notes: r.fields["Notes"] ?? "",
  };
}

function shapeAssumptions(r: AirtableRecord) {
  return {
    id: r.id,
    deal_ids: r.fields["Deal"] ?? r.fields["Deals"] ?? [],
    fte_fully_loaded_rate: r.fields["FTE Fully Loaded Rate"] ?? r.fields["FTE Rate"] ?? null,
    automation_rate_pct: r.fields["Automation Rate %"] ?? r.fields["Automation %"] ?? null,
    discount_rate_pct: r.fields["Discount Rate %"] ?? r.fields["Discount Rate"] ?? null,
    invoice_processing_cost: r.fields["Invoice Processing Cost"] ?? null,
    dso_improvement_days: r.fields["DSO Improvement (Days)"] ?? null,
    early_payment_discount_rate: r.fields["Early Payment Discount Rate"] ?? null,
    notes: r.fields["Notes"] ?? "",
  };
}

function shapeOutputs(r: AirtableRecord) {
  return {
    id: r.id,
    deal_ids: r.fields["Deal"] ?? r.fields["Deals"] ?? [],
    ap_annual_savings: r.fields["AP Annual Savings"] ?? null,
    ar_annual_savings: r.fields["AR Annual Savings"] ?? null,
    ftes_freed: r.fields["FTEs Freed"] ?? r.fields["FTE Savings"] ?? null,
    payback_months: r.fields["Payback (Months)"] ?? r.fields["Payback Period (Months)"] ?? null,
    three_year_roi_pct: r.fields["3-Year ROI %"] ?? r.fields["3yr ROI"] ?? null,
    npv: r.fields["NPV"] ?? r.fields["Net Present Value"] ?? null,
    total_3yr_savings: r.fields["Total 3-Year Savings"] ?? null,
    total_3yr_cost: r.fields["Total 3-Year Cost"] ?? null,
  };
}

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Find a deal record by name substring or record ID */
async function findDeal(nameOrId: string): Promise<AirtableRecord | null> {
  if (nameOrId.startsWith("rec")) {
    try {
      return await getRecord(TABLE_DEALS, nameOrId);
    } catch {
      return null;
    }
  }
  const results = await searchRecords(TABLE_DEALS, nameOrId, "Name");
  return results[0] ?? null;
}

/** Find a company record by name substring or record ID */
async function findCompany(nameOrId: string): Promise<AirtableRecord | null> {
  if (nameOrId.startsWith("rec")) {
    try {
      return await getRecord(TABLE_COMPANIES, nameOrId);
    } catch {
      return null;
    }
  }
  const results = await searchRecords(TABLE_COMPANIES, nameOrId, "Name");
  return results[0] ?? null;
}

/** Get the linked pricing record for a deal */
async function getPricingForDeal(deal: AirtableRecord): Promise<AirtableRecord | null> {
  // Pricing may be linked from the deal, or we search by deal name
  const linkedId = firstLinkedId(deal.fields["Pricing"]);
  if (linkedId) {
    try { return await getRecord(TABLE_PRICING, linkedId); } catch { /* fall through */ }
  }
  const dealName = String(deal.fields["Name"] ?? deal.fields["Deal Name"] ?? "");
  const results = await searchRecords(TABLE_PRICING, dealName, "Name");
  return results[0] ?? null;
}

/** Get the linked assumptions record for a deal */
async function getAssumptionsForDeal(deal: AirtableRecord): Promise<AirtableRecord | null> {
  const linkedId = firstLinkedId(deal.fields["Assumptions"]);
  if (linkedId) {
    try { return await getRecord(TABLE_ASSUMPTIONS, linkedId); } catch { /* fall through */ }
  }
  const dealName = String(deal.fields["Name"] ?? deal.fields["Deal Name"] ?? "");
  const results = await searchRecords(TABLE_ASSUMPTIONS, dealName, "Name");
  return results[0] ?? null;
}

/** Get the linked calculated outputs record for a deal */
async function getOutputsForDeal(deal: AirtableRecord): Promise<AirtableRecord | null> {
  const linkedId = firstLinkedId(deal.fields["Calculated Outputs"]);
  if (linkedId) {
    try { return await getRecord(TABLE_OUTPUTS, linkedId); } catch { /* fall through */ }
  }
  const dealName = String(deal.fields["Name"] ?? deal.fields["Deal Name"] ?? "");
  const results = await searchRecords(TABLE_OUTPUTS, dealName, "Name");
  return results[0] ?? null;
}

// ─── Tool definitions ────────────────────────────────────────────────────────

export const TOOL_DEFINITIONS: Tool[] = [
  {
    name: "list_deals",
    description:
      "List pipeline deals from the GTM Wizards Airtable base. Optionally filter by stage or AE owner.",
    inputSchema: {
      type: "object",
      properties: {
        stage: {
          type: "string",
          description: "Filter by deal stage (e.g. 'Discovery', 'Proposal', 'Closed Won')",
        },
        ae_owner: {
          type: "string",
          description: "Filter by AE owner name",
        },
      },
    },
  },
  {
    name: "get_deal",
    description:
      "Get a full deal record including linked company data, pricing, assumptions, and calculated ROI outputs. Pass a deal name (partial match OK) or Airtable record ID.",
    inputSchema: {
      type: "object",
      properties: {
        deal_name_or_id: {
          type: "string",
          description: "Deal name (partial match) or Airtable record ID (starts with 'rec')",
        },
      },
      required: ["deal_name_or_id"],
    },
  },
  {
    name: "list_companies",
    description: "List all companies in the GTM Wizards Airtable base with their names and record IDs.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_company",
    description:
      "Get a full company record including financial metrics (revenue, DSO, DPO, invoice volumes, FTEs, ERP system). Pass a company name (partial match OK) or Airtable record ID.",
    inputSchema: {
      type: "object",
      properties: {
        company_name_or_id: {
          type: "string",
          description: "Company name (partial match) or Airtable record ID (starts with 'rec')",
        },
      },
      required: ["company_name_or_id"],
    },
  },
  {
    name: "get_pricing",
    description:
      "Get the pricing configuration for a specific deal — SaaS annual fee, implementation fee, discount %, and total year 1 cost.",
    inputSchema: {
      type: "object",
      properties: {
        deal_name_or_id: {
          type: "string",
          description: "Deal name (partial match) or Airtable record ID",
        },
      },
      required: ["deal_name_or_id"],
    },
  },
  {
    name: "get_assumptions",
    description:
      "Get the editable ROI assumptions for a specific deal — FTE rate, automation %, discount rate, invoice processing cost, DSO improvement days, etc.",
    inputSchema: {
      type: "object",
      properties: {
        deal_name_or_id: {
          type: "string",
          description: "Deal name (partial match) or Airtable record ID",
        },
      },
      required: ["deal_name_or_id"],
    },
  },
  {
    name: "get_calculated_outputs",
    description:
      "Get the formula-driven ROI outputs for a specific deal — AP/AR annual savings, FTEs freed, payback period in months, 3-year ROI %, and NPV.",
    inputSchema: {
      type: "object",
      properties: {
        deal_name_or_id: {
          type: "string",
          description: "Deal name (partial match) or Airtable record ID",
        },
      },
      required: ["deal_name_or_id"],
    },
  },
  {
    name: "update_deal",
    description:
      "Update fields on a deal record — use for updating stage, deck URL, notes, last deck generated date, etc. Pass the Airtable record ID and a fields object.",
    inputSchema: {
      type: "object",
      properties: {
        deal_id: {
          type: "string",
          description: "Airtable record ID for the deal (starts with 'rec')",
        },
        fields: {
          type: "object",
          description:
            "Key-value pairs to update. Example: { \"Stage\": \"Proposal\", \"Deck URL\": \"https://...\", \"Last Deck Generated\": \"2026-02-19\" }",
        },
      },
      required: ["deal_id", "fields"],
    },
  },
  {
    name: "update_pricing",
    description:
      "Update pricing fields for a deal — SaaS annual fee, implementation fee, discount %, etc. Pass the Airtable pricing record ID and a fields object.",
    inputSchema: {
      type: "object",
      properties: {
        pricing_id: {
          type: "string",
          description: "Airtable record ID for the pricing record (starts with 'rec')",
        },
        fields: {
          type: "object",
          description:
            "Key-value pairs to update. Example: { \"SaaS Annual\": 60000, \"Discount %\": 10 }",
        },
      },
      required: ["pricing_id", "fields"],
    },
  },
  {
    name: "search_records",
    description:
      "Search any table in the GTM Wizards base by text query against the Name field. Returns matching records. Use for discovery or when you don't know the exact name.",
    inputSchema: {
      type: "object",
      properties: {
        table_name: {
          type: "string",
          enum: ["Deals", "Companies", "Pricing", "Assumptions", "Calculated Outputs"],
          description: "The Airtable table to search",
        },
        query: {
          type: "string",
          description: "Search text — matched against the Name field (case-insensitive, partial match)",
        },
      },
      required: ["table_name", "query"],
    },
  },
];

// ─── Tool handlers ───────────────────────────────────────────────────────────

type ToolInput = Record<string, unknown>;

export async function handleTool(
  name: string,
  input: ToolInput
): Promise<unknown> {
  switch (name) {
    case "list_deals": {
      const { stage, ae_owner } = input as { stage?: string; ae_owner?: string };
      const formulas: string[] = [];
      if (stage) formulas.push(`SEARCH(LOWER("${stage.replace(/'/g, "\\'")}"), LOWER({Stage}))`);
      if (ae_owner) formulas.push(`SEARCH(LOWER("${ae_owner.replace(/'/g, "\\'")}"), LOWER({AE Owner}))`);
      const formula = formulas.length > 1
        ? `AND(${formulas.join(", ")})`
        : formulas[0];
      const records = await listRecords(TABLE_DEALS, {
        filterByFormula: formula,
        sort: [{ field: "Name", direction: "asc" }],
      });
      return records.map(shapeDealSummary);
    }

    case "get_deal": {
      const { deal_name_or_id } = input as { deal_name_or_id: string };
      const deal = await findDeal(deal_name_or_id);
      if (!deal) return { error: `No deal found matching: ${deal_name_or_id}` };

      // Resolve linked company
      const companyId = firstLinkedId(deal.fields["Company"] ?? deal.fields["Companies"]);
      let company = null;
      if (companyId) {
        try {
          const rec = await getRecord(TABLE_COMPANIES, companyId);
          company = shapeCompany(rec);
        } catch { /* company not found */ }
      }

      const [pricingRec, assumptionsRec, outputsRec] = await Promise.all([
        getPricingForDeal(deal),
        getAssumptionsForDeal(deal),
        getOutputsForDeal(deal),
      ]);

      return {
        ...shapeDealSummary(deal),
        company,
        pricing: pricingRec ? shapePricing(pricingRec) : null,
        assumptions: assumptionsRec ? shapeAssumptions(assumptionsRec) : null,
        calculated_outputs: outputsRec ? shapeOutputs(outputsRec) : null,
      };
    }

    case "list_companies": {
      const records = await listRecords(TABLE_COMPANIES, {
        fields: ["Name"],
        sort: [{ field: "Name", direction: "asc" }],
      });
      return records.map((r) => ({ id: r.id, name: r.fields["Name"] ?? "" }));
    }

    case "get_company": {
      const { company_name_or_id } = input as { company_name_or_id: string };
      const company = await findCompany(company_name_or_id);
      if (!company) return { error: `No company found matching: ${company_name_or_id}` };
      return shapeCompany(company);
    }

    case "get_pricing": {
      const { deal_name_or_id } = input as { deal_name_or_id: string };
      const deal = await findDeal(deal_name_or_id);
      if (!deal) return { error: `No deal found matching: ${deal_name_or_id}` };
      const pricing = await getPricingForDeal(deal);
      if (!pricing) return { error: `No pricing record found for deal: ${deal_name_or_id}` };
      return shapePricing(pricing);
    }

    case "get_assumptions": {
      const { deal_name_or_id } = input as { deal_name_or_id: string };
      const deal = await findDeal(deal_name_or_id);
      if (!deal) return { error: `No deal found matching: ${deal_name_or_id}` };
      const assumptions = await getAssumptionsForDeal(deal);
      if (!assumptions) return { error: `No assumptions record found for deal: ${deal_name_or_id}` };
      return shapeAssumptions(assumptions);
    }

    case "get_calculated_outputs": {
      const { deal_name_or_id } = input as { deal_name_or_id: string };
      const deal = await findDeal(deal_name_or_id);
      if (!deal) return { error: `No deal found matching: ${deal_name_or_id}` };
      const outputs = await getOutputsForDeal(deal);
      if (!outputs) return { error: `No calculated outputs found for deal: ${deal_name_or_id}` };
      return shapeOutputs(outputs);
    }

    case "update_deal": {
      const { deal_id, fields } = input as { deal_id: string; fields: Record<string, unknown> };
      if (!deal_id.startsWith("rec")) {
        return { error: "deal_id must be an Airtable record ID starting with 'rec'. Use list_deals or get_deal to find the ID first." };
      }
      const updated = await updateRecord(TABLE_DEALS, deal_id, fields);
      return { success: true, updated: shapeDealSummary(updated) };
    }

    case "update_pricing": {
      const { pricing_id, fields } = input as { pricing_id: string; fields: Record<string, unknown> };
      if (!pricing_id.startsWith("rec")) {
        return { error: "pricing_id must be an Airtable record ID starting with 'rec'. Use get_pricing to find the ID first." };
      }
      const updated = await updateRecord(TABLE_PRICING, pricing_id, fields);
      return { success: true, updated: shapePricing(updated) };
    }

    case "search_records": {
      const { table_name, query } = input as { table_name: string; query: string };
      const records = await searchRecords(table_name, query, "Name");
      return records.map((r) => ({
        id: r.id,
        name: r.fields["Name"] ?? "",
        fields: r.fields,
      }));
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
