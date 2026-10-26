import "server-only";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminAuth } from "@/backend/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";
import { isAllowedOrigin } from "@/lib/auth/csrf";
import { isRole, signHmacSession, SessionSecretMissingError } from "@/lib/auth/session";
import { clientIp, isRateLimited, isRateLimitedShared } from "@/lib/rateLimit";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_MAX_AGE_MS / 1000,
  path: "/",
};

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/**
 * Exchanges owner-account credentials, or a verified Firebase ID token whose
 * user has a role claim, for an httpOnly session cookie.
 */
export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  const ip = clientIp(request.headers);
  if (
    isRateLimited(`auth-session:${ip}`, 10, 10 * 60 * 1000) ||
    (await isRateLimitedShared(`auth-session:${ip}`, 20, 10 * 60 * 1000))
  ) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please try again later." }, { status: 429 });
  }

  const payload = await request.json().catch(() => ({}));

  // 1. Owner account (break-glass), defined entirely in the environment.
  if (payload.adminLogin) {
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");
    const ownerEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const ownerPassword = process.env.ADMIN_PASSWORD;

    if (!ownerEmail || !ownerPassword || ownerPassword.length < 12) {
      console.error("[api/auth/session] ADMIN_EMAIL / ADMIN_PASSWORD (12+ chars) are not configured.");
      return NextResponse.json({ error: "Administrator sign-in is not configured." }, { status: 503 });
    }

    // Per account, across every instance: guessing one password from many IPs still stops.
    if (await isRateLimitedShared(`auth-session-email:${email}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many sign-in attempts. Please try again later." }, { status: 429 });
    }

    // Both compared in constant time, and both must match: one generic error
    // so the response never reveals which half was wrong.
    const emailOk = safeEqual(email, ownerEmail);
    const passwordOk = safeEqual(password, ownerPassword);
    if (!emailOk || !passwordOk) {
      return NextResponse.json({ error: "Incorrect administrator email or password." }, { status: 401 });
    }

    try {
      const sessionCookie = signHmacSession({ uid: "owner", email: ownerEmail, role: "superAdmin" });
      const response = NextResponse.json({ ok: true, admin: true });
      response.cookies.set(SESSION_COOKIE, sessionCookie, COOKIE_OPTIONS);
      return response;
    } catch (error) {
      if (error instanceof SessionSecretMissingError) {
        console.error("[api/auth/session]", error.message);
        return NextResponse.json({ error: "Administrator sign-in is not configured." }, { status: 503 });
      }
      throw error;
    }
  }

  // 2. Local development only: the "Quick Dev Sign-In" button on localhost.
  if (process.env.NODE_ENV === "development" && payload.devLogin) {
    const email = payload.email || "admin@infini.co.in";
    const role = isRole(payload.role) ? payload.role : "superAdmin";
    const response = NextResponse.json({ ok: true, devMode: true });
    response.cookies.set(SESSION_COOKIE, `dev-session:${role}:${email}`, { ...COOKIE_OPTIONS, secure: false });
    return response;
  }

  // 3. Firebase ID token exchange (team members invited through Firebase Auth).
  const { idToken } = payload;
  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing authentication token or credentials" }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    if (!isRole(decoded.role)) {
      return NextResponse.json({ error: "Access denied. This account has no admin role." }, { status: 403 });
    }
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, COOKIE_OPTIONS);
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid or expired sign-in" }, { status: 401 });
  }
}

/** Signs the admin out by clearing the session cookie. */
export async function DELETE(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
