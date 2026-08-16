"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/components/ui/utils";
import type { NavLink } from "@/lib/types";

const SCROLL_THRESHOLD_PX = 32;
const TRANSITION = "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Text wrapped with the hover/active underline — center-out scale, not a static border, so it reads as a deliberate interaction rather than a plain link style. Relies on an ancestor with `.group` for the hover trigger. */
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

export function Navbar({ navItems }: { navItems: NavLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  // undefined when smooth scroll is off (prefers-reduced-motion) — no Lenis instance to stop/start.
  const lenis = useLenis();
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

  useEffect(() => {
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
  // Lenis intercepts wheel/touch input directly, so `overflow: hidden` alone
  // doesn't stop it — lenis.stop()/start() is the mechanism Lenis itself
  // provides for exactly this.
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();

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
      const focusable = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
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
      lenis?.start();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, closeMobileMenu, lenis]);

  // Escape closes an open desktop dropdown too.
  useEffect(() => {
    if (!openDropdown) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openDropdown]);

  const linkClass = cn(
    TRANSITION,
    "group relative text-sm tracking-wide",
    scrolled ? "text-background/80 hover:text-background" : "text-foreground/90 hover:text-foreground"
  );

  function isItemActive(item: NavLink): boolean {
    if (item.href === "/") return pathname === "/";
    if (item.href.startsWith("/#")) return false;
    return pathname === item.href || pathname?.startsWith(`${item.href}/`);
  }

  return (
    <header
      className={cn(
        TRANSITION,
        "sticky top-0 z-50 border-b",
        scrolled
          ? "border-background/10 bg-foreground/95 shadow-md shadow-black/10 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <Container>
        <nav
          aria-label="Primary"
          className={cn("flex items-center justify-between", TRANSITION, scrolled ? "h-16" : "h-24")}
        >
          <Link
            href="/"
            className={cn("flex items-center gap-2", TRANSITION, scrolled ? "text-background" : "text-foreground")}
            aria-label="INFINI home"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.4" />
              <path d="M14 3.5 L14 24.5 M3.5 14 L24.5 14" stroke="var(--color-primary)" strokeWidth="1.4" />
            </svg>
            <span className="text-lg font-semibold tracking-[0.2em]">INFINI</span>
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
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

          <div className="hidden items-center md:flex">
            <Button asChild size="sm" variant="default">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <Button asChild size="sm" variant="default" className="px-3 text-xs">
              <Link href="/request-a-quote">Request a Quote</Link>
            </Button>
            <button
              type="button"
              ref={menuTriggerRef}
              className={cn(
                TRANSITION,
                scrolled ? "text-background" : "text-foreground",
                "-mr-2.5 flex size-11 items-center justify-center"
              )}
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
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out md:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div
          className={cn(
            "border-t border-border bg-background",
            mobileOpen ? "max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain" : "overflow-hidden"
          )}
        >
          <Container>
            <div className="flex flex-col gap-3 border-b border-border py-4">
              <Button asChild variant="default">
                <Link href="/request-a-quote" onClick={closeMobileMenu}>
                  Request a Quote
                </Link>
              </Button>
            </div>
            <ul className="flex flex-col divide-y divide-border py-2">
              {navItems.map((item) => {
                const isExpanded = expandedMobileSections.has(item.label);
                return (
                  <li key={item.label} className="py-1">
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="block flex-1 py-2.5 text-base text-foreground"
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
                                className="block py-2 text-sm text-muted-foreground"
                                tabIndex={isExpanded ? 0 : -1}
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
          </Container>
        </div>
      </div>
    </header>
  );
}
