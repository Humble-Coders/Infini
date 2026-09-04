"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import type { TechnologyStep } from "@/lib/types";

/**
 * The three MMP stages as a vertical sequence beside the lead photograph:
 * a red rule down the left fills with scroll progress so the process reads
 * as a line the reader travels along, and each stage fades in as it arrives.
 */
export function ProcessSteps({ steps }: { steps: TechnologyStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });

  return (
    <ol ref={ref} className="relative border-l border-border pl-8 sm:pl-10">
      <motion.span
        aria-hidden="true"
        style={{ scaleY: scrollYProgress }}
        className="absolute top-0 left-[-1px] h-full w-px origin-top bg-accent"
      />
      {steps.map((item, index) => (
        <motion.li
          key={item.step}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col gap-4 py-8 first:pt-0 last:pb-0"
        >
          <span
            aria-hidden="true"
            className="absolute top-8 left-[calc(-2rem-0.3rem)] size-2.5 rounded-full border-2 border-background bg-accent first:top-0 sm:left-[calc(-2.5rem-0.3rem)]"
            style={index === 0 ? { top: 0 } : undefined}
          />
          <span className="font-mono text-sm tracking-[0.1em] text-accent tabular-nums">{item.step}</span>
          <h3 className="text-2xl font-semibold tracking-[-0.025em] text-foreground sm:text-3xl">{item.title}</h3>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">{item.description}</p>
        </motion.li>
      ))}
    </ol>
  );
}
