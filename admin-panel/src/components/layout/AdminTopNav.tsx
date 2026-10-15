"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  FileText,
  MessageSquareQuote,
  Newspaper,
  Factory,
  Award,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { SignOutButton } from "@/components/admin/SignOutButton";
import type { Role } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const ALL_ROLES: Role[] = ["superAdmin", "contentEditor", "leadsManager"];
const CONTENT_ROLES: Role[] = ["superAdmin", "contentEditor"];

// Team has been moved into Company Settings to give the top bar ample space
const TOP_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL_ROLES },
  { label: "Inquiries", href: "/admin/leads", icon: Inbox, roles: ["superAdmin", "leadsManager"] },
  { label: "Events", href: "/admin/events", icon: CalendarDays, roles: CONTENT_ROLES },
  { label: "Case Studies", href: "/admin/case-studies", icon: FileText, roles: CONTENT_ROLES },
  { label: "Reviews", href: "/admin/testimonials", icon: MessageSquareQuote, roles: CONTENT_ROLES },
  { label: "Articles", href: "/admin/news", icon: Newspaper, roles: CONTENT_ROLES },
  { label: "Industries", href: "/admin/industries", icon: Factory, roles: CONTENT_ROLES },
  { label: "Certifications", href: "/admin/certifications", icon: Award, roles: CONTENT_ROLES },
  { label: "Media", href: "/admin/media", icon: ImageIcon, roles: CONTENT_ROLES },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["superAdmin"] },
];

export function AdminTopNav({ email, role }: { email: string; role: Role }) {
  const pathname = usePathname();
  const visibleItems = TOP_NAV_ITEMS.filter((item) => item.roles.includes(role));

  const roleLabels: Record<Role, string> = {
    superAdmin: "Super Admin",
    contentEditor: "Content Editor",
    leadsManager: "Leads Manager",
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl overflow-hidden">
      {/* Running red glow light beam along the top edge */}
      <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
        <div className="h-full w-[200%] -translate-x-1/2 animate-[marquee_6s_linear_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(242,53,64,0.2)_30%,var(--color-accent)_50%,rgba(242,53,64,0.2)_70%,transparent_100%)] shadow-[0_0_12px_rgba(242,53,64,0.8)]" />
      </div>

      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Brand identity on the left with dedicated space - no red ball */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/admin" className="group flex items-center">
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                INFINI
              </span>
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-mono">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Right side container: Navigation options pills filling space, and signout icon button */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto min-w-0">
          {/* Options Pill Bar shifted to the right to fill space */}
          <nav
            aria-label="Admin Navigation"
            className="hidden lg:flex items-center gap-1 rounded-full border border-border/80 bg-card/60 p-1 shadow-inner backdrop-blur-md overflow-x-auto scrollbar-none"
          >
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 whitespace-nowrap",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20 font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <SignOutButton />
        </div>
      </div>

      {/* Horizontal pill strip for mobile/tablet screens below 1024px */}
      <div className="flex lg:hidden overflow-x-auto border-t border-border/50 px-4 py-2 scrollbar-none gap-1 bg-card/40">
        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-3" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
