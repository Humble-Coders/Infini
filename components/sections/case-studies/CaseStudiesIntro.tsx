"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";

const STAGGER_DELAY = 0.1;
const FALLBACK_HEADING = "Case studies\nthat prove impact.";
const FALLBACK_BODY = "Real engineering challenges. Measurable results across the industries we serve.";

/** Animated eyebrow/heading/body for the case-studies section — split out so the section itself can stay a server component. */
export function CaseStudiesIntro({ eyebrow, heading, body }: { eyebrow: string; heading?: string; body?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const headingLines = (heading || FALLBACK_HEADING).split("\n");
  const reveal = (index: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.5, delay: prefersReducedMotion ? 0 : index * STAGGER_DELAY },
  });

  return (
    <div className="flex max-w-xl flex-col gap-5">
      <motion.div {...reveal(0)}>
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
      </motion.div>
      <motion.h2
        {...reveal(1)}
        className="text-[clamp(2rem,7vw,3rem)] leading-[1.1] font-light tracking-tight text-foreground"
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
