"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { TechnicalPhoto } from "@/components/sections/shared/TechnicalPhoto";
import type { IndustryShowcaseItem } from "./industriesShowcaseData";

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

function photoSrc(slug: string) {
  return `https://picsum.photos/seed/infini-industry-${slug}/900/900`;
}

export function IndustriesExplorer({ industries }: { industries: IndustryShowcaseItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMmpTheme, setIsMmpTheme] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const active = industries[activeIndex];

  useEffect(() => {
    const theme = rootRef.current?.closest("[data-theme]")?.getAttribute("data-theme");
    setIsMmpTheme(theme === "mmp-industrial");
  }, []);

  if (!active) return null;

  const transition = { duration: prefersReducedMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] as const };

  // mmp-industrial gets a genuine crossfade: the outgoing image fades out while the
  // incoming one fades in, both slow and eased, so nothing pops or cuts abruptly.
  // Every other theme keeps the original entrance-only fade above, untouched.
  const crossfadeImages = !prefersReducedMotion && isMmpTheme;
  const crossfadeTransition = { duration: 1.4, ease: "easeInOut" as const };

  function handleListScroll() {
    const el = listRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  }

  return (
    <div ref={rootRef} className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
      <div className="mmp-list-wrap relative flex gap-3">
        <div className="relative min-w-0 flex-1">
          <div
            ref={listRef}
            onScroll={handleListScroll}
            data-industries-scroll-list
            className={cn(
              "lg:min-h-0 lg:max-h-[560px] lg:overflow-y-auto",
              "lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
            )}
          >
            <ul className="mmp-row-list flex flex-col divide-y divide-border/60 border-y border-border/60">
              {industries.map((industry, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={industry.slug}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      aria-expanded={isActive}
                      aria-controls={`industry-visual-${industry.slug}`}
                      className={cn(
                        "mmp-row group flex w-full min-h-[44px] items-center gap-4 py-5 text-left transition-colors duration-500 motion-reduce:transition-none sm:gap-6 sm:py-6",
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                      )}
                    >
                      <span
                        className={cn(
                          "mmp-row-number font-mono text-xs tabular-nums transition-colors duration-500 motion-reduce:transition-none sm:text-sm",
                          isActive ? "text-accent" : "text-muted-foreground/60"
                        )}
                      >
                        {pad(index)}
                      </span>

                      <span className="flex flex-1 flex-col gap-1.5">
                        <span
                          className={cn(
                            "mmp-row-name text-lg font-light tracking-tight transition-[transform,color] duration-500 motion-reduce:transition-none sm:text-2xl",
                            isActive && "translate-x-1 sm:translate-x-2"
                          )}
                        >
                          {industry.name}
                        </span>
                        <span
                          className={cn(
                            "mmp-row-desc max-w-md text-sm leading-snug transition-[opacity,color] duration-500 motion-reduce:transition-none",
                            isActive ? "text-foreground/85 opacity-100" : "text-muted-foreground opacity-70"
                          )}
                        >
                          {industry.summary}
                        </span>

                        {/* Visual crossfades inline on mobile, where there is no side panel. */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.span
                              id={`industry-visual-${industry.slug}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={transition}
                              className="mmp-inline-visual block overflow-hidden lg:hidden"
                            >
                              <span className="mt-4 block aspect-[4/3] w-full max-w-sm overflow-hidden rounded-sm">
                                <TechnicalPhoto src={photoSrc(industry.slug)} alt={industry.name} index={index} />
                              </span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>

                      <ArrowRight
                        aria-hidden="true"
                        className={cn(
                          "mmp-row-arrow size-4 shrink-0 transition-transform duration-500 motion-reduce:transition-none sm:size-5",
                          isActive ? "translate-x-0 text-accent" : "-translate-x-1 opacity-40"
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mmp-fade-top" aria-hidden="true" />
          <div className="mmp-fade-bottom" aria-hidden="true" />
        </div>

        {/* Subtle scroll-position indicator — mmp-industrial only, tracks the list above. */}
        <div className="mmp-scroll-indicator hidden shrink-0 lg:block" aria-hidden="true">
          <span className="mmp-scroll-track" />
          <span className="mmp-scroll-dot" style={{ top: `${scrollProgress * 100}%` }} />
        </div>
      </div>

      {/* Sticky visual panel — desktop/tablet only; mobile shows the visual inline per row above. */}
      <div className="mmp-visual-panel relative hidden aspect-square w-[clamp(280px,30vw,440px)] self-start overflow-hidden rounded-sm border border-border/60 bg-card lg:sticky lg:top-28 lg:block">
        {crossfadeImages ? (
          <AnimatePresence initial={false}>
            <motion.div
              key={active.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={crossfadeTransition}
              className="absolute inset-0"
            >
              <TechnicalPhoto src={photoSrc(active.slug)} alt={active.name} index={activeIndex} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={transition}
            className="absolute inset-0"
          >
            <TechnicalPhoto src={photoSrc(active.slug)} alt={active.name} index={activeIndex} />
          </motion.div>
        )}
        <span className="mmp-visual-counter pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
          {pad(activeIndex)} / {pad(industries.length - 1)}
        </span>
      </div>
    </div>
  );
}

export function IndustriesExplorerCta() {
  return (
    <Link
      href="/industries"
      className="mmp-intro-cta group inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent"
    >
      Explore all applications
      <ArrowRight
        aria-hidden="true"
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
