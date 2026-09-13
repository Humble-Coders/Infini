/**
 * Minimal in-memory sliding-window rate limiter for API routes.
 *
 * Best-effort by design: each server instance keeps its own buckets, so on a
 * multi-instance deploy (Firebase App Hosting autoscale) a client can get
 * `limit` requests per instance, not globally. That is acceptable for a
 * contact form — the goal is to blunt spam bursts and accidental double
 * submits, not to meter billing. If strict global limits are ever needed,
 * back these buckets with Firestore or Redis instead; the call signature is
 * deliberately narrow so that swap touches one file.
 *
 * Buckets are pruned opportunistically to bound memory.
 */

const buckets = new Map<string, number[]>();
const MAX_BUCKETS = 5000;

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
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
