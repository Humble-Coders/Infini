"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/ui/utils";
import { navItemsForRole } from "@/components/admin/nav";
import type { Role } from "@/lib/types";

/**
 * Section navigation for narrow screens. The sidebar intentionally starts at
 * md (768px); below that this horizontally scrollable chip bar carries the
 * exact same role-filtered links, so phones get full admin navigation with
 * zero duplicated link definitions. Touch-sized (min 44px tall), momentum
 * scrolls natively, active section is exposed via aria-current.
 */
export function AdminMobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = navItemsForRole(role);

  return (
    <nav aria-label="Admin sections" className="border-b border-border bg-background md:hidden">
      <ul className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:thin]">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2 rounded-md border px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
