import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/backend/firebase/admin";
import { requireApiRole, LEADS_ROLES } from "@/lib/auth/requireApiRole";

const ATTACHMENT_PATH = /^leadAttachments\/[\w-]+\.(jpg|png|webp)$/;

/**
 * Streams a contact-form attachment from its private Storage path. Leads
 * carry customer drawings, so only the roles that may read leads get them.
 */
export async function GET(request: NextRequest) {
  const guard = await requireApiRole(request, LEADS_ROLES);
  if (guard.error) return guard.error;

  const objectPath = request.nextUrl.searchParams.get("path") || "";
  if (!ATTACHMENT_PATH.test(objectPath)) {
    return NextResponse.json({ error: "Invalid attachment path" }, { status: 400 });
  }

  try {
    const file = adminStorage.bucket().file(objectPath);
    const [[contents], [metadata]] = await Promise.all([file.download(), file.getMetadata()]);
    return new NextResponse(new Uint8Array(contents), {
      headers: {
        "Content-Type": String(metadata.contentType || "application/octet-stream"),
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }
}
