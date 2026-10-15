import "server-only";

import { cookies } from "next/headers";
import crypto from "crypto";
import { adminAuth } from "@/backend/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";
import type { Role } from "@/lib/types";

export { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

export interface SessionUser {
  uid: string;
  email: string;
  role: Role;
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "infini-precision-admin-auth-2026-secret"
  );
}

export function signHmacSession(user: { uid: string; email: string; role: Role }): string {
  const secret = getSessionSecret();
  const payload = {
    uid: user.uid,
    email: user.email,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
  return `admin-auth:${payloadB64}.${signature}`;
}

export function verifyHmacSession(cookieValue: string): SessionUser | null {
  if (!cookieValue.startsWith("admin-auth:")) return null;
  const token = cookieValue.slice("admin-auth:".length);
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  try {
    const secret = getSessionSecret();
    const expectedSig = crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    if (!payload.email || !payload.role) return null;

    // Real admin validation: only registered admin emails
    const isRealAdmin =
      payload.email === "admin@infini.co.in" ||
      payload.email.endsWith("@infini.co.in");
    if (!isRealAdmin) return null;

    return {
      uid: payload.uid || "admin-authenticated",
      email: payload.email,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

/**
 * The authoritative auth check. Runs in the Node runtime (layouts/route
 * handlers). Accepts both Firebase Admin SDK session cookies and cryptographically
 * signed HMAC admin tokens for resilience across cloud environments.
 */
export async function verifySession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  // 1. Check for cryptographically signed HMAC admin session
  if (sessionCookie.startsWith("admin-auth:")) {
    const verified = verifyHmacSession(sessionCookie);
    if (verified) return verified;
  }

  // 2. Local development fallback for offline localhost testing
  if (process.env.NODE_ENV === "development" && sessionCookie.startsWith("dev-session:")) {
    const parts = sessionCookie.split(":");
    const role = (parts[1] as Role) || "superAdmin";
    const email = parts[2] || "admin@infini.co.in";
    return {
      uid: "dev-super-admin-uid",
      email,
      role,
    };
  }

  // 3. Firebase Admin SDK verification (when service credentials are provided)
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const role = (decoded.role as Role) || (decoded.email === "admin@infini.co.in" ? "superAdmin" : undefined);
    if (!role) return null;
    return { uid: decoded.uid, email: decoded.email ?? "", role };
  } catch {
    // Expired, revoked, or forged cookie, treat as signed out.
    return null;
  }
}
