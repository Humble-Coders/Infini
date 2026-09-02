"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { CaseStudyVisual } from "./CaseStudyVisual";
import type { CaseStudyDoc, CaseStudyResult, WithId } from "@/lib/types";

/** Case-study data as it reaches the client dossier — `seo` and `publishedAt` are stripped server-side. */
export type DossierCaseStudy = Omit<WithId<CaseStudyDoc>, "seo" | "publishedAt">;

const AUTO_ROTATE_MS = 7000;
const RESUME_DELAY_MS = 10000;

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

function industryLabel(industryId: string) {
  return industryId.replace(/[-_]/g, " ").toUpperCase();
}

const RESULT_ICON = { down: ArrowDown, up: ArrowUp, check: Check } as const;

/** Falls back to a generic 3-chip breakdown of the free-text `result` field when a case has no structured `results`. */
function resultsFor(caseStudy: DossierCaseStudy): CaseStudyResult[] {
  if (caseStudy.results && caseStudy.results.length > 0) return caseStudy.results;
  return [
    { label: "Surface quality", value: "Improved", direction: "up" },
    { label: "Process consistency", value: "Consistent", direction: "check" },
    { label: "Finish variation", value: "Reduced", direction: "down" },
  ];
}

export function CaseStudiesDossier({ caseStudies }: { caseStudies: DossierCaseStudy[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Auto-rotation is a desktop-only affordance — on phones/tablets the visitor drives the dossier by tapping, never an unannounced timer.
  const [canAutoRotate, setCanAutoRotate] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  const [isMmpTheme, setIsMmpTheme] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const total = caseStudies.length;

  useEffect(() => {
    const theme = rootRef.current?.closest("[data-theme]")?.getAttribute("data-theme");
    setIsMmpTheme(theme === "mmp-industrial");
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
      setPaused(true);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS);
    },
    [total]
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => setCanAutoRotate(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!canAutoRotate || prefersReducedMotion || paused || total <= 1) return;
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % total), AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [canAutoRotate, paused, prefersReducedMotion, total]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const active = caseStudies[activeIndex];
  if (!active) return null;
  const results = resultsFor(active);
  // mmp-industrial gets a slower true crossfade (old text fades out as the new text fades in,
  // no vertical pop) via AnimatePresence below — every other theme keeps the original
  // entrance-only fade+rise, untouched.
  const fadeTransition = isMmpTheme
    ? { duration: prefersReducedMotion ? 0.01 : 0.9, ease: "easeInOut" as const }
    : { duration: prefersReducedMotion ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      className="grid gap-6 sm:gap-8 lg:grid-cols-[380px_1fr] lg:gap-14 xl:grid-cols-[420px_1fr]"
    >
      {/* Desktop nav + progress rail */}
      <div className="hidden lg:flex lg:flex-col lg:gap-1">
        <ul className="relative flex flex-col divide-y divide-border/60 border-y border-border/60 pl-6">
          <span aria-hidden="true" className="absolute top-0 left-1 h-full w-px bg-border/60" />
          {caseStudies.map((caseStudy, index) => {
            const isActive = index === activeIndex;
            return (
              <li key={caseStudy.slug} className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1/2 left-1 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300",
                    isActive ? "bg-accent" : "bg-border"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="case-progress-dot"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </span>

                <button
                  type="button"
                  id={`case-tab-${caseStudy.slug}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`case-panel-${caseStudy.slug}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    "group flex min-h-[44px] w-full items-center gap-4 py-5 text-left transition-[transform,color] duration-300",
                    isActive ? "translate-x-1.5 text-foreground" : "text-muted-foreground hover:translate-x-1.5 hover:text-foreground/80"
                  )}
                >
                  <span className={cn("font-mono text-xs tabular-nums", isActive ? "text-accent" : "text-muted-foreground/60")}>
                    {pad(index)}
                  </span>
                  <span className="flex flex-1 flex-col gap-0.5">
                    <span
                      className={cn(
                        "text-[11px] font-medium tracking-[0.18em] uppercase",
                        isActive ? "text-accent" : "text-muted-foreground/70"
                      )}
                    >
                      {industryLabel(caseStudy.industryId)}
                    </span>
                    <span className="text-base leading-snug font-light">{caseStudy.title}</span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-300",
                      isActive ? "translate-x-0.5 text-accent" : "text-muted-foreground/40 group-hover:translate-x-0.5"
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Featured panel */}
      <div className="flex min-w-0 flex-col gap-5 sm:gap-6">
        <div className="rounded-xl border border-border/60 bg-card p-2.5 sm:rounded-2xl sm:p-3 md:p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-muted-foreground/70 uppercase sm:inline">
              Featured case
            </span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {pad(activeIndex)} / {pad(total - 1)}
              </span>
              <div className="hidden items-center gap-2 lg:flex">
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Previous case study"
                  className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <ArrowLeft aria-hidden="true" className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Next case study"
                  className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  <ArrowRight aria-hidden="true" className="size-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div
            id={`case-panel-${active.slug}`}
            role="tabpanel"
            aria-labelledby={`case-tab-${active.slug}`}
            className="mmp-case-panel grid min-w-0 gap-4 lg:grid-cols-[1.35fr_1fr] lg:items-stretch"
          >
            <CaseStudyVisual caseStudy={active} index={activeIndex} results={results} />

            <motion.div
              key={active.slug}
              initial={isMmpTheme ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={isMmpTheme ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={fadeTransition}
              className="flex min-w-0 flex-col justify-between gap-5 p-1 sm:gap-6 sm:p-2 md:p-3"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs tabular-nums text-muted-foreground/70">{pad(activeIndex)}</span>
                  <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{industryLabel(active.industryId)}</span>
                  <h3 className="text-balance text-lg leading-tight font-light text-foreground sm:text-xl md:text-2xl">
                    {active.title}
                  </h3>
                </div>

                <span aria-hidden="true" className="h-px w-10 bg-accent" />

                <p className="text-sm leading-relaxed text-muted-foreground">{active.challenge}</p>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">Material</span>
                  <span className="text-sm text-foreground">{active.specs.material}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-border/60 pt-4 sm:gap-3">
                  {results.slice(0, 3).map((result) => {
                    const Icon = RESULT_ICON[result.direction];
                    return (
                      <div key={result.label} className="flex flex-col gap-1.5">
                        <Icon aria-hidden="true" className="size-3.5 text-accent" />
                        <span className="text-[9px] leading-tight font-medium tracking-[0.14em] text-muted-foreground/70 uppercase">
                          {result.label}
                        </span>
                        <span className="text-sm font-light text-foreground">{result.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href={`/case-studies/${active.slug}`}
                className="group inline-flex min-h-[44px] w-fit items-center gap-2 border-b border-transparent text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent active:border-accent active:text-accent"
              >
                View case study
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Proof strip */}
        <div className="border-t border-border/60 pt-6">
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground/90 italic">
            &ldquo;Precision finishing engineered around measurable component performance.&rdquo;
          </p>
        </div>

        {/* Mobile prev/next */}
        <div className="flex items-center justify-between border-t border-border/60 pt-4 lg:hidden">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex min-h-[44px] items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground active:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            Previous
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex min-h-[44px] items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground active:text-foreground"
          >
            Next
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </button>
        </div>

        {/* Mobile/tablet case list — a full-width, tap-first archive index, not a scaled-down copy of the desktop rail */}
        <div className="lg:hidden">
          <span className="mb-1 block text-[10px] font-medium tracking-[0.2em] text-muted-foreground/60 uppercase">
            All case studies
          </span>
          <ul className="flex flex-col divide-y divide-border/60 border-y border-border/60">
            {caseStudies.map((caseStudy, index) => {
              const isActive = index === activeIndex;
              return (
                <li key={caseStudy.slug}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-pressed={isActive}
                    aria-label={`View case study ${pad(index)}: ${caseStudy.title}`}
                    className={cn(
                      "flex min-h-[76px] w-full items-center gap-4 py-4 text-left transition-colors duration-300",
                      isActive ? "text-foreground" : "text-muted-foreground active:text-foreground/80"
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 font-mono text-xs tabular-nums",
                        isActive ? "text-accent" : "text-muted-foreground/60"
                      )}
                    >
                      {pad(index)}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "text-[10px] font-medium tracking-[0.18em] uppercase",
                          isActive ? "text-accent" : "text-muted-foreground/70"
                        )}
                      >
                        {industryLabel(caseStudy.industryId)}
                      </span>
                      <span className="truncate text-sm leading-snug font-light">{caseStudy.title}</span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className={cn("size-4 shrink-0", isActive ? "text-accent" : "text-muted-foreground/40")}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
