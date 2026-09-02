"use client";

import { useState } from "react";
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
  const prefersReducedMotion = useReducedMotion();
  const active = industries[activeIndex];
  if (!active) return null;

  const transition = { duration: prefersReducedMotion ? 0.01 : 0.55, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
      <div
        data-industries-scroll-list
        className={cn(
          "lg:min-h-0 lg:max-h-[560px] lg:overflow-y-auto",
          "lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        )}
      >
      <ul className="flex flex-col divide-y divide-border/60 border-y border-border/60">
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
                  "group flex w-full min-h-[44px] items-center gap-4 py-5 text-left transition-colors duration-500 motion-reduce:transition-none sm:gap-6 sm:py-6",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums transition-colors duration-500 motion-reduce:transition-none sm:text-sm",
                    isActive ? "text-accent" : "text-muted-foreground/60"
                  )}
                >
                  {pad(index)}
                </span>

                <span className="flex flex-1 flex-col gap-1.5">
                  <span
                    className={cn(
                      "text-lg font-light tracking-tight transition-[transform,color] duration-500 motion-reduce:transition-none sm:text-2xl",
                      isActive && "translate-x-1 sm:translate-x-2"
                    )}
                  >
                    {industry.name}
                  </span>
                  <span
                    className={cn(
                      "max-w-md text-sm leading-snug transition-[opacity,color] duration-500 motion-reduce:transition-none",
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
                        className="block overflow-hidden lg:hidden"
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
                    "size-4 shrink-0 transition-transform duration-500 motion-reduce:transition-none sm:size-5",
                    isActive ? "translate-x-0 text-accent" : "-translate-x-1 opacity-40"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
      </div>

      {/* Sticky visual panel — desktop/tablet only; mobile shows the visual inline per row above. */}
      <div className="relative hidden aspect-square w-[clamp(280px,30vw,440px)] self-start overflow-hidden rounded-sm border border-border/60 bg-card lg:sticky lg:top-28 lg:block">
        <motion.div
          key={active.slug}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          className="absolute inset-0"
        >
          <TechnicalPhoto src={photoSrc(active.slug)} alt={active.name} index={activeIndex} />
        </motion.div>
        <span className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase">
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
      className="group inline-flex w-fit items-center gap-2 text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent"
    >
      Explore all applications
      <ArrowRight
        aria-hidden="true"
        className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
