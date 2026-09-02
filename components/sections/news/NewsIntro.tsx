"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

const STAGGER_DELAY = 0.1;
const FALLBACK_HEADING = "Latest research.\nReal impact.";
const FALLBACK_BODY =
  "Explore our latest research, technical studies, engineering insights and developments in precision surface technology.";

/** Centered editorial header for the News & Insights section — a red rule flanks the eyebrow on both sides. */
export function NewsIntro({ eyebrow, heading, body }: { eyebrow: string; heading?: string; body?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const headingLines = (heading || FALLBACK_HEADING).split("\n");
  const reveal = (index: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.5, delay: prefersReducedMotion ? 0 : index * STAGGER_DELAY },
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
      <motion.span
        {...reveal(0)}
        className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-accent uppercase"
      >
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        {eyebrow}
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
      </motion.span>

      <motion.h2
        {...reveal(1)}
        className="text-balance text-[clamp(2.1rem,9vw,3.5rem)] leading-[1.05] font-light tracking-tight text-foreground"
      >
        {headingLines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            <span className={index === headingLines.length - 1 && headingLines.length > 1 ? "text-accent" : undefined}>
              {line}
            </span>
          </Fragment>
        ))}
      </motion.h2>

      <motion.p {...reveal(2)} className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {body || FALLBACK_BODY}
      </motion.p>
    </div>
  );
}
