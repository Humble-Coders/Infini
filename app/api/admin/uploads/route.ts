import "server-only";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminStorage } from "@/backend/firebase/admin";
import { requireApiRole, CONTENT_ROLES } from "@/lib/auth/requireApiRole";

// Under Vercel's 4.5 MB request limit. Photos are resized in the browser first
// (lib/storage/uploadAdminFile.ts), so only large PDFs get near it.
const MAX_BYTES = 4 * 1024 * 1024;

/** The file's real type from its first bytes; the browser-supplied type is never trusted. SVG is refused. */
function sniffType(buffer: Buffer): { contentType: string; ext: string } | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { contentType: "image/jpeg", ext: "jpg" };
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { contentType: "image/png", ext: "png" };
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    return { contentType: "image/webp", ext: "webp" };
  }
  if (buffer.toString("ascii", 0, 4) === "GIF8") return { contentType: "image/gif", ext: "gif" };
  if (buffer.toString("ascii", 0, 5) === "%PDF-") return { contentType: "application/pdf", ext: "pdf" };
  return null;
}

/**
 * Stores an admin upload (media library, case-study images, logos, brochure)
 * in Firebase Storage under media/, which the storage rules make publicly
 * readable, and returns its download URL. Files used to be saved as base64
 * text inside Firestore documents, which fails past Firestore's 1 MiB limit.
 */
export async function POST(request: NextRequest) {
  const guard = await requireApiRole(request, CONTENT_ROLES);
  if (guard.error) return guard.error;

  if (Number(request.headers.get("content-length") || 0) > MAX_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "Files must be under 4 MB." }, { status: 413 });
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const value = form.get("file");
    file = value instanceof File ? value : null;
  } catch {
    return NextResponse.json({ error: "That upload could not be read." }, { status: 400 });
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Files must be under 4 MB." }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const type = sniffType(buffer);
  if (!type) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, GIF and PDF files can be uploaded." }, { status: 415 });
  }

  try {
    const bucket = adminStorage.bucket();
    const objectPath = `media/${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${type.ext}`;
    const token = crypto.randomUUID();
    await bucket.file(objectPath).save(buffer, {
      resumable: false,
      contentType: type.contentType,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: token },
      },
    });
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(objectPath)}?alt=media&token=${token}`;
    return NextResponse.json({ ok: true, url, contentType: type.contentType, sizeKb: Math.max(1, Math.round(buffer.length / 1024)) });
  } catch (error) {
    console.error("[api/admin/uploads] upload failed:", error);
    return NextResponse.json({ error: "The file couldn't be stored. Please try again." }, { status: 500 });
  }
}
