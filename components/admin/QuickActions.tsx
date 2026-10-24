import Link from "next/link";
import { navItemsForRole } from "@/components/admin/nav";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/types";

/** Shortcuts into the sections this role can reach, minus Dashboard itself. */
export function QuickActions({ role }: { role: Role }) {
  const items = navItemsForRole(role).filter((item) => item.href !== "/admin");

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Button key={item.href} asChild variant="outline" size="sm">
          <Link href={item.href}>
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
