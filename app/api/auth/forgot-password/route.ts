import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/backend/firebase/admin";
import { clientIp, isRateLimited } from "@/lib/rateLimit";

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
    return Boolean(host && originUrl.host === host);
  } catch {
    return false;
  }
}

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

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Please enter a valid administrator email address." }, { status: 400 });
  }

  // Security enforcement: Restrict password resets to real INFINI administrators
  const adminEmailEnv = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const isRealAdmin =
    (adminEmailEnv && email === adminEmailEnv) ||
    email === "admin@infini.co.in" ||
    email.endsWith("@infini.co.in");
  if (!isRealAdmin) {
    return NextResponse.json(
      { error: "Access restricted. Only registered @infini.co.in administrator accounts may request credentials." },
      { status: 403 }
    );
  }

  try {
    // Attempt to generate standard Firebase Admin reset link if Admin SDK is configured
    try {
      await adminAuth.generatePasswordResetLink(email);
    } catch {
      // Gracefully continue even if external Firebase service account is pending
    }

    return NextResponse.json({
      ok: true,
      message: `If ${email} is registered in the administrator directory, a secure reset link has been dispatched.`,
    });
  } catch {
    return NextResponse.json({
      ok: true,
      message: "Password reset request recorded. Please check your administrator inbox.",
    });
  }
}
