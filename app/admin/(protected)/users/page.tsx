import type { Metadata } from "next";
import { requireRole } from "@/lib/auth/requireRole";
import { TeamAccessManager } from "@/components/modules/TeamAccessManager";

export const metadata: Metadata = { title: "Team & Role Access | Infini Admin" };

export default async function AdminUsersPage() {
  const session = await requireRole(["superAdmin"]);

  return (
    <div className="w-full">
      <TeamAccessManager currentUid={session.uid} />
    </div>
  );
}
