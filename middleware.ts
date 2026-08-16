import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Edge-runtime UX layer: redirects to sign-in when the session cookie is
 * simply absent, so an unauthenticated visit to any /admin/** URL never
 * renders anything. This does NOT cryptographically verify the cookie —
 * `firebase-admin` needs Node APIs the Edge runtime doesn't have. The real
 * verification (and role check) happens in app/admin/layout.tsx via
 * verifySession(), and the final backstop is Firestore security rules,
 * which read the same signed custom claim independently of both.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const signInUrl = new URL("/admin/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!sign-in|not-authorized).*)"],
};
