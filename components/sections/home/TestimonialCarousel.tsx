"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { cn } from "@/components/ui/utils";

/** Minimal review shape: the carousel needs words and attribution, nothing else. */
export interface CarouselTestimonial {
  id: string;
  quote: string;
  personName: string;
  designation: string;
  company: string;
}

/** One full autoplay rotation per testimonial. */
const AUTOPLAY_MS = 4500;
/** Horizontal pointer travel that counts as a swipe. */
const SWIPE_PX = 70;
/** Lateral step between neighbouring cards, in percent of card width. */
const STEP_PCT = 74;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Signed distance from the active card, wrapped into [-total/2, total/2]. */
function signedOffset(item: number, active: number, total: number) {
  let d = (item - active) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

/**
 * The voice-of-customer fan: up to five overlapping review tiles with the
 * active one front and centre, side tiles angled away, scaled down and dimmed.
 * Rotates automatically; side tiles are clickable shortcuts, and the stage
 * answers to swipe, arrows, dots and keyboard. Hover or keyboard focus holds
 * the rotation; hidden tabs and reduced-motion devices get a manual fan.
 */
export function TestimonialCarousel({ items }: { items: CarouselTestimonial[] }) {
  const total = items.length;
  const [index, setIndex] = useState(0);
  const [focusPaused, setFocusPaused] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const paused = focusPaused || tabHidden;
  const autoplay = total > 1 && !reduceMotion && !paused;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex((next + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, next]);

  // Focus holds the rotation only briefly: after a click or keyboard stop,
  // focus stays inside the carousel and would stall it forever. Ten seconds
  // after the last manual move it resumes on its own.
  useEffect(() => {
    if (!focusPaused) return;
    const timer = window.setTimeout(() => setFocusPaused(false), 10000);
    return () => window.clearTimeout(timer);
  }, [focusPaused, index]);

  if (total === 0) return null;
  const current = items[index]!;

  const arrowClass =
    "flex size-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") prev();
      }}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusPaused(false);
      }}
      onPointerDown={(event) => {
        swipeStartX.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (swipeStartX.current === null) return;
        const dx = event.clientX - swipeStartX.current;
        swipeStartX.current = null;
        if (dx < -SWIPE_PX) next();
        else if (dx > SWIPE_PX) prev();
      }}
      className="flex w-full touch-pan-y flex-col items-center gap-8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* Fan stage with no box of its own: the tiles bleed past the viewport
          edge naturally while the section's overflow-x-clip keeps the page
          itself from scrolling sideways. Outer tiles dissolve (fade + blur)
          instead of ending in a hard slice. */}
      <div className="relative h-[370px] w-full sm:h-[390px]" style={{ perspective: 1200 }}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[110px]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {items.map((item, position) => {
            const offset = signedOffset(position, index, total);
            const distance = Math.abs(offset);
            const visible = distance <= 2;
            const active = offset === 0;
            return (
              <motion.article
                key={item.id}
                initial={false}
                animate={{
                  x: `${offset * STEP_PCT}%`,
                  scale: 1 - Math.min(distance * 0.14, 0.32),
                  rotateY: offset * -16,
                  opacity: visible ? 1 - distance * 0.32 : 0,
                  filter: distance >= 2 ? "blur(3px) brightness(0.55)" : "blur(0px) brightness(1)",
                }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                aria-hidden={!active}
                onClick={() => {
                  if (!active) goTo(position);
                }}
                style={{ zIndex: 20 - distance }}
                className={cn(
                  "absolute flex h-[310px] w-[82vw] max-w-[300px] cursor-pointer flex-col justify-center gap-4 overflow-hidden rounded-3xl border bg-gradient-to-br from-neutral-800 via-neutral-900 to-black p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] transition-colors sm:h-[330px] sm:max-w-[340px] sm:p-7",
                  active
                    ? "cursor-default border-accent/60 shadow-[0_40px_100px_-30px_rgba(var(--color-accent-rgb),0.45)]"
                    : "border-white/10 hover:border-accent/40"
                )}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_15%,rgba(var(--color-primary-rgb),0.28),transparent_60%)]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 right-3 font-serif text-[6rem] leading-none text-white/10 select-none"
                >
                  &rdquo;
                </span>

                <div aria-label="Rated 5 out of 5" className="relative flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} aria-hidden="true" className="size-3.5 fill-accent text-accent" />
                  ))}
                </div>

                <blockquote className="relative line-clamp-6 text-base leading-relaxed font-medium text-balance text-white/90 sm:text-lg">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <div className="relative flex items-center gap-3 border-t border-white/10 pt-4">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold tracking-tight text-accent"
                  >
                    {initials(item.personName)}
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5 text-left">
                    <span className="truncate text-sm font-semibold text-white">{item.personName}</span>
                    <span className="truncate font-mono text-[10px] tracking-[0.14em] text-white/50 uppercase">
                      {item.designation} · {item.company}
                    </span>
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      {/* Live attribution for screen readers as the fan turns. */}
      <p aria-live="polite" className="sr-only">
        Showing testimonial {index + 1} of {total}: {current.personName}, {current.company}.
      </p>

      {/* Controls: arrows, dots, counter. */}
      <div className="flex items-center gap-4 sm:gap-5">
        <button type="button" onClick={prev} aria-label="Previous testimonial" className={arrowClass}>
          <ArrowLeft className="size-4" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2" role="group" aria-label="Choose testimonial">
          {items.map((item, position) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(position)}
              aria-label={`Show testimonial ${position + 1} from ${item.company}`}
              aria-current={position === index ? "true" : undefined}
              className="flex h-6 w-6 cursor-pointer items-center justify-center"
            >
              <span
                className={cn(
                  "block rounded-full transition-all duration-300",
                  position === index ? "h-2 w-6 bg-accent" : "size-2 bg-border hover:bg-muted-foreground"
                )}
              />
            </button>
          ))}
        </div>

        <button type="button" onClick={next} aria-label="Next testimonial" className={arrowClass}>
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>

      <p aria-hidden="true" className="font-mono text-xs tracking-[0.2em] text-muted-foreground tabular-nums">
        {index + 1} / {total}
      </p>
    </div>
  );
}
