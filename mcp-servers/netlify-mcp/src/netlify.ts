/**
 * Netlify REST API client (fetch-based, no CLI)
 *
 * Handles:
 * - Authentication via NETLIFY_TOKEN env var
 * - File-based deploys with SHA1 content addressing
 * - Existing file preservation for hub site
 * - Deploy polling until state=ready
 */

import crypto from "crypto";

const NETLIFY_API_BASE = "https://api.netlify.com/api/v1";

// Hardcoded site IDs
export const SITE_HUB = "f5700f38-35d8-4b71-8d11-615d96717291";
export const SITE_DRAFT = "1554d55b-7194-4f8a-be8c-8ad77e26c3a9";

interface NetlifyFile {
  path: string;
  sha: string;
}

interface NetlifyDeploy {
  id: string;
  state: string;
  url: string;
  ssl_url: string;
  deploy_url: string;
  deploy_ssl_url: string;
  required: string[];
  error_message?: string;
}

function getToken(): string {
  const token = process.env.NETLIFY_TOKEN;
  if (!token) throw new Error("NETLIFY_TOKEN environment variable is not set");
  return token;
}

export function sha1(content: string): string {
  return crypto.createHash("sha1").update(content).digest("hex");
}

async function netlifyFetch<T>(
  method: string,
  path: string,
  body?: unknown,
  isRawFile = false
): Promise<T> {
  const token = getToken();
  const url = `${NETLIFY_API_BASE}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let bodyContent: string | Buffer | undefined;
  if (isRawFile && typeof body === "string") {
    headers["Content-Type"] = "application/octet-stream";
    bodyContent = Buffer.from(body, "utf8");
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    bodyContent = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers, body: bodyContent });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Netlify API error ${res.status} ${method} ${path}: ${text}`
    );
  }

  return res.json() as Promise<T>;
}

/** Get all files currently deployed on a site (path + sha) */
async function getSiteFiles(siteId: string): Promise<NetlifyFile[]> {
  try {
    return await netlifyFetch<NetlifyFile[]>("GET", `/sites/${siteId}/files`);
  } catch {
    // Site may have no deploys yet
    return [];
  }
}

/** Create a deploy with a file SHA manifest */
async function createDeploy(
  siteId: string,
  files: Record<string, string>
): Promise<NetlifyDeploy> {
  return netlifyFetch<NetlifyDeploy>("POST", `/sites/${siteId}/deploys`, {
    files,
  });
}

/** Upload a single file's raw content to a deploy */
async function uploadFile(
  deployId: string,
  filePath: string,
  content: string
): Promise<void> {
  // Path in the URL must not start with /
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  await netlifyFetch<unknown>(
    "PUT",
    `/deploys/${deployId}/files/${cleanPath}`,
    content,
    true
  );
}

/** Poll deploy until state=ready or state=error */
async function waitForDeploy(
  deployId: string,
  maxAttempts = 30
): Promise<NetlifyDeploy> {
  for (let i = 0; i < maxAttempts; i++) {
    const deploy = await netlifyFetch<NetlifyDeploy>(
      "GET",
      `/deploys/${deployId}`
    );
    if (deploy.state === "ready") return deploy;
    if (deploy.state === "error") {
      throw new Error(
        `Deploy ${deployId} failed: ${deploy.error_message ?? "unknown error"}`
      );
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(
    `Deploy ${deployId} did not become ready within ${maxAttempts * 2}s`
  );
}

/**
 * Deploy HTML to hub.baselinepayments.com/d/{hex}
 *
 * Fetches existing site files to preserve all other /d/ paths.
 * Only uploads the new file (Netlify skips files it already has by SHA).
 */
export async function deployToHub(
  htmlContent: string,
  description: string
): Promise<{ url: string; deploy_id: string; path_id: string }> {
  void description; // captured in deploy message via Netlify UI

  const pathId = crypto.randomBytes(8).toString("hex");
  const newFilePath = `/d/${pathId}/index.html`;
  const newFileSha = sha1(htmlContent);

  // Fetch existing files to preserve them in this atomic deploy
  const existingFiles = await getSiteFiles(SITE_HUB);

  // Build the full file manifest: all existing + the new file
  const files: Record<string, string> = {};
  for (const f of existingFiles) {
    files[f.path] = f.sha;
  }
  files[newFilePath] = newFileSha;

  // Create the deploy
  const deploy = await createDeploy(SITE_HUB, files);

  // Upload only the files Netlify doesn't already have
  const required = new Set(deploy.required ?? []);
  if (required.has(newFileSha)) {
    await uploadFile(deploy.id, newFilePath, htmlContent);
  }

  // Wait for the deploy to go live
  await waitForDeploy(deploy.id);

  return {
    url: `https://hub.baselinepayments.com/d/${pathId}`,
    deploy_id: deploy.id,
    path_id: pathId,
  };
}

/**
 * Deploy HTML as a draft to the quick-share Netlify site.
 *
 * No file preservation — each deploy is a fresh flat index.html.
 * Returns the deploy-specific hash URL (not the site's production URL).
 */
export async function deployDraft(
  htmlContent: string,
  description: string
): Promise<{ url: string; deploy_id: string }> {
  void description;

  const newFileSha = sha1(htmlContent);
  const files: Record<string, string> = { "/index.html": newFileSha };

  const deploy = await createDeploy(SITE_DRAFT, files);

  const required = new Set(deploy.required ?? []);
  if (required.has(newFileSha)) {
    await uploadFile(deploy.id, "/index.html", htmlContent);
  }

  const readyDeploy = await waitForDeploy(deploy.id);

  return {
    url: readyDeploy.deploy_ssl_url,
    deploy_id: deploy.id,
  };
}
