import "server-only";

import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

/**
 * Called by the admin dashboard (a separate deployment) after every content
 * write. Marks the whole public tree stale so the edit is live on the next
 * request instead of after the 10-minute ISR window. Content shows up on many
 * routes (industry names feed the nav, ticker and forms; settings feed every
 * footer), so per-path bookkeeping isn't worth the drift risk on a site this size.
 *
 * Signed webhook: the dashboard sends
 *   X-Infini-Timestamp: <unix ms>
 *   X-Infini-Signature: hex HMAC-SHA256(REVALIDATE_SECRET, "<timestamp>.<raw body>")
 * Requests older than 5 minutes are refused, so a captured call can't be
 * replayed later. Without a 32+ character secret configured, the endpoint is off.
 */
const MAX_SKEW_MS = 5 * 60 * 1000;

function verify(secret: string, timestamp: string, body: string, signature: string): boolean {
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_SKEW_MS) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${body}`).digest();
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

export async function POST(request: NextRequest) {
  if (isRateLimited(`revalidate:${clientIp(request.headers)}`, 120, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const secret = process.env.REVALIDATE_SECRET;
  const body = await request.text();
  if (
    !secret ||
    secret.length < 32 ||
    !verify(secret, request.headers.get("x-infini-timestamp") ?? "", body, request.headers.get("x-infini-signature") ?? "")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
