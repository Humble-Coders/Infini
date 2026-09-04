"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, TrendingDown, TrendingUp } from "lucide-react";
import type { CaseStudyResult } from "@/lib/types";

export interface CaseStudyCardData {
  id: string;
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  results: CaseStudyResult[];
  specs: { material: string; process: string; duration: string };
}

const RESULT_ICONS = { down: TrendingDown, up: TrendingUp, check: Check } as const;

/**
 * Horizontal, snap-scrolling rail of case-study cards. Native overflow scroll
 * (so trackpads, touch and keyboard all just work) plus prev/next buttons that
 * scroll one card at a time. Text-forward on purpose: the outcome chips and the
 * material/process/duration line carry the credibility, not a stock photo.
 */
export function CaseStudiesRail({ items }: { items: CaseStudyCardData[] }) {
  const railRef = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("li");
    const distance = (card?.offsetWidth ?? 360) + 24;
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-6">
      <ul
        ref={railRef}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 scroll-pl-6 [scrollbar-width:none] md:-mx-10 md:px-10 md:scroll-pl-10 lg:-mx-16 lg:px-16 lg:scroll-pl-16 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li key={item.id} className="w-[86vw] shrink-0 snap-start sm:w-[420px]">
            <article className="group relative flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-7 transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_32px_64px_-40px_rgba(var(--color-shadow-rgb),0.4)] sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">{item.industry}</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-2xl leading-[1.1] font-semibold tracking-[-0.025em] text-foreground">
                <Link
                  href={`/case-studies/${item.slug}`}
                  className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none group-focus-within:text-accent"
                >
                  {item.title}
                </Link>
              </h3>

              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.challenge}</p>

              {item.results.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {item.results.map((result) => {
                    const Icon = RESULT_ICONS[result.direction] ?? Check;
                    return (
                      <li
                        key={result.label}
                        className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-foreground"
                      >
                        <Icon className="size-3.5 text-accent" strokeWidth={2} aria-hidden="true" />
                        <span className="text-muted-foreground">{result.label}</span>
                        <span className="font-medium">{result.value}</span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-border pt-5 font-mono text-[11px]">
                {(
                  [
                    ["Material", item.specs.material],
                    ["Process", item.specs.process],
                    ["Duration", item.specs.duration],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex min-w-0 flex-col gap-1">
                    <dt className="tracking-[0.18em] text-muted-foreground uppercase">{label}</dt>
                    <dd className="truncate text-foreground">{value || "n/a"}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          {items.length} {items.length === 1 ? "case study" : "case studies"}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous case study"
            className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next case study"
            className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
