"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds before the entrance starts. */
  delay?: number;
  /** Rise distance in px; 0 disables the rise. */
  y?: number;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The standard section entrance: fade + rise, fired once when scrolled into
 * view. Use this instead of hand-rolling motion.divs so every section enters
 * the same way. Opacity and transform only, both compositor properties; the
 * old de-blur pass repainted a full-layer filter every frame. Under reduced
 * motion it is a plain opacity fade (MotionProvider already strips transforms).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce || y === 0 ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
