"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { TechnicalPhoto } from "@/components/sections/shared/TechnicalPhoto";
import type { IndustryApplications } from "./applicationsData";

function photoSrc(industrySlug: string, applicationSlug: string) {
  return `https://picsum.photos/seed/infini-app-${industrySlug}-${applicationSlug}/900/700`;
}

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

/** Arrow-key roving focus for a horizontal list of buttons — Home/End jump to the ends. */
function useArrowKeyNav(count: number, onSelect: (index: number) => void) {
  return (event: KeyboardEvent<HTMLElement>, current: number) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onSelect((current + 1) % count);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onSelect((current - 1 + count) % count);
    } else if (event.key === "Home") {
      event.preventDefault();
      onSelect(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onSelect(count - 1);
    }
  };
}

export function ApplicationExplorer({ industries }: { industries: IndustryApplications[] }) {
  const [industryIndex, setIndustryIndex] = useState(0);
  const [appIndex, setAppIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const activeChipRef = useRef<HTMLButtonElement>(null);

  const industry = industries[industryIndex];
  const application = industry?.applications[appIndex];

  const onIndustryKeyDown = useArrowKeyNav(industries.length, (next) => {
    setIndustryIndex(next);
    setAppIndex(0);
  });
  const onAppKeyDown = useArrowKeyNav(industry?.applications.length ?? 1, setAppIndex);

  useEffect(() => {
    activeChipRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [appIndex, industryIndex]);

  if (!industry || !application) return null;

  const transition = { duration: prefersReducedMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] as const };

  function selectIndustry(next: number) {
    setIndustryIndex(next);
    setAppIndex(0);
  }

  function stepApp(delta: number) {
    setAppIndex((current) => (current + delta + industry.applications.length) % industry.applications.length);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Industry row: name + counter, then applications */}
      <div className="flex flex-col gap-5">
        <div className="flex items-baseline justify-between gap-4">
          <AnimatePresence mode="wait">
            <motion.h3
              key={industry.slug}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
              transition={transition}
              className="text-xs font-medium tracking-[0.2em] text-foreground uppercase"
            >
              {industry.shortName}
            </motion.h3>
          </AnimatePresence>
          <span className="font-mono text-xs tabular-nums text-muted-foreground/60">
            {pad(industryIndex)} / {pad(industries.length - 1)}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Industries"
          className="flex gap-6 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {industries.map((item, index) => {
            const isActive = index === industryIndex;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectIndustry(index)}
                onKeyDown={(event) => onIndustryKeyDown(event, index)}
                className={cn(
                  "min-h-[44px] shrink-0 whitespace-nowrap border-b-2 pb-2 text-sm transition-colors duration-300 motion-reduce:transition-none",
                  isActive
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground/80"
                )}
              >
                {item.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications: horizontal chip nav on larger screens, prev/next stepper on mobile */}
      <div
        role="tablist"
        aria-label="Applications"
        className="hidden gap-8 overflow-x-auto pb-1 sm:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {industry.applications.map((item, index) => {
          const isActive = index === appIndex;
          return (
            <button
              key={item.slug}
              ref={isActive ? activeChipRef : undefined}
              type="button"
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setAppIndex(index)}
              onKeyDown={(event) => onAppKeyDown(event, index)}
              className={cn(
                "min-h-[44px] shrink-0 whitespace-nowrap text-base transition-[color,transform] duration-300 motion-reduce:transition-none sm:text-lg",
                isActive
                  ? "scale-105 font-light text-foreground"
                  : "text-muted-foreground/70 hover:text-foreground/80"
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-5 sm:hidden">
        <button
          type="button"
          onClick={() => stepApp(-1)}
          aria-label="Previous application"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <span className="min-w-[10ch] text-center text-base font-light text-foreground">{application.name}</span>
        <button
          type="button"
          onClick={() => stepApp(1)}
          aria-label="Next application"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground"
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      {/* Visual (left) + info panel (right) on larger screens; stacked on mobile */}
      <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="relative aspect-[4/5] w-full min-h-[360px] overflow-hidden rounded-sm border border-border/60 bg-card sm:min-h-[420px] lg:aspect-auto lg:min-h-[520px]">
          <AnimatePresence mode="sync">
            <motion.div
              key={`${industry.slug}-${application.slug}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={transition}
              className="absolute inset-0"
            >
              <TechnicalPhoto
                src={photoSrc(industry.slug, application.slug)}
                alt={`${application.name} — ${industry.name}`}
                index={appIndex}
              />
            </motion.div>
          </AnimatePresence>

          {/* Brief technical scan-line, replayed on every change. */}
          {!prefersReducedMotion && (
            <motion.span
              key={`scan-${industry.slug}-${application.slug}`}
              aria-hidden="true"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 0.7, 0], scaleX: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 top-1/2 h-px w-full origin-left bg-accent"
            />
          )}
        </div>

        {/* Info panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${industry.slug}-${application.slug}-info`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
            transition={transition}
            className="flex flex-col justify-center gap-8 border-t border-border/60 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Application
              </span>
              <p className="text-xl font-light tracking-tight text-foreground sm:text-2xl">{application.name}</p>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">{application.description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
                Industry
              </span>
              <p className="text-sm text-foreground">{industry.name}</p>
              <p className="max-w-[32ch] text-xs leading-relaxed text-muted-foreground/80">{application.benefit}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
