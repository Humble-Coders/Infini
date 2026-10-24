import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb, adminStorage } from "@/backend/firebase/admin";
import { clientIp, isRateLimited } from "@/lib/rateLimit";
import { sendLeadNotification } from "@/lib/leadNotification";
import * as crypto from "crypto";

// Under the ~4.5 MB serverless request-body ceiling (Vercel), with room for the form fields.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

function isValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }
  // WebP: RIFF ... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return true;
  }
  return false;
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    const secFetchSite = request.headers.get("sec-fetch-site");
    if (secFetchSite && secFetchSite === "cross-site") {
      return false;
    }
    return true;
  }
  const host = request.headers.get("host");
  try {
    const originUrl = new URL(origin);
    if (host && originUrl.host === host) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Contact / enquiry submission endpoint.
 *
 * Data flow (per CLAUDE.md rule 5: Firestore is the system of record, the
 * browser never touches `leads` directly — Firestore rules deny all client
 * writes, and this route is the sole writer via the Admin SDK):
 *
 *   validate → spam checks → rate limit → store attachment → write to
 *   Firestore → email the team → success
 *
 * The notification email runs strictly *after* the write and its outcome is
 * recorded on the lead (`notification`), so a lead's existence never depends
 * on mail delivery and a failing SMTP setup shows up in the admin dashboard.
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
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  // --- CSRF Layer: Validate origin/fetch-site to block cross-site request forgery ---
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  let body: Record<string, unknown> = {};
  let imageFile: File | null = null;
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      body.name = formData.get("name") || "";
      body.company = formData.get("company") || "";
      body.email = formData.get("email") || "";
      body.phone = formData.get("phone") || "";
      body.industry = formData.get("industry") || "";
      body.message = formData.get("message") || "";
      body.website = formData.get("website") || "";
      body.startedAt = Number(formData.get("startedAt")) || 0;
      body.submissionId = formData.get("submissionId") || "";
      imageFile = formData.get("image") as File | null;
    } else {
      body = await request.json();
    }
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

  let imageUrl: string | null = null;
  let attachmentFailed = false;
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return invalid("The uploaded image exceeds the 4 MB size limit.", { message: "Uploaded image must be under 4 MB." });
    }

    const mimeType = (imageFile.type || "").toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return invalid("Invalid file type. Only JPEG, PNG, and WebP images are accepted.", { message: "Only JPG, PNG, and WebP images are allowed." });
    }

    const ext = ALLOWED_EXTENSIONS.get(mimeType) || "jpg";
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await imageFile.arrayBuffer());
    } catch {
      return invalid("Unable to read uploaded image.", { message: "Could not read file." });
    }

    if (!isValidImageMagicBytes(buffer)) {
      return invalid("The uploaded file does not match a valid image format.", { message: "Corrupted or invalid image file." });
    }

    // Firebase Storage, not the server's disk: serverless deployments have a
    // read-only filesystem and nothing written at runtime is ever served.
    // The download token makes the URL unguessable; leads/ has no public rule.
    try {
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      if (!bucketName) throw new Error("Storage bucket not configured");
      const bucket = adminStorage.bucket(bucketName);
      const token = crypto.randomUUID();
      const objectPath = `leads/${new Date().toISOString().slice(0, 7)}/lead-${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
      await bucket.file(objectPath).save(buffer, {
        resumable: false,
        contentType: mimeType,
        metadata: { metadata: { firebaseStorageDownloadTokens: token } },
      });
      const emulator = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
      const origin = emulator ? `http://${emulator}` : "https://firebasestorage.googleapis.com";
      imageUrl = `${origin}/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
    } catch (e) {
      // The enquiry still goes through; the attachment failure is noted on the lead.
      console.error("contact API: failed to store attachment", (e as Error)?.message);
      attachmentFailed = true;
    }
  }

  // Idempotency: the form sends one UUID per filled-in form, used as the
  // document ID with create(), so a duplicate submit can't make a second lead.
  const submissionId = typeof body.submissionId === "string" && UUID_RE.test(body.submissionId) ? body.submissionId : null;
  const leadRef = submissionId ? adminDb.collection("leads").doc(`web-${submissionId}`) : adminDb.collection("leads").doc();
  const leadId = leadRef.id;
  try {
    await leadRef.create({
      name,
      company: company || null,
      email,
      phone: phone || null,
      industry: industry || null,
      message,
      imageUrl,
      ...(attachmentFailed ? { attachmentFailed: true } : {}),
      source: "contact-form",
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if ((error as { code?: number }).code === 6) {
      // ALREADY_EXISTS: this exact submission was saved a moment ago.
      return NextResponse.json({ ok: true });
    }
    // Logged server-side for ops; the client gets a generic message, never internals.
    console.error("contact API: failed to store lead", error);
    return NextResponse.json(
      { error: "Something went wrong saving your enquiry. Please try again, or reach us directly by phone." },
      { status: 500 }
    );
  }

  // After the write, never before. Its outcome is recorded, not returned:
  // the visitor's enquiry is already safe whatever happens here.
  const notification = await sendLeadNotification({
    id: leadId,
    name,
    company: company || null,
    email,
    phone: phone || null,
    industry: industry || null,
    message,
    imageUrl,
  });
  await adminDb
    .collection("leads")
    .doc(leadId)
    .update({ notification: { ...notification, at: FieldValue.serverTimestamp() } })
    .catch((error) => console.error("contact API: couldn't record notification status", error));

  return NextResponse.json({ ok: true });
}
