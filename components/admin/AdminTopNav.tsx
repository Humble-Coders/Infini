"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  FileText,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Image as ImageIcon,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
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

const TOP_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL_ROLES },
  { label: "Inquiries", href: "/admin/leads", icon: Inbox, roles: ["superAdmin", "leadsManager"] },
  { label: "Events", href: "/admin/events", icon: CalendarDays, roles: CONTENT_ROLES },
  { label: "Case Studies", href: "/admin/case-studies", icon: FileText, roles: CONTENT_ROLES },
  { label: "Reviews", href: "/admin/testimonials", icon: MessageSquareQuote, roles: CONTENT_ROLES },
  { label: "Articles", href: "/admin/news", icon: Newspaper, roles: CONTENT_ROLES },
  { label: "Media", href: "/admin/media", icon: ImageIcon, roles: CONTENT_ROLES },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["superAdmin"] },
];

export function AdminTopNav({ email, role }: { email: string; role: Role }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Close mobile drawer automatically when navigating to another page
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const visibleItems = TOP_NAV_ITEMS.filter((item) => item.roles.includes(role));

  const roleLabels: Record<Role, string> = {
    superAdmin: "Super Admin",
    contentEditor: "Content Editor",
    leadsManager: "Leads Manager",
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl">
        {/* Running red glow light beam along the top edge */}
        <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
          <div className="h-full w-[200%] -translate-x-1/2 animate-[marquee_6s_linear_infinite] bg-[linear-gradient(90deg,transparent_0%,rgba(242,53,64,0.2)_30%,#f23540_50%,rgba(242,53,64,0.2)_70%,transparent_100%)] shadow-[0_0_12px_rgba(242,53,64,0.8)]" />
        </div>

        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3.5 py-2.5 sm:px-6">
          {/* Brand identity on the left */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin" className="group flex items-center">
              <div className="flex flex-col">
                <span className="font-mono text-sm sm:text-base font-bold tracking-wider text-foreground">
                  INFINI
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest text-muted-foreground uppercase font-mono">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Right side controls: Desktop pills, Mobile Hamburger toggle, and Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Desktop Navigation Pills */}
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

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "flex lg:hidden items-center justify-center size-9 rounded-xl border transition-all",
                mobileMenuOpen
                  ? "border-accent/50 bg-accent/15 text-accent shadow-[0_0_15px_rgba(242,53,64,0.25)]"
                  : "border-border bg-card/80 text-foreground hover:bg-muted"
              )}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="size-4 text-accent" /> : <Menu className="size-4" />}
            </button>

            <SignOutButton />
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/80 bg-background/98 backdrop-blur-2xl px-4 py-3.5 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            {/* User credentials banner */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                <Shield className="size-3.5 text-accent" />
                <span>{roleLabels[role] || "Admin"}</span>
              </span>
              <span className="text-muted-foreground font-mono text-[11px] truncate max-w-[190px]">
                {email}
              </span>
            </div>

            {/* Navigation links grid */}
            <nav aria-label="Mobile Navigation Drawer" className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {visibleItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all",
                      isActive
                        ? "bg-accent text-accent-foreground font-semibold shadow-md shadow-accent/25"
                        : "bg-card/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={cn("size-4 shrink-0", isActive ? "text-accent-foreground" : "text-accent")} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={cn("size-3.5 shrink-0 opacity-50", isActive && "opacity-100")} />
                  </Link>
                );
              })}
            </nav>

            {/* Public site link at footer */}
            <div className="mt-3.5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors font-medium"
              >
                <ExternalLink className="size-3 text-accent" />
                <span>Open Public Website</span>
              </Link>
              <span className="text-[10px] text-muted-foreground font-mono">INFINI v2.0</span>
            </div>
          </div>
        )}
      </header>

      {/* Dimmed backdrop when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          aria-hidden="true"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}
    </>
  );
}
