"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui/utils";
import type { TrustedCompany } from "./trustedCompanies";

const PAGE_SIZE = 14; // 7 per row x 2 rows
const ROW_SIZE = 7;
const AUTOPLAY_MS = 6000;

function chunk<T>(items: T[], size: number): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) pages.push(items.slice(i, i + size));
  return pages;
}

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
}

function LogoCell({ company }: { company: TrustedCompany }) {
  return (
    <div className="group flex min-h-[92px] flex-col items-center justify-center gap-2.5 px-3 py-6 sm:py-7">
      <span
        aria-hidden="true"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-muted-foreground",
          "grayscale opacity-80 transition-all duration-[250ms] ease-out",
          "group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.02] group-hover:border-accent/40 group-hover:text-accent"
        )}
      >
        {company.short}
      </span>
      <span
        className={cn(
          "text-center text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase",
          "opacity-80 transition-all duration-[250ms] ease-out",
          "group-hover:opacity-100 group-hover:text-foreground"
        )}
      >
        {company.name}
      </span>
    </div>
  );
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Show previous companies" : "Show next companies"}
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-accent shadow-[0_6px_18px_-8px_rgba(var(--color-shadow-rgb),0.25)] sm:size-[52px]",
        "transition-colors duration-200 hover:bg-primary-muted",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}

export function LogoShowcase({ companies }: { companies: TrustedCompany[] }) {
  const pages = chunk(companies, PAGE_SIZE);
  const [pageIndex, setPageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => setPageIndex((index + pages.length) % pages.length);
  const next = () => goTo(pageIndex + 1);
  const prev = () => goTo(pageIndex - 1);

  useEffect(() => {
    if (pages.length <= 1 || prefersReducedMotion || isPaused) return;
    const id = setInterval(() => setPageIndex((current) => (current + 1) % pages.length), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [pages.length, prefersReducedMotion, isPaused, pageIndex]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8">
      <div className="flex w-full items-center gap-3 sm:gap-5">
        {pages.length > 1 && <ArrowButton direction="prev" onClick={prev} />}

        <div
          ref={panelRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Trusted companies"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          className={cn(
            "relative mx-auto w-full max-w-[1500px] overflow-hidden rounded-[22px] border border-border bg-popover/75 backdrop-blur-[6px]",
            "shadow-[0_24px_60px_-32px_rgba(var(--color-shadow-rgb),0.35)]",
            "px-4 py-2 sm:px-8 sm:py-4",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          )}
        >
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: `translateX(-${pageIndex * 100}%)` }}
          >
            {pages.map((page, index) => (
              <div key={index} aria-hidden={index !== pageIndex} className="w-full shrink-0 flex flex-col">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 lg:divide-x lg:divide-border">
                  {page.slice(0, ROW_SIZE).map((company) => (
                    <LogoCell key={company.name} company={company} />
                  ))}
                </div>
                {page.length > ROW_SIZE && (
                  <div className="grid grid-cols-2 border-t border-border sm:grid-cols-4 lg:grid-cols-7 lg:divide-x lg:divide-border">
                    {page.slice(ROW_SIZE, PAGE_SIZE).map((company) => (
                      <LogoCell key={company.name} company={company} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {pages.length > 1 && <ArrowButton direction="next" onClick={next} />}
      </div>

      {pages.length > 1 && (
        <div className="flex items-center gap-2.5">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show companies group ${index + 1} of ${pages.length}`}
              aria-current={index === pageIndex}
              className={cn(
                "size-2 rounded-full transition-colors duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                index === pageIndex ? "bg-accent" : "bg-border hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
