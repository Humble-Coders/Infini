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

const ROLES: readonly Role[] = ["superAdmin", "contentEditor", "leadsManager"];

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

/** Thrown when the server has no session secret, so admin sign-in must stay off. */
export class SessionSecretMissingError extends Error {
  constructor() {
    super("ADMIN_SESSION_SECRET is not configured (32+ random characters required).");
  }
}

/**
 * The HMAC key for owner-account session cookies. Production fails closed:
 * without a dedicated, long ADMIN_SESSION_SECRET no cookie can be signed or
 * verified, so a missing secret disables admin sign-in instead of falling
 * back to a value anyone could reproduce.
 */
function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "development") return "infini-local-dev-session-secret-key";
  throw new SessionSecretMissingError();
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
    if (!payload.uid || !payload.email || !isRole(payload.role)) return null;

    return { uid: String(payload.uid), email: String(payload.email), role: payload.role };
  } catch {
    return null;
  }
}

/**
 * The authoritative auth check. Runs in the Node runtime (layouts/route
 * handlers). Accepts the owner account's signed HMAC cookie and Firebase
 * session cookies whose user carries a role custom claim.
 */
export async function verifySession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  if (sessionCookie.startsWith("admin-auth:")) {
    return verifyHmacSession(sessionCookie);
  }

  // Local development only: the "Quick Dev Sign-In" button on localhost.
  if (process.env.NODE_ENV === "development" && sessionCookie.startsWith("dev-session:")) {
    const parts = sessionCookie.split(":");
    const role = isRole(parts[1]) ? parts[1] : "superAdmin";
    const email = parts[2] || "admin@infini.co.in";
    return { uid: "dev-super-admin-uid", email, role };
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!isRole(decoded.role)) return null;
    return { uid: decoded.uid, email: decoded.email ?? "", role: decoded.role };
  } catch {
    // Expired, revoked, or forged cookie, treat as signed out.
    return null;
  }
}
