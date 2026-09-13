import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/backend/firebase/admin";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

/**
 * Contact / enquiry submission endpoint.
 *
 * Data flow (per CLAUDE.md rule 5: Firestore is the system of record, the
 * browser never touches `leads` directly — Firestore rules deny all client
 * writes, and this route is the sole writer via the Admin SDK):
 *
 *   validate → spam checks → rate limit → write to Firestore → success
 *
 * Email notification to the INFINI team is intentionally not sent here yet —
 * SMTP dispatch lands with its own ticket (same as the RFQ function), at
 * which point it runs *after* the write, never before. A lead's existence
 * must never depend on mail delivery.
 *
 * Anti-spam, layered (no third-party keys required):
 *   1. Honeypot field (`website`) — bots fill it, humans never see it.
 *       Hits get a fake success so bots can't probe for the filter.
 *   2. Fill-time trap (`startedAt`) — submitted < 2s after render = bot.
 *       Same fake success, same reason.
 *   3. Per-IP sliding-window rate limit (5 / 10 min).
 * Validation failures return 400 with per-field messages for the form to
 * render; nothing internal is ever leaked in an error body.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

const NAME_MAX = 100;
const COMPANY_MAX = 120;
const EMAIL_MAX = 254;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 500;
const MIN_FILL_TIME_MS = 2000;

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "industry" | "message", string>>;

function invalid(message: string, fields: FieldErrors) {
  return NextResponse.json({ error: message, fields }, { status: 400 });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return invalid("That submission could not be read. Please try again.", {});
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const industry = typeof body.industry === "string" ? body.industry.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  // --- Spam layer 1+2: honeypot and fill-time trap. Fake success, always. ---
  const honeypot = typeof body.website === "string" ? body.website : "";
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if (honeypot !== "" || !startedAt || Date.now() - startedAt < MIN_FILL_TIME_MS) {
    return NextResponse.json({ ok: true });
  }

  // --- Validation (mirrors the client, enforced here — client checks are UX). ---
  const fields: FieldErrors = {};
  if (name.length < 2 || name.length > NAME_MAX) fields.name = "Please enter your name.";
  if (!EMAIL_RE.test(email) || email.length > EMAIL_MAX) fields.email = "Enter a valid email address.";
  if (phone !== "" && !PHONE_RE.test(phone)) fields.phone = "Enter a valid phone number.";
  if (industry !== "" && !SLUG_RE.test(industry)) fields.industry = "Please choose an industry from the list.";
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    fields.message = `Your message should be ${MESSAGE_MIN}–${MESSAGE_MAX} characters.`;
  }
  if (company.length > COMPANY_MAX) {
    return invalid("Please check the highlighted fields.", { ...fields });
  }
  if (Object.keys(fields).length > 0) {
    return invalid("Please check the highlighted fields.", fields);
  }

  // --- Spam layer 3: rate limit (after validation, so bots can't burn real users' quota with junk). ---
  if (isRateLimited(`contact:${clientIp(request.headers)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  try {
    await adminDb.collection("leads").add({
      name,
      company: company || null,
      email,
      phone: phone || null,
      industry: industry || null,
      message,
      source: "contact-form",
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    // Logged server-side for ops; the client gets a generic message, never internals.
    console.error("contact API: failed to store lead", error);
    return NextResponse.json(
      { error: "Something went wrong saving your enquiry. Please try again, or reach us directly by phone." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
