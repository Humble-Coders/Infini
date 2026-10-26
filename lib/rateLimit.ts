/**
 * Rate limiting for API routes, in two layers.
 *
 * `isRateLimited` is an in-memory sliding window: free, instant, but per
 * server instance, so on an autoscaled deploy a client gets `limit` requests
 * per instance. It blunts bursts and double submits.
 *
 * `isRateLimitedShared` is the real limit for anything worth attacking
 * (sign-in, password reset, the contact form): a fixed-window counter in
 * Firestore (`rateLimits`, server-only, denied to clients by the rules), so
 * every instance counts against the same bucket. Call the in-memory check
 * first so bursts never reach Firestore.
 *
 * Buckets are pruned opportunistically to bound memory.
 */

import "server-only";

import crypto from "crypto";

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 5000;

/**
 * The caller's IP. Vercel sets x-vercel-forwarded-for / x-real-ip itself and
 * overwrites anything the client sent, so those are trusted first. A raw
 * x-forwarded-for is only a fallback: its first entry can be client-supplied.
 */
export function clientIp(headers: Headers): string {
  const platform = headers.get("x-vercel-forwarded-for") || headers.get("x-real-ip");
  if (platform) return platform.split(",")[0].trim();
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return "unknown";
}

/** Returns true when the key has exhausted `limit` hits inside `windowMs`. */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const fresh = (buckets.get(key) ?? []).filter((hit) => now - hit < windowMs);

  if (fresh.length >= limit) {
    buckets.set(key, fresh);
    return true;
  }

  fresh.push(now);
  buckets.set(key, fresh);

  if (buckets.size > MAX_BUCKETS) {
    const cutoff = now - windowMs;
    for (const [bucketKey, hits] of buckets) {
      const live = hits.filter((hit) => hit > cutoff);
      if (live.length === 0) buckets.delete(bucketKey);
      else buckets.set(bucketKey, live);
      if (buckets.size <= MAX_BUCKETS) break;
    }
  }

  return false;
}

/**
 * Shared limit across all instances. Fails open if Firestore is unreachable
 * (the in-memory layer still applies), so an outage never locks everyone out.
 */
export async function isRateLimitedShared(key: string, limit: number, windowMs: number): Promise<boolean> {
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const { Timestamp } = await import("firebase-admin/firestore");
    const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
    // Hashed so raw IPs and emails are never stored as document ids.
    const id = crypto.createHash("sha256").update(`${key}:${windowStart}`).digest("hex");
    const ref = adminDb.collection("rateLimits").doc(id);

    return await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const count = (snap.exists ? Number(snap.get("count")) : 0) || 0;
      if (count >= limit) return true;
      tx.set(ref, {
        count: count + 1,
        // Lets a Firestore TTL policy on `expiresAt` clean old windows up.
        expiresAt: Timestamp.fromMillis(windowStart + windowMs * 2),
      });
      return false;
    });
  } catch (error) {
    console.warn("[rateLimit] shared limiter unavailable:", (error as Error)?.message);
    return false;
  }
}
