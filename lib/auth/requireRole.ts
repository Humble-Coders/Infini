import "server-only";

import { redirect } from "next/navigation";
import { verifySession, type SessionUser } from "@/lib/auth/session";
import type { Role } from "@/lib/types";

/**
 * Gate for a server component or route handler under /admin. Unauthenticated
 * users are redirected to sign-in; signed-in users without an allowed role
 * are redirected to a clear "not authorized" page — never a blank screen and
 * never a UI element quietly hidden instead. This is a UX convenience layer:
 * the real enforcement is Firestore security rules reading the same claim.
 */
export async function requireRole(allowedRoles: Role[]): Promise<SessionUser> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/sign-in");
  }
  if (!allowedRoles.includes(session.role)) {
    redirect("/admin/not-authorized");
  }
  return session;
}

/** Any signed-in admin, regardless of role. */
export async function requireSession(): Promise<SessionUser> {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/sign-in");
  }
  return session;
}
