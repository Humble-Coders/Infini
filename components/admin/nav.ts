import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Factory,
  Building2,
  Award,
  BookOpen,
  Newspaper,
  MessageSquareQuote,
  CalendarDays,
  Image as ImageIcon,
  Users,
  Settings,
} from "lucide-react";
import type { Role } from "@/lib/types";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Roles allowed to see this link. Convenience only — Firestore rules (T6) are the real gate. */
  roles: Role[];
}

const ALL_ROLES: Role[] = ["superAdmin", "contentEditor", "leadsManager"];
const CONTENT_ROLES: Role[] = ["superAdmin", "contentEditor"];

/** The 13 sections from the T7 ticket. Every href resolves to a real page — a stub for anything not built yet — so nothing 404s. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ALL_ROLES },
  { label: "Leads", href: "/admin/leads", icon: Inbox, roles: ["superAdmin", "leadsManager"] },
  { label: "Pages", href: "/admin/pages", icon: FileText, roles: CONTENT_ROLES },
  { label: "Industries", href: "/admin/industries", icon: Factory, roles: CONTENT_ROLES },
  { label: "Company & Capabilities", href: "/admin/company-capabilities", icon: Building2, roles: CONTENT_ROLES },
  { label: "Certifications", href: "/admin/certifications", icon: Award, roles: CONTENT_ROLES },
  { label: "Case Studies", href: "/admin/case-studies", icon: BookOpen, roles: CONTENT_ROLES },
  { label: "News", href: "/admin/news", icon: Newspaper, roles: CONTENT_ROLES },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote, roles: CONTENT_ROLES },
  { label: "Events", href: "/admin/events", icon: CalendarDays, roles: CONTENT_ROLES },
  { label: "Media", href: "/admin/media", icon: ImageIcon, roles: CONTENT_ROLES },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["superAdmin"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["superAdmin"] },
];

export function navItemsForRole(role: Role): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter((item) => item.roles.includes(role));
}
