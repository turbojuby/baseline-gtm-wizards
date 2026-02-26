/**
 * Utility to detect MCP initialize requests in the Streamable HTTP transport.
 */

/** Check if a parsed JSON body is an MCP initialize request */
export function isInitializeRequest(body: unknown): boolean {
  // Single request
  if (isObject(body) && body.method === "initialize") {
    return true;
  }
  // Batch request — check if any item is initialize
  if (Array.isArray(body)) {
    return body.some((item) => isObject(item) && item.method === "initialize");
  }
  return false;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
