"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/components/ui/utils";
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
 * Horizontal auto-scrolling rail of case-study cards.
 * Autoscrolls continuously/periodically when idle, seamlessly loops,
 * and pauses on hover, focus, touch, and user interaction.
 * Native overflow scroll (trackpad, touch, keyboard), drag-to-scroll for mouse users,
 * indicator pill dots, and manual prev/next buttons all work concurrently.
 */
export function CaseStudiesRail({
  items,
  linkToDetail = true,
}: {
  items: CaseStudyCardData[];
  /**
   * False when the rail is showing the in-code demo studies (lib/demo/caseStudies),
   * whose slugs have no Firestore document behind them, so linking them would send
   * every card to a 404.
   */
  linkToDetail?: boolean;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const isInteractingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag-to-scroll tracking
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const getCardDistance = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return 444;
    const card = rail.querySelector<HTMLElement>("li");
    return (card?.offsetWidth ?? 420) + 24;
  }, []);

  const scrollByCard = useCallback(
    (direction: -1 | 1, wrap = false) => {
      const rail = railRef.current;
      if (!rail) return;
      const distance = getCardDistance();
      const maxScroll = rail.scrollWidth - rail.clientWidth;

      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 700);

      if (direction === 1) {
        if (rail.scrollLeft >= maxScroll - 16) {
          if (wrap) {
            rail.scrollTo({ left: 0, behavior: "smooth" });
          }
        } else {
          rail.scrollBy({ left: distance, behavior: "smooth" });
        }
      } else {
        if (rail.scrollLeft <= 16 && wrap) {
          rail.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
          rail.scrollBy({ left: -distance, behavior: "smooth" });
        }
      }
    },
    [getCardDistance]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const distance = getCardDistance();
      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 700);
      rail.scrollTo({ left: index * distance, behavior: "smooth" });
    },
    [getCardDistance]
  );

  // Setup auto-scroll interval
  const resetAutoScroll = useCallback(() => {
    if (autoScrollTimerRef.current) {
      clearInterval(autoScrollTimerRef.current);
      autoScrollTimerRef.current = null;
    }

    if (items.length <= 1) return;

    autoScrollTimerRef.current = setInterval(() => {
      if (isInteractingRef.current || document.hidden) return;
      scrollByCard(1, true);
    }, 4000);
  }, [items.length, scrollByCard]);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [resetAutoScroll]);

  // Update active index on scroll
  const handleScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const distance = getCardDistance();
    const index = Math.round(rail.scrollLeft / distance);
    setActiveIndex(Math.max(0, Math.min(items.length - 1, index)));

    // When the user scrolls manually, reset the auto-scroll timer to wait a full cycle
    if (!isProgrammaticScrollRef.current) {
      resetAutoScroll();
    }
  }, [getCardDistance, items.length, resetAutoScroll]);

  // Mouse Drag-to-scroll support
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left-click initiates drag
    if (e.button !== 0) return;
    const rail = railRef.current;
    if (!rail) return;

    setIsDragging(true);
    isInteractingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.pageX - rail.offsetLeft;
    dragScrollLeftRef.current = rail.scrollLeft;
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rail = railRef.current;
      if (!rail) return;
      const x = e.pageX - rail.offsetLeft;
      const walk = (x - dragStartXRef.current) * 1.2;
      if (Math.abs(walk) > 6) {
        hasDraggedRef.current = true;
      }
      rail.scrollLeft = dragScrollLeftRef.current - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isInteractingRef.current = false;
      resetAutoScroll();
      setTimeout(() => {
        hasDraggedRef.current = false;
      }, 60);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, resetAutoScroll]);

  return (
    <div
      className="flex flex-col gap-6"
      onMouseEnter={() => {
        isInteractingRef.current = true;
      }}
      onMouseLeave={() => {
        if (!isDragging) {
          isInteractingRef.current = false;
          resetAutoScroll();
        }
      }}
      onTouchStart={() => {
        isInteractingRef.current = true;
      }}
      onTouchEnd={() => {
        isInteractingRef.current = false;
        resetAutoScroll();
      }}
      onFocusCapture={() => {
        isInteractingRef.current = true;
      }}
      onBlurCapture={() => {
        isInteractingRef.current = false;
        resetAutoScroll();
      }}
    >
      <ul
        ref={railRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        className={cn(
          "-mx-6 flex gap-6 overflow-x-auto px-6 pb-4 scroll-pl-6 [scrollbar-width:none] md:-mx-10 md:px-10 md:scroll-pl-10 lg:-mx-16 lg:px-16 lg:scroll-pl-16 [&::-webkit-scrollbar]:hidden select-none",
          isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
        )}
      >
        {items.map((item, index) => (
          <li key={item.id} className="w-[86vw] shrink-0 snap-start sm:w-[420px]">
            <article
              className={cn(
                "group relative flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-7 shadow-[0_18px_50px_-30px_rgba(var(--color-primary-rgb),0.35)] sm:p-8",
                linkToDetail &&
                  "transition-[transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_28px_90px_-24px_rgba(var(--color-primary-rgb),0.6)]"
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">{item.industry}</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="text-2xl leading-[1.1] font-semibold tracking-[-0.025em] text-foreground">
                {linkToDetail ? (
                  <Link
                    href={`/case-studies/${item.slug}`}
                    onClick={(e) => {
                      if (hasDraggedRef.current) {
                        e.preventDefault();
                      }
                    }}
                    className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none group-focus-within:text-accent"
                  >
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
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
        <div className="flex items-center gap-4">
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            {items.length} {items.length === 1 ? "case study" : "case studies"}
          </p>
          {items.length > 1 && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    scrollToIndex(i);
                    resetAutoScroll();
                  }}
                  aria-label={`Go to case study ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeIndex ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground"
                  )}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              scrollByCard(-1, true);
              resetAutoScroll();
            }}
            aria-label="Previous case study"
            className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => {
              scrollByCard(1, true);
              resetAutoScroll();
            }}
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
