"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type HoverIndustry = {
  id: string;
  slug: string;
  name: string;
  headline: string;
  image: string;
};

/**
 * One industry row: number, name with its subheading beneath, and a
 * transparent infinity mark that floods red on hover. While the cursor moves
 * over the row a small photograph floats alongside it, spring-smoothed, then
 * shrinks away on leave. The image is decorative (aria-hidden) and
 * desktop-only, touch and keyboard users get the same link with the same
 * red highlight, and focusing a row reveals its photo too.
 */
function IndustryHoverRow({ industry, index }: { industry: HoverIndustry; index: number }) {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 220, damping: 24 });
  const springY = useSpring(cursorY, { stiffness: 220, damping: 24 });
  // Photo parks right-of-centre and drifts with the cursor, like a card
  // being held up next to the heading being read.
  const photoTop = useTransform(springY, [-0.5, 0.5], ["36%", "64%"]);
  const photoLeft = useTransform(springX, [-0.5, 0.5], ["60%", "72%"]);

  const trackCursor = (event: React.MouseEvent) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    cursorX.set((event.clientX - rect.left) / rect.width - 0.5);
    cursorY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <li className="border-b border-border">
      <Link
        ref={rowRef}
        href={`/industries/${industry.slug}`}
        onMouseMove={trackCursor}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="group relative grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 py-6 transition-colors duration-300 hover:bg-foreground/[0.035] focus-visible:bg-foreground/[0.035] focus-visible:outline-none sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-8 sm:py-8 lg:py-9"
      >
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="flex min-w-0 flex-col gap-2">
          <span className="text-2xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-foreground transition-colors duration-500 group-hover:text-accent group-focus-visible:text-accent sm:text-4xl lg:text-5xl">
            {industry.name}
          </span>
          <span className="max-w-xl text-sm leading-snug text-pretty text-muted-foreground sm:text-base">
            {industry.headline}
          </span>
          {industry.image && (
            <span className="mt-2 block h-24 w-40 overflow-hidden rounded-lg border border-border lg:hidden">
              <Image
                src={industry.image}
                alt=""
                aria-hidden="true"
                width={320}
                height={192}
                loading="lazy"
                sizes="160px"
                className="h-full w-full object-cover"
              />
            </span>
          )}
        </span>

        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-accent-foreground sm:size-14"
        >
          <ArrowUpRight className="size-5 text-accent transition-colors duration-300 group-hover:text-accent-foreground group-focus-visible:text-accent-foreground sm:size-6" />
        </span>

        {industry.image && (
          <motion.span
            aria-hidden="true"
            style={{ top: photoTop, left: photoLeft }}
            className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <motion.span
              initial={false}
              animate={{ scale: active ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="block h-40 w-56 overflow-hidden rounded-xl border border-border xl:h-48 xl:w-64"
            >
              <Image
                src={industry.image}
                alt=""
                width={512}
                height={384}
                loading="lazy"
                sizes="256px"
                /* `block`: an <img> is inline by default, so it sits on the text
                   baseline and leaves a few pixels of the container showing
                   under it, which read as a white line along the bottom edge. */
                className="block h-full w-full object-cover"
              />
            </motion.span>
          </motion.span>
        )}
      </Link>
    </li>
  );
}

/**
 * The seven industries as hover-reveal rows. Imagery comes from each
 * industry's own hero image (Firestore, or the topical demo map), nothing
 * is hardcoded here, so new photography flows through automatically.
 */
export function IndustryHoverList({ industries }: { industries: HoverIndustry[] }) {
  return (
    <ol className="border-t border-border">
      {industries.map((industry, index) => (
        <IndustryHoverRow key={industry.id} industry={industry} index={index} />
      ))}
    </ol>
  );
}
