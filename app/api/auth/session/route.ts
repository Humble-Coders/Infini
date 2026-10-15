import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/backend/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";
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

/**
 * Exchanges a freshly signed-in Firebase ID token for an httpOnly session
 * cookie. Called by the client right after signInWithEmailAndPassword, and
 * again after a role change to refresh the cookie embedded claims.
 */
export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 });
  }

  if (isRateLimited(`auth-session:${clientIp(request.headers)}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many sign-in attempts. Please try again later." }, { status: 429 });
  }

  const payload = await request.json().catch(() => ({}));

  // Local development fallback for testing without external Firebase network
  if (process.env.NODE_ENV === "development" && payload.devLogin) {
    const email = payload.email || "admin@infini.co.in";
    const role = payload.role || "superAdmin";
    const sessionCookie = `dev-session:${role}:${email}`;

    const response = NextResponse.json({ ok: true, devMode: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: false, // permits local http on localhost:3000
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS / 1000,
      path: "/",
    });
    return response;
  }

  const { idToken } = payload;
  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    // Verifying the ID token first rejects anything that is not a real,
    // current Firebase sign-in before we ever mint a session cookie from it.
    await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_MS });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_MS / 1000,
      path: "/",
    });
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
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
