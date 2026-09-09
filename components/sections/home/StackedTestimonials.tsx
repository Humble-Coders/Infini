"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

export type StackedTestimonial = {
  id: string;
  quote: string;
  personName: string;
  designation: string;
  company: string;
  logoUrl: string;
};

/** Fan geometry for the three visible cards: rotation, drift, scale, fade. */
const FAN = [
  { zIndex: 30, scale: 1, y: 0, x: 0, rotate: 0, opacity: 1 },
  { zIndex: 20, scale: 0.94, y: 10, x: -22, rotate: -7, opacity: 0.75 },
  { zIndex: 10, scale: 0.88, y: 18, x: 22, rotate: 7, opacity: 0.45 },
] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Split-spotlight testimonial feature: a fanned deck of monogram tiles on
 * the left, headline quote + attribution + arrows on the right. Next sends
 * the top card to the back of the fan, Prev pulls one forward, and the copy
 * crossfades to the new top card. Dark premium tiles on any band, red stars
 * and red attribution accents. Reduced motion is handled by the page-level
 * MotionProvider (transforms off, fades remain).
 */
export function StackedTestimonials({ items }: { items: StackedTestimonial[] }) {
  const [deck, setDeck] = useState(items);
  const [position, setPosition] = useState(0);

  const total = items.length;

  const nextCard = () => {
    setDeck((current) => {
      if (current.length < 2) return current;
      const [first, ...rest] = current;
      return [...rest, first!];
    });
    setPosition((current) => (total === 0 ? 0 : (current + 1) % total));
  };

  const prevCard = () => {
    setDeck((current) => {
      if (current.length < 2) return current;
      const last = current[current.length - 1]!;
      return [last, ...current.slice(0, -1)];
    });
    setPosition((current) => (total === 0 ? 0 : (current - 1 + total) % total));
  };

  const top = deck[0];

  return (
    <div className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Fanned visual deck */}
      <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-sm lg:max-w-md">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 size-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]"
        />
        {deck.slice(0, 3).map((card, index) => {
          const placement = FAN[index] ?? FAN[2];
          return (
            <motion.div
              key={card.id}
              layout
              initial={false}
              animate={{
                zIndex: placement.zIndex,
                scale: placement.scale,
                y: placement.y,
                x: placement.x,
                rotate: placement.rotate,
                opacity: placement.opacity,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
              className="absolute inset-6 sm:inset-10"
            >
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(var(--color-primary-rgb),0.28),transparent_60%)]"
                />
                {card.logoUrl ? (
                  <Image
                    src={card.logoUrl}
                    alt=""
                    width={160}
                    height={80}
                    loading="lazy"
                    className="relative max-h-20 w-auto max-w-[60%] object-contain brightness-0 invert"
                  />
                ) : (
                  <span aria-hidden="true" className="relative text-5xl font-semibold tracking-tight text-white/90 sm:text-6xl">
                    {initials(card.personName)}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content panel, centred whenever stacked, left-aligned in split view. */}
      <div className="flex min-w-0 flex-col items-center gap-7 text-center lg:items-start lg:text-left">
        <p aria-live="polite" className="font-mono text-sm tracking-[0.2em] text-muted-foreground tabular-nums">
          {total > 0 ? `${position + 1} / ${total}` : "0 / 0"}
        </p>

        <AnimatePresence mode="wait">
          {top && (
            <motion.div
              key={top.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex flex-col items-center gap-6 lg:items-start"
            >
              <div aria-label="Rated 5 out of 5" className="flex justify-center gap-1 lg:justify-start">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star key={star} aria-hidden="true" className="size-4 fill-accent text-accent" />
                ))}
              </div>

              <blockquote className="text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-foreground">
                &ldquo;{top.quote}&rdquo;
              </blockquote>

              <p className="flex flex-col gap-1">
                <span className="text-base font-semibold text-foreground">{top.personName}</span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  {top.designation} · {top.company}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 pt-1 lg:justify-start">
          <button
            type="button"
            onClick={prevCard}
            aria-label="Previous testimonial"
            className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={nextCard}
            aria-label="Next testimonial"
            className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
