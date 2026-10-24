"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/components/ui/utils";
import { INFINI_CONTACT } from "@/lib/constants/contact";
import type { NavLink } from "@/lib/types";

const SCROLL_THRESHOLD_PX = 32;
/*
 * Compositor-friendly header transition. The compact state used to animate the
 * nav's height (h-20 -> h-16) with transition-all, which relaid out the header
 * and everything under it on every frame. The header now keeps one layout
 * height and slides up by the difference instead, with the nav sliding back
 * down by half so the logo stays centred in the visible strip: transform only,
 * plus colour/shadow on the header surface.
 */
const EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Text wrapped with the hover/active underline: center-out scale, not a static border, so it reads as a deliberate interaction rather than a plain link style. Relies on an ancestor with `.group` for the hover trigger. */
function NavLabel({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span className="relative inline-block">
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-1 h-px origin-center bg-accent transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
        )}
      />
    </span>
  );
}

/** Digits and a leading + only, the form `tel:` links expect. */
function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function Navbar({ navItems, phone = INFINI_CONTACT.phone }: { navItems: NavLink[]; phone?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleMobileSection = useCallback((label: string) => {
    setExpandedMobileSections((current) => {
      const next = new Set(current);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }, []);

  // Layout effect, not a plain effect, because it runs before the browser paints,
  // so on reload (page loads already scrolled, per native scroll restoration)
  // the header commits its compact state before the first frame instead of
  // visibly sliding into it after load. (The compact state is a transform, so
  // it no longer shifts the content below either way.)
  useLayoutEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setExpandedMobileSections(new Set());
    menuTriggerRef.current?.focus();
  }, []);

  // Body scroll lock + focus trap + Escape-to-close while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = mobilePanelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }
      if (event.key !== "Tab") return;

      // Queried live so newly expanded/collapsed accordion sections stay in the trap.
      // Collapsed submenus are `inert`, so their links are skipped here too.
      const focusable = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => !el.closest("[inert]"))
        : [];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMobileMenu]);

  // Escape closes an open desktop dropdown too.
  useEffect(() => {
    if (!openDropdown) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown]);

  const linkClass = "group relative text-sm tracking-wide text-foreground/90 transition-colors duration-300 hover:text-foreground";

  function isItemActive(item: NavLink): boolean {
    if (item.href === "/") return pathname === "/";
    if (item.href.startsWith("/#")) return false;
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  }

  return (
    <header
      className={cn(
        EASE,
        "sticky top-0 z-50 border-b transition-[transform,background-color,box-shadow]",
        scrolled
          ? "-translate-y-4 border-foreground/10 bg-background/85 backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_1px_0_0_rgba(var(--color-foreground-rgb),0.07),0_8px_32px_-8px_rgba(var(--color-shadow-rgb),0.65)] sm:-translate-y-8"
          : "translate-y-0 border-foreground/10 bg-background"
      )}
    >
      <Container>
          <nav
            aria-label="Primary"
            className={cn(
              EASE,
              "flex h-20 items-center justify-between transition-transform sm:h-24",
              scrolled ? "translate-y-2 sm:translate-y-4" : "translate-y-0"
            )}
          >
          {/* INFINI + MMP lockup, as the old single-image lockup had it. MMP is the
              licensed process mark and drops away on narrow screens where the
              mobile menu needs the room. */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 sm:gap-4"
            aria-label="INFINI home"
          >
            {/* width/height are the largest rendered size (sm:h-14 = 56px tall at
                each file's aspect ratio), so the optimizer serves a ~1x/2x logo
                rather than the 1000px source. Only the wordmark is the LCP
                candidate; the MMP mark loads normally. */}
            <Image
              src="/brand/infini-finish-unlimited.png"
              data-mono="off"
              alt="INFINI, Finish Unlimited"
              width={114}
              height={56}
              className="h-12 w-auto sm:h-14"
              priority
            />
            <Image
              src="/brand/mmp-technology-light.png"
              data-mono="off"
              alt="MMP Technology"
              width={73}
              height={56}
              className="h-10 w-auto sm:h-14"
            />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => item.children && setOpenDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className={cn(linkClass, "flex items-center gap-1 outline-none")}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                      onClick={() =>
                        setOpenDropdown((current) => (current === item.label ? null : item.label))
                      }
                    >
                      <NavLabel active={isItemActive(item)}>{item.label}</NavLabel>
                      <ChevronDown
                        className={cn("size-3.5 transition-transform duration-300", openDropdown === item.label && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={cn(
                        "absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all duration-200 ease-out",
                        openDropdown === item.label
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      )}
                    >
                      <ul className="rounded-lg border border-border bg-popover p-2 shadow-xl">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                              tabIndex={openDropdown === item.label ? 0 : -1}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link href={item.href} className={linkClass}>
                    <NavLabel active={isItemActive(item)}>{item.label}</NavLabel>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              ref={menuTriggerRef}
              className="text-foreground -mr-2.5 flex size-11 items-center justify-center"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </nav>
      </Container>

      <div
        id="mobile-nav-panel"
        ref={mobilePanelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        // Collapsed by grid rows only, so without inert the closed menu's links
        // stayed in the tab order and the accessibility tree.
        inert={!mobileOpen}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div
          className={cn(
            "border-t border-border bg-background",
            mobileOpen
              ? cn(
                  "overflow-y-auto overscroll-contain",
                  scrolled ? "max-h-[calc(100dvh-4rem)]" : "max-h-[calc(100dvh-5rem)] sm:max-h-[calc(100dvh-6rem)]"
                )
              : "overflow-hidden"
          )}
        >
          <Container>
            <ul className="flex flex-col divide-y divide-border py-2">
              {navItems.map((item) => {
                const isExpanded = expandedMobileSections.has(item.label);
                return (
                  <li key={item.label} className="py-1">
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="flex min-h-11 flex-1 items-center py-2.5 text-base text-foreground"
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          type="button"
                          className="-mr-2.5 flex size-11 items-center justify-center text-muted-foreground"
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.label} submenu`}
                          aria-expanded={isExpanded}
                          aria-controls={`mobile-submenu-${item.label}`}
                          onClick={() => toggleMobileSection(item.label)}
                        >
                          <ChevronDown
                            className={cn("size-4 transition-transform duration-200", isExpanded && "rotate-180")}
                            aria-hidden="true"
                          />
                        </button>
                      )}
                    </div>
                    {item.children && (
                      <div
                        id={`mobile-submenu-${item.label}`}
                        inert={!isExpanded}
                        className={cn(
                          "grid transition-[grid-template-rows] duration-200 ease-out",
                          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        )}
                      >
                        <ul className="flex flex-col gap-1 overflow-hidden pb-2 pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="flex min-h-11 items-center py-2 text-sm text-muted-foreground"
                                onClick={closeMobileMenu}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {phone && (
              <a
                href={telHref(phone)}
                className="mb-4 flex min-h-12 items-center justify-center gap-2.5 rounded-lg border border-border text-base text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Phone className="size-4 text-accent" aria-hidden="true" />
                <span>
                  Call <span className="tabular-nums">{phone}</span>
                </span>
              </a>
            )}
          </Container>
        </div>
      </div>
    </header>
  );
}
