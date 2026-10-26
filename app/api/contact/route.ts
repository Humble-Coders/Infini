import "server-only";

import { after, NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/backend/firebase/admin";
import { isAllowedOrigin } from "@/lib/auth/csrf";
import { saveStoredLead } from "@/lib/data/leadsStorage";
import { sendLeadNotification } from "@/lib/leadNotification";
import { clientIp, isRateLimited, isRateLimitedShared } from "@/lib/rateLimit";
import * as crypto from "crypto";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB limit
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


/**
 * Contact / enquiry submission endpoint.
 *
 * Data flow (per CLAUDE.md rule 5: Firestore is the system of record, the
 * browser never touches `leads` directly — Firestore rules deny all client
 * writes, and this route is the sole writer via the Admin SDK):
 *
 *   validate → spam checks → rate limit → write to Firestore → success
 *   → (after the response) email the INFINI team
 *
 * The notification runs after the write and never before: a lead's
 * existence must never depend on mail delivery. Its outcome is recorded on
 * the lead so a silent SMTP outage is visible in the dashboard.
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
  // --- CSRF Layer: Validate origin/fetch-site to block cross-site request forgery ---
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  // Reject oversized bodies before buffering them (image limit plus form fields).
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_IMAGE_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "That submission is too large. Images must be under 5MB." }, { status: 413 });
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
  const ip = clientIp(request.headers);
  if (
    isRateLimited(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS) ||
    (await isRateLimitedShared(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS))
  ) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let imageUrl: string | null = null;
  let attachmentFailed = false;
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return invalid("The uploaded image exceeds the 5MB size limit.", { message: "Uploaded image must be under 5MB." });
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

    // Private Storage path (no public read rule): admins open it through
    // /api/admin/leads/attachment, never through a public URL.
    const objectPath = `leadAttachments/${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
    try {
      await adminStorage.bucket().file(objectPath).save(buffer, { contentType: mimeType, resumable: false });
      imageUrl = `/api/admin/leads/attachment?path=${encodeURIComponent(objectPath)}`;
    } catch (e) {
      // The enquiry still matters more than its attachment: keep the lead and flag it.
      console.error("[api/contact] attachment upload failed:", e);
      attachmentFailed = true;
    }
  }

  let leadId: string;
  try {
    const lead = await saveStoredLead({
      name,
      company: company || "Individual / Private",
      email,
      phone: phone || "",
      industry: industry || "General Engineering",
      message,
      hasDrawing: Boolean(imageUrl),
      imageUrl: imageUrl || null,
      status: "New",
      notes: attachmentFailed ? ["An image was attached but could not be stored. Ask the customer to resend it."] : [],
    });
    leadId = lead.id;
  } catch (error) {
    console.error("[api/contact] failed to store lead:", error);
    return NextResponse.json(
      { error: "We couldn't send your enquiry just now. Please try again, or email us directly." },
      { status: 500 }
    );
  }

  const origin = request.nextUrl.origin;
  after(async () => {
    const result = await sendLeadNotification({
      id: leadId,
      name,
      company: company || null,
      email,
      phone: phone || null,
      industry: industry || null,
      message,
      imageUrl: imageUrl ? `${origin}${imageUrl}` : null,
    });
    try {
      await adminDb.collection("leads").doc(leadId).set({ notification: result }, { merge: true });
    } catch (e) {
      console.error("[api/contact] could not record notification result:", e);
    }
  });

  return NextResponse.json({ ok: true });
}
