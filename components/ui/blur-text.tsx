"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/components/ui/utils";

type BlurTextProps = {
  /** Supports "\n" line breaks. Inherits font styling from the parent. */
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Set the final word in the serif italic brand accent (matches EmphasisHeading). */
  accentLast?: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Word-by-word fade-and-rise entrance (React Bits BlurText-style, minus the
 * blur: animating `filter` repaints every word every frame on phone GPUs),
 * fired once when scrolled into view. Inherits type styling, wrap it in the
 * real heading element so SEO and heading order are untouched. Under reduced
 * motion it renders as a plain opacity fade with no rise.
 *
 * Words start at opacity 0 until hydration, so never use this for an
 * above-the-fold h1; that text must be visible in the server HTML.
 */
export function BlurText({ text, className, delay = 0, stagger = 0.04, accentLast = false }: BlurTextProps) {
  const reduce = useReducedMotion();
  const lines = text.split("\n").map((line) => line.split(/\s+/).filter(Boolean));
  const total = lines.reduce((sum, words) => sum + words.length, 0);
  const items = lines.flatMap((words, lineIndex) =>
    words.map((word, wordIndex) => ({ word, breakBefore: lineIndex > 0 && wordIndex === 0 })),
  );

  return (
    <span className={className} aria-label={text}>
      {items.map((item, index) => (
        <Fragment key={`${item.word}-${index}`}>
          {item.breakBefore && <br />}
          <motion.span
            aria-hidden="true"
            className={cn(
              "inline-block will-change-[transform,opacity]",
              accentLast && index === total - 1 && "font-serif font-normal italic text-accent",
            )}
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: delay + index * stagger, ease: EASE }}
          >
            {item.word}
          </motion.span>
          {index < total - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
