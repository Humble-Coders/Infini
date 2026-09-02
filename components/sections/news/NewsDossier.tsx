"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/components/ui/utils";

/** News data as it reaches the client dossier — a plain, serializable projection of `NewsDoc` computed server-side. */
export interface NewsIndexItem {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  dateLabel: string;
  readTime: string;
}

const AUTO_ROTATE_MS = 8000;
const RESUME_DELAY_MS = 10000;

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

export function NewsDossier({ news }: { news: NewsIndexItem[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(news.map((n) => n.category)))], [news]);
  const [activeCategory, setActiveCategory] = useState("All");
  // Track the featured pick by slug rather than index — filtering the category no longer needs a
  // reset effect, since a slug that fell out of the filtered list just falls back to index 0 below.
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [canAutoRotate, setCanAutoRotate] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const items = useMemo(
    () => (activeCategory === "All" ? news : news.filter((n) => n.category === activeCategory)),
    [news, activeCategory]
  );
  const total = items.length;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.slug === selectedSlug)
  );

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setSelectedSlug(items[((index % total) + total) % total].slug);
      setPaused(true);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS);
    },
    [items, total]
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => setCanAutoRotate(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!canAutoRotate || prefersReducedMotion || paused || total <= 1) return;
    const id = setInterval(() => {
      setSelectedSlug((current) => {
        const index = items.findIndex((item) => item.slug === current);
        const next = index === -1 ? 0 : (index + 1) % total;
        return items[next].slug;
      });
    }, AUTO_ROTATE_MS);
    return () => clearInterval(id);
  }, [canAutoRotate, items, paused, prefersReducedMotion, total]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    []
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
  };

  const active = items[activeIndex];
  const fadeTransition = { duration: prefersReducedMotion ? 0.01 : 0.4, ease: [0.16, 1, 0.3, 1] as const };
  const imageTransition = { duration: prefersReducedMotion ? 0.01 : 0.5, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={handleKeyDown}
      className="flex min-w-0 flex-col gap-6 sm:gap-8"
    >
      {/* Category filter — one scrollable line at every breakpoint, never a multi-row bar */}
      {categories.length > 2 && (
        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={isActive}
                className={cn(
                  "flex min-h-[44px] shrink-0 items-center rounded-full border px-4 text-xs font-medium tracking-[0.1em] whitespace-nowrap uppercase transition-colors",
                  isActive
                    ? "border-accent/60 bg-primary-muted text-accent"
                    : "border-border/60 text-muted-foreground hover:text-foreground/80 active:text-foreground/80"
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {!active ? (
        <p className="text-sm text-muted-foreground">No articles in this category yet.</p>
      ) : (
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1.9fr_1fr] lg:gap-12">
          {/* Featured article */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border/60 bg-background-elevated sm:aspect-[16/9]">
              <motion.div key={active.slug} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={imageTransition} className="absolute inset-0">
                {active.coverImage && (
                  <Image
                    src={active.coverImage}
                    alt={active.title}
                    fill
                    sizes="(min-width: 1024px) 65vw, 100vw"
                    className="object-cover"
                    priority
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 250"
                  className="pointer-events-none absolute inset-0 h-full w-full text-white"
                  opacity="0.85"
                >
                  <g className="hidden sm:inline">
                    <circle cx="352" cy="40" r="26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                    <path d="M352 14v10M352 56v10M326 40h10M368 40h10" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  </g>
                  <path d="M18 18v20M18 18h20" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
                  <circle cx="18" cy="230" r="1.6" fill="var(--color-accent)" />
                  <text
                    x="26"
                    y="234"
                    className="fill-current uppercase"
                    style={{ font: "600 8px var(--font-sans, ui-sans-serif)", letterSpacing: "0.14em" }}
                    opacity="0.85"
                  >
                    Ra 0.05 μm
                  </text>
                  <text
                    x="382"
                    y="234"
                    textAnchor="end"
                    className="fill-current"
                    style={{ font: "500 10px ui-monospace, monospace" }}
                    opacity="0.7"
                  >
                    {pad(activeIndex)} / {pad(total - 1)}
                  </text>
                </svg>

                <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-[10px] font-medium tracking-wide text-accent-foreground uppercase">
                  Featured
                </span>
              </motion.div>
            </div>

            <motion.div key={`text-${active.slug}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={fadeTransition} className="flex flex-col gap-3">
              <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{active.category}</span>
              <h3 className="text-balance text-xl leading-tight font-light text-foreground sm:text-2xl md:text-[1.75rem]">
                {active.title}
              </h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{active.excerpt}</p>
              <span className="font-mono text-xs tracking-[0.05em] text-muted-foreground/80 uppercase">
                {active.dateLabel} · {active.category} · {active.readTime}
              </span>
              <Link
                href={`/news/${active.slug}`}
                className="group mt-1 inline-flex min-h-[44px] w-fit items-center gap-2 border-b border-transparent text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent active:border-accent active:text-accent"
              >
                Read full article
                <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>

          {/* News index */}
          <div className="flex min-w-0 flex-col">
            <ul className="flex flex-col divide-y divide-border/60 border-y border-border/60">
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={item.slug}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-pressed={isActive}
                      aria-label={`Feature article ${pad(index)}: ${item.title}`}
                      className={cn(
                        "group flex min-h-[76px] w-full items-center gap-4 py-4 text-left transition-[transform,color] duration-300",
                        isActive
                          ? "text-foreground lg:translate-x-1.5"
                          : "text-muted-foreground hover:text-foreground/80 active:text-foreground/80 lg:hover:translate-x-1.5"
                      )}
                    >
                      <span className={cn("shrink-0 font-mono text-xs tabular-nums", isActive ? "text-accent" : "text-muted-foreground/60")}>
                        {pad(index)}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span
                          className={cn(
                            "text-[10px] font-medium tracking-[0.18em] uppercase",
                            isActive ? "text-accent" : "text-muted-foreground/70"
                          )}
                        >
                          {item.category}
                        </span>
                        <span className="line-clamp-2 text-sm leading-snug font-light">{item.title}</span>
                        <span className="font-mono text-[10px] tracking-[0.05em] text-muted-foreground/60">{item.dateLabel}</span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-300",
                          isActive ? "text-accent" : "text-muted-foreground/40 group-hover:translate-x-0.5"
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/news"
              className="group mt-6 inline-flex min-h-[44px] w-fit items-center gap-2 text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent active:text-accent"
            >
              View all news
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
