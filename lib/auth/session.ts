import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/backend/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import type { Role } from "@/lib/types";

export { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth/constants";

export interface SessionUser {
  uid: string;
  email: string;
  role: Role;
}

/**
 * The authoritative auth check. Runs in the Node runtime (layouts/route
 * handlers), unlike middleware which only runs on the Edge and can't call
 * the Admin SDK. Role comes from the verified custom claim on the session
 * cookie — never trust anything read from client state.
 */
export async function verifySession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const role = decoded.role as Role | undefined;
    if (!role) return null;
    return { uid: decoded.uid, email: decoded.email ?? "", role };
  } catch {
    // Expired, revoked, or forged cookie — treat as signed out.
    return null;
  }
}
