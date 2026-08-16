import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { UsersManager } from "@/components/admin/UsersManager";

export const metadata: Metadata = { title: "Users" };

// Super Admin only, enforced by requireRole below AND by the users
// collection's Firestore rules — a Content Editor or Leads Manager hitting
// this URL directly is denied at both layers, not just kept off a nav link.
//
// The user list itself is fetched client-side (see UsersManager), not here:
// lib/data/* accessors use the browser Firestore SDK, and this server
// component has no signed-in request context for rules to authorize against.
export default async function AdminUsersPage() {
  const session = await requireRole(["superAdmin"]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Users</h1>
      <UsersManager currentUid={session.uid} />
    </div>
  );
}
