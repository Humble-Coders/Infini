"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { IndustryDoc, WithId } from "@/lib/types";
import { ShowcaseCard } from "./ShowcaseCard";

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 60;

function circularOffset(itemIndex: number, current: number, count: number) {
  let diff = itemIndex - current;
  if (diff > count / 2) diff -= count;
  if (diff < -count / 2) diff += count;
  return diff;
}

const SLOT_STYLE: Record<-1 | 0 | 1, { x: string; scale: number; opacity: number; zIndex: number }> = {
  [-1]: { x: "-62%", scale: 0.8, opacity: 0.5, zIndex: 10 },
  0: { x: "0%", scale: 1, opacity: 1, zIndex: 20 },
  1: { x: "62%", scale: 0.8, opacity: 0.5, zIndex: 10 },
};

export function HeroShowcase({ industries }: { industries: WithId<IndustryDoc>[] }) {
  const showcaseCards = industries.map((industry) => ({
    id: industry.slug,
    industry: industry.name,
    headline: industry.hero.headline,
  }));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const cardCount = showcaseCards.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (nextIndex: number) => {
      setIndex(((nextIndex % cardCount) + cardCount) % cardCount);
    },
    [cardCount]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || prefersReducedMotion) return;
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, prefersReducedMotion, next]);

  const current = showcaseCards[index];
  if (cardCount === 0 || !current) return null;

  return (
    <div
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="relative flex h-[clamp(220px,32vw,340px)] w-full items-center justify-center"
        role="group"
        aria-roledescription="carousel"
        aria-label="Industries INFINI serves"
      >
        <button
          type="button"
          onClick={prev}
          aria-label="Previous industry"
          className="absolute left-1 z-30 flex size-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-background/80 sm:left-4"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_event, info) => {
            setPaused(false);
            if (info.offset.x <= -SWIPE_THRESHOLD_PX) next();
            else if (info.offset.x >= SWIPE_THRESHOLD_PX) prev();
          }}
        >
          {showcaseCards.map((card, cardIndex) => {
            const offset = circularOffset(cardIndex, index, cardCount);
            if (offset < -1 || offset > 1) return null;
            const slot = SLOT_STYLE[offset as -1 | 0 | 1];
            const isCurrent = offset === 0;

            return (
              <motion.div
                key={card.id}
                className="absolute"
                initial={false}
                animate={
                  prefersReducedMotion
                    ? { x: slot.x, scale: slot.scale, opacity: slot.opacity }
                    : slot
                }
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ zIndex: slot.zIndex }}
              >
                {isCurrent ? (
                  <ShowcaseCard
                    card={card}
                    index={index}
                    className="pointer-events-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => goTo(cardIndex)}
                    aria-label={`View ${card.industry}`}
                    tabIndex={-1}
                    className="block cursor-pointer"
                  >
                    <ShowcaseCard card={card} index={cardIndex} className="pointer-events-none" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <button
          type="button"
          onClick={next}
          aria-label="Next industry"
          className="absolute right-1 z-30 flex size-9 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors hover:bg-background/80 sm:right-4"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {`${index + 1} of ${cardCount}: ${current.industry}`}
      </p>

      <div className="flex items-center gap-2">
        {showcaseCards.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(slideIndex)}
            aria-label={`Go to ${slide.industry}`}
            aria-current={slideIndex === index}
            className={`h-1.5 rounded-full transition-all ${
              slideIndex === index ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
