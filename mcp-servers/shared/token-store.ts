/**
 * Per-user token storage using Google Cloud Firestore.
 *
 * Stores OAuth tokens per user per service so each user gets
 * their own credentials instead of sharing a single static token.
 *
 * On Cloud Run, uses default service account credentials automatically.
 * Locally, uses GOOGLE_APPLICATION_CREDENTIALS or `gcloud auth application-default login`.
 *
 * Firestore structure:
 *   mcp-user-tokens/{email}/services/{service} → TokenData
 */

import { Firestore } from "@google-cloud/firestore";

const db = new Firestore();
const COLLECTION = "mcp-user-tokens";

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;   // Unix timestamp (seconds)
  updatedAt: number;   // Unix timestamp (ms)
}

/**
 * Retrieve stored tokens for a user + service combination.
 */
export async function getToken(
  email: string,
  service: "fathom" | "google-chat"
): Promise<TokenData | null> {
  try {
    const doc = await db
      .collection(COLLECTION)
      .doc(email)
      .collection("services")
      .doc(service)
      .get();
    if (!doc.exists) return null;
    return doc.data() as TokenData;
  } catch (err) {
    console.error(`[TokenStore] Failed to get token for ${email}/${service}:`, err);
    return null;
  }
}

/**
 * Store (or overwrite) tokens for a user + service combination.
 */
export async function saveToken(
  email: string,
  service: string,
  tokens: Partial<TokenData> & { accessToken: string }
): Promise<void> {
  await db
    .collection(COLLECTION)
    .doc(email)
    .collection("services")
    .doc(service)
    .set(
      {
        ...tokens,
        updatedAt: Date.now(),
      },
      { merge: true }
    );
  console.log(`[TokenStore] Saved ${service} token for ${email}`);
}

/**
 * Delete tokens for a user + service combination.
 */
export async function deleteToken(
  email: string,
  service: string
): Promise<void> {
  await db
    .collection(COLLECTION)
    .doc(email)
    .collection("services")
    .doc(service)
    .delete();
  console.log(`[TokenStore] Deleted ${service} token for ${email}`);
}
