/**
 * Airtable REST API client (fetch-based, no Airtable JS SDK)
 *
 * Handles:
 * - Authentication via AIRTABLE_PAT env var
 * - 429 rate-limit retries with exponential backoff
 * - Pagination (follows Airtable offset tokens)
 * - Clean field extraction (strips Airtable wrapper noise)
 */

const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

export interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

function getToken(): string {
  const pat = process.env.AIRTABLE_PAT;
  if (!pat) throw new Error("AIRTABLE_PAT environment variable is not set");
  return pat;
}

function getBaseId(): string {
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!baseId) throw new Error("AIRTABLE_BASE_ID environment variable is not set");
  return baseId;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  attempt = 0
): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get("Retry-After") ?? "5", 10);
    const delay = Math.max(retryAfter * 1000, 1000) * Math.pow(2, attempt);
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, attempt + 1);
    }
    throw new Error("Airtable rate limit exceeded after retries");
  }

  return res;
}

async function airtableRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();
  const url = `${AIRTABLE_API_BASE}/${path}`;

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetchWithRetry(url, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Airtable API error ${res.status}: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

/** List all records from a table, handling pagination automatically */
export async function listRecords(
  tableIdOrName: string,
  params: {
    filterByFormula?: string;
    fields?: string[];
    maxRecords?: number;
    sort?: Array<{ field: string; direction?: "asc" | "desc" }>;
  } = {}
): Promise<AirtableRecord[]> {
  const baseId = getBaseId();
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const query = new URLSearchParams();
    if (params.filterByFormula) query.set("filterByFormula", params.filterByFormula);
    if (params.fields) {
      params.fields.forEach((f) => query.append("fields[]", f));
    }
    if (params.maxRecords) query.set("maxRecords", String(params.maxRecords));
    if (offset) query.set("offset", offset);
    if (params.sort) {
      params.sort.forEach((s, i) => {
        query.set(`sort[${i}][field]`, s.field);
        if (s.direction) query.set(`sort[${i}][direction]`, s.direction);
      });
    }

    const qs = query.toString();
    const path = `${baseId}/${encodeURIComponent(tableIdOrName)}${qs ? `?${qs}` : ""}`;
    const page = await airtableRequest<AirtableListResponse>("GET", path);

    allRecords.push(...page.records);
    offset = page.offset;

    if (params.maxRecords && allRecords.length >= params.maxRecords) break;
  } while (offset);

  return allRecords;
}

/** Fetch a single record by ID */
export async function getRecord(
  tableIdOrName: string,
  recordId: string
): Promise<AirtableRecord> {
  const baseId = getBaseId();
  const path = `${baseId}/${encodeURIComponent(tableIdOrName)}/${recordId}`;
  return airtableRequest<AirtableRecord>("GET", path);
}

/** Update a record's fields */
export async function updateRecord(
  tableIdOrName: string,
  recordId: string,
  fields: Record<string, unknown>
): Promise<AirtableRecord> {
  const baseId = getBaseId();
  const path = `${baseId}/${encodeURIComponent(tableIdOrName)}/${recordId}`;
  return airtableRequest<AirtableRecord>("PATCH", path, { fields });
}

/** Search records in a table by matching a text field against a query string */
export async function searchRecords(
  tableIdOrName: string,
  query: string,
  searchField = "Name"
): Promise<AirtableRecord[]> {
  // Escape single quotes in query for Airtable formula
  const escaped = query.replace(/'/g, "\\'");
  const formula = `SEARCH(LOWER("${escaped}"), LOWER({${searchField}}))`;
  return listRecords(tableIdOrName, { filterByFormula: formula });
}

/** Resolve a record ID from a linked-record field (returns first ID or null) */
export function firstLinkedId(field: unknown): string | null {
  if (Array.isArray(field) && field.length > 0 && typeof field[0] === "string") {
    return field[0];
  }
  return null;
}

/** Safely coerce an Airtable field to a string */
export function fieldStr(fields: Record<string, unknown>, key: string): string {
  const v = fields[key];
  if (v === undefined || v === null) return "";
  return String(v);
}

/** Safely coerce an Airtable field to a number */
export function fieldNum(fields: Record<string, unknown>, key: string): number | null {
  const v = fields[key];
  if (v === undefined || v === null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}
