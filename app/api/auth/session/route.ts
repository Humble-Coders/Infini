import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/backend/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

/**
 * Exchanges a freshly-signed-in Firebase ID token for an httpOnly session
 * cookie. Called by the client right after `signInWithEmailAndPassword`, and
 * again after a role change to refresh the cookie's embedded claims (see
 * app/admin/users/page.tsx) — so a role change takes effect without the user
 * needing to sign out and back in.
 */
export async function POST(request: NextRequest) {
  const { idToken } = await request.json();
  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    // Verifying the ID token first rejects anything that isn't a real,
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
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
