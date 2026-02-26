/**
 * Firebase Hosting REST API client (fetch-based, no CLI)
 *
 * Handles:
 * - Authentication via Google Application Default Credentials
 * - Gzip + SHA256 content addressing (Firebase's format)
 * - Existing file preservation for hub site
 * - Preview channels for draft deploys (7-day TTL)
 *
 * Deploy flow (5 steps):
 *   1. Fetch existing files from latest release for path preservation
 *   2. Create a new version with config
 *   3. Populate files (send manifest, get upload URL + required hashes)
 *   4. Upload gzipped content for each required hash
 *   5a. Finalize version (PATCH status=FINALIZED)
 *   5b. Create release (production) or channel deploy (draft)
 */

import crypto from "crypto";
import { gzip } from "zlib";
import { promisify } from "util";
import { GoogleAuth } from "google-auth-library";

const gzipAsync = promisify(gzip);

const HOSTING_API = "https://firebasehosting.googleapis.com/v1beta1";
const PROJECT_ID = "baseline-pages-hub";
const SITE_ID = "baseline-pages-hub";

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/firebase"],
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token = tokenResponse.token;
  if (!token) throw new Error("Failed to get access token from Google ADC");
  return token;
}

async function firebaseFetch<T>(
  method: string,
  url: string,
  body?: unknown,
  contentType = "application/json"
): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let bodyContent: string | Buffer | undefined;
  if (body instanceof Buffer) {
    headers["Content-Type"] = contentType;
    bodyContent = body;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    bodyContent = JSON.stringify(body);
  }

  const res = await fetch(url, { method, headers, body: bodyContent });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Firebase API error ${res.status} ${method} ${url}: ${text}`
    );
  }

  const text = await res.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

/** Gzip content and return SHA256 of the gzipped bytes */
async function gzipAndHash(content: string): Promise<{ gzipped: Buffer; hash: string }> {
  const gzipped = await gzipAsync(Buffer.from(content, "utf8"));
  const hash = crypto.createHash("sha256").update(gzipped).digest("hex");
  return { gzipped, hash };
}

// ─── Firebase Hosting API types ──────────────────────────────────────────────

interface VersionFile {
  path: string;
  hash: string;
  status: string;
}

interface Version {
  name: string;
  status: string;
  config?: {
    cleanUrls?: boolean;
  };
}

interface PopulateFilesResponse {
  uploadRequiredHashes?: string[];
  uploadUrl?: string;
}

interface Release {
  name: string;
  version: {
    name: string;
    status: string;
  };
}

interface ListReleasesResponse {
  releases?: Release[];
}

interface ListFilesResponse {
  files?: VersionFile[];
  nextPageToken?: string;
}

// ─── Core deploy steps ──────────────────────────────────────────────────────

/** Step 1: Get all files from the latest live release */
async function getExistingFiles(): Promise<Map<string, string>> {
  const fileMap = new Map<string, string>();

  try {
    const releases = await firebaseFetch<ListReleasesResponse>(
      "GET",
      `${HOSTING_API}/sites/${SITE_ID}/releases?pageSize=1`
    );

    if (!releases.releases || releases.releases.length === 0) {
      return fileMap;
    }

    const latestVersionName = releases.releases[0].version.name;

    let pageToken: string | undefined;
    do {
      const query = pageToken ? `?pageToken=${pageToken}` : "";
      const filesResponse = await firebaseFetch<ListFilesResponse>(
        "GET",
        `${HOSTING_API}/${latestVersionName}/files${query}`
      );

      if (filesResponse.files) {
        for (const f of filesResponse.files) {
          fileMap.set(f.path, f.hash);
        }
      }
      pageToken = filesResponse.nextPageToken;
    } while (pageToken);
  } catch {
    // No releases yet — fresh site
  }

  return fileMap;
}

/** Step 2: Create a new version */
async function createVersion(): Promise<string> {
  const version = await firebaseFetch<Version>(
    "POST",
    `${HOSTING_API}/sites/${SITE_ID}/versions`,
    {
      config: {
        cleanUrls: true,
      },
    }
  );
  return version.name;
}

/** Step 3: Populate files — send manifest, get upload URL + required hashes */
async function populateFiles(
  versionName: string,
  fileManifest: Record<string, string>
): Promise<PopulateFilesResponse> {
  return firebaseFetch<PopulateFilesResponse>(
    "POST",
    `${HOSTING_API}/${versionName}:populateFiles`,
    { files: fileManifest }
  );
}

/** Step 4: Upload a single gzipped file by hash */
async function uploadFile(
  uploadUrl: string,
  hash: string,
  gzippedContent: Buffer
): Promise<void> {
  await firebaseFetch<unknown>(
    "POST",
    `${uploadUrl}/${hash}`,
    gzippedContent,
    "application/octet-stream"
  );
}

/** Step 5a: Finalize the version */
async function finalizeVersion(versionName: string): Promise<void> {
  await firebaseFetch<Version>(
    "PATCH",
    `${HOSTING_API}/${versionName}?updateMask=status`,
    { status: "FINALIZED" }
  );
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Deploy HTML to hub.baselinepayments.com/d/{hex}
 *
 * Fetches existing site files to preserve all other /d/ paths.
 * Only uploads the new file (Firebase skips files it already has by hash).
 */
export async function deployToHub(
  htmlContent: string,
  description: string
): Promise<{ url: string; version_id: string; path_id: string }> {
  const pathId = crypto.randomBytes(8).toString("hex");
  const newFilePath = `/d/${pathId}/index.html`;

  // Gzip + hash the new file
  const { gzipped, hash: newFileHash } = await gzipAndHash(htmlContent);

  // Step 1: Fetch existing files to preserve them
  const existingFiles = await getExistingFiles();

  // Build the full file manifest: all existing + the new file
  const fileManifest: Record<string, string> = {};
  for (const [path, hash] of existingFiles) {
    fileManifest[path] = hash;
  }
  fileManifest[newFilePath] = newFileHash;

  // Step 2: Create a new version
  const versionName = await createVersion();

  // Step 3: Populate files — Firebase tells us which hashes it needs
  const populateResult = await populateFiles(versionName, fileManifest);

  // Step 4: Upload required files
  const requiredHashes = new Set(populateResult.uploadRequiredHashes ?? []);
  if (requiredHashes.has(newFileHash) && populateResult.uploadUrl) {
    await uploadFile(populateResult.uploadUrl, newFileHash, gzipped);
  }

  // Step 5a: Finalize
  await finalizeVersion(versionName);

  // Step 5b: Create release (deploy to production)
  // The release API needs the version ID in the query param
  const versionId = versionName.split("/").pop()!;
  await firebaseFetch<Release>(
    "POST",
    `${HOSTING_API}/sites/${SITE_ID}/releases?versionName=${versionName}`,
    { message: description || "MCP deploy" }
  );

  return {
    url: `https://hub.baselinepayments.com/d/${pathId}`,
    version_id: versionId,
    path_id: pathId,
  };
}

/**
 * Deploy HTML as a draft via Firebase preview channel.
 *
 * Creates a preview channel with 7-day TTL. No file preservation needed —
 * each draft is a standalone page.
 */
export async function deployDraft(
  htmlContent: string,
  description: string
): Promise<{ url: string; version_id: string }> {
  const channelId = `draft-${crypto.randomBytes(4).toString("hex")}`;

  // Gzip + hash
  const { gzipped, hash: fileHash } = await gzipAndHash(htmlContent);

  // Step 2: Create a new version
  const versionName = await createVersion();

  // Step 3: Populate files
  const fileManifest: Record<string, string> = {
    "/index.html": fileHash,
  };
  const populateResult = await populateFiles(versionName, fileManifest);

  // Step 4: Upload
  const requiredHashes = new Set(populateResult.uploadRequiredHashes ?? []);
  if (requiredHashes.has(fileHash) && populateResult.uploadUrl) {
    await uploadFile(populateResult.uploadUrl, fileHash, gzipped);
  }

  // Step 5a: Finalize
  await finalizeVersion(versionName);

  // Step 5b: Create preview channel with 7-day TTL
  interface ChannelResponse {
    name: string;
    url: string;
    release?: {
      version: { name: string };
    };
  }

  // Create or update the channel with the finalized version
  const channel = await firebaseFetch<ChannelResponse>(
    "POST",
    `${HOSTING_API}/sites/${SITE_ID}/channels/${channelId}:deploy`,
    undefined
  );

  // If the channel deploy didn't use our version, release to it explicitly
  // The channels:deploy with no body creates a channel — we need to release our version to it
  const releaseUrl = `${HOSTING_API}/sites/${SITE_ID}/channels/${channelId}/releases?versionName=${versionName}`;
  await firebaseFetch<Release>("POST", releaseUrl, {
    message: description || "MCP draft deploy",
  });

  const versionId = versionName.split("/").pop()!;
  const previewUrl = `https://${SITE_ID}--${channelId}-${PROJECT_ID}.web.app`;

  return {
    url: previewUrl,
    version_id: versionId,
  };
}
