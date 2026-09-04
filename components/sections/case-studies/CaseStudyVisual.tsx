"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CaseStudyResult } from "@/lib/types";
import type { DossierCaseStudy } from "./CaseStudiesDossier";

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

/**
 * Featured case-study photo + a restrained engineering-drawing overlay
 * (coordinate ticks, crosshair, component outline, two leader-line
 * annotations pulled from the case's own results). Crossfades between cases
 * on transform/opacity only — no layout properties are animated.
 */
export function CaseStudyVisual({
  caseStudy,
  index,
  results,
}: {
  caseStudy: DossierCaseStudy;
  index: number;
  results: CaseStudyResult[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isMmpTheme, setIsMmpTheme] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const theme = rootRef.current?.closest("[data-theme]")?.getAttribute("data-theme");
    setIsMmpTheme(theme === "mmp-industrial");
  }, []);

  // mmp-industrial gets a slower, plain opacity crossfade (no scale "zoom") — every
  // other theme keeps the original snappier scale+fade below, untouched.
  const transition = prefersReducedMotion
    ? { duration: 0.01 }
    : isMmpTheme
      ? { duration: 1.1, ease: "easeInOut" as const }
      : { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };
  const enterFrom = prefersReducedMotion || isMmpTheme ? { opacity: 0 } : { opacity: 0, scale: 0.98 };
  const exitTo = prefersReducedMotion || isMmpTheme ? { opacity: 0 } : { opacity: 0, scale: 1.02 };
  const [firstLabel, secondLabel] = [results[0]?.label, results[1]?.label];

  return (
    <div ref={rootRef} className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border/60 bg-background-elevated lg:aspect-auto lg:h-full">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={caseStudy.slug}
          initial={enterFrom}
          animate={{ opacity: 1, scale: 1 }}
          exit={exitTo}
          transition={transition}
          className="absolute inset-0"
        >
          <Image
            src={caseStudy.afterImage || caseStudy.beforeImage}
            alt={`${caseStudy.title}, finished component`}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            priority={index === 0}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />

          <motion.svg
            aria-hidden="true"
            viewBox="0 0 400 300"
            className="pointer-events-none absolute inset-0 h-full w-full text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ...transition, delay: prefersReducedMotion ? 0 : 0.08 }}
          >
            <defs>
              <filter id={`legibility-${caseStudy.slug}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="1.4" floodColor="black" floodOpacity="0.65" />
              </filter>
            </defs>
            <g filter={`url(#legibility-${caseStudy.slug})`} opacity="0.9">
              {/* coordinate ticks, top edge — desktop-density detail, dropped on phones to keep the overlay light */}
              <g className="hidden sm:inline">
                {Array.from({ length: 9 }, (_, i) => 24 + i * 44).map((pos) => (
                  <line key={pos} x1={pos} y1="14" x2={pos} y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                ))}
              </g>

              {/* corner bracket — one on mobile, both from sm up */}
              <path d="M18 18v26M18 18h26" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
              <path
                d="M382 282v-26M382 282h-26"
                className="hidden sm:inline"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.75"
              />

              {/* component outline + crosshair, centered */}
              <circle cx="200" cy="150" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.4" />
              <path d="M200 96v14M200 190v14M146 150h14M240 150h14" stroke="currentColor" strokeWidth="1" opacity="0.55" />
              <circle cx="200" cy="150" r="2" fill="var(--color-accent)" />

              {/* red reference points along a fine horizontal line — full row from sm up, one mark on mobile */}
              <g className="hidden sm:inline">
                <line x1="60" y1="252" x2="340" y2="252" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                {[60, 140, 220, 300].map((x) => (
                  <circle key={x} cx={x} cy="252" r="1.6" fill="var(--color-accent)" opacity="0.75" />
                ))}
              </g>
              <circle cx="200" cy="252" r="1.6" fill="var(--color-accent)" opacity="0.75" className="sm:hidden" />

              {/* annotation — top-left leader */}
              {firstLabel && (
                <g>
                  <line x1="46" y1="52" x2="46" y2="86" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <line x1="46" y1="86" x2="70" y2="86" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <text
                    x="46"
                    y="44"
                    className="fill-current uppercase"
                    style={{ font: "600 8px var(--font-sans, ui-sans-serif)", letterSpacing: "0.14em" }}
                    opacity="0.85"
                  >
                    {firstLabel}
                  </text>
                </g>
              )}

              {/* annotation — bottom-right leader */}
              {secondLabel && (
                <g>
                  <line x1="354" y1="232" x2="354" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <line x1="354" y1="200" x2="330" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <text
                    x="354"
                    y="244"
                    textAnchor="end"
                    className="fill-current uppercase"
                    style={{ font: "600 8px var(--font-sans, ui-sans-serif)", letterSpacing: "0.14em" }}
                    opacity="0.85"
                  >
                    {secondLabel}
                  </text>
                </g>
              )}
            </g>
          </motion.svg>

          <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase">
            {pad(index)} · {caseStudy.specs.material}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
