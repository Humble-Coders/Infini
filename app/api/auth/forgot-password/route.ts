import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/backend/firebase/admin";
import { isAllowedOrigin } from "@/lib/auth/csrf";
import { sendPasswordResetEmail } from "@/lib/leadNotification";
import { clientIp, isRateLimited, isRateLimitedShared } from "@/lib/rateLimit";

// Same reply whether or not the address exists, so the form can't be used
// to discover which emails have admin accounts.
const GENERIC_REPLY = {
  ok: true,
  message: "If that address belongs to an INFINI team account, a reset link is on its way.",
};

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  if (isRateLimited(`forgot-password:${clientIp(request.headers)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many password reset requests. Please wait a few minutes." },
      { status: 429 }
    );
  }

  const payload = await request.json().catch(() => ({}));
  const email = String(payload.email || "").trim().toLowerCase();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isEmailValid) {
    return NextResponse.json({ error: "Please enter a valid administrator email address." }, { status: 400 });
  }

  if (await isRateLimitedShared(`forgot-password-email:${email}`, 3, 60 * 60 * 1000)) {
    return NextResponse.json(GENERIC_REPLY);
  }

  try {
    // Only team members with an admin role get a link. The owner account
    // lives in the environment; its password is changed there, not here.
    const user = await adminAuth.getUserByEmail(email);
    if (user.disabled || !user.customClaims?.role) return NextResponse.json(GENERIC_REPLY);

    const link = await adminAuth.generatePasswordResetLink(email);
    const result = await sendPasswordResetEmail(email, link);
    if (result.status !== "sent") {
      console.error("[api/auth/forgot-password] reset email not sent:", result.status);
    }
  } catch {
    // Unknown address or Auth unavailable: same reply either way.
  }

  return NextResponse.json(GENERIC_REPLY);
}
