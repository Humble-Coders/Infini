import "server-only";

import { NextResponse } from "next/server";
import { isAllowedOrigin } from "@/lib/auth/csrf";
import { verifySession, type SessionUser } from "@/lib/auth/session";
import type { Role } from "@/lib/types";

export const CONTENT_ROLES: Role[] = ["superAdmin", "contentEditor"];
export const LEADS_ROLES: Role[] = ["superAdmin", "leadsManager"];
export const SETTINGS_ROLES: Role[] = ["superAdmin"];

type Guarded = { session: SessionUser; error?: never } | { session?: never; error: NextResponse };

/**
 * Gate for /api/admin route handlers, the API twin of requireRole(). The
 * handlers write through the Admin SDK, which bypasses Firestore rules, so
 * this check is the access control: same roles as backend/firestore.rules.
 * State-changing methods must also come from this site's own origin.
 */
export async function requireApiRole(request: Request, allowedRoles: Role[]): Promise<Guarded> {
  if (request.method !== "GET" && request.method !== "HEAD" && !isAllowedOrigin(request)) {
    return { error: NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 }) };
  }
  const session = await verifySession();
  if (!session) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!allowedRoles.includes(session.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}
