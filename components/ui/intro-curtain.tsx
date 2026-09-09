"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { INFINITY_PATH } from "./infinity";

type Phase = "draw" | "fill" | "exit" | "done";

/**
 * Opening curtain: on every full page load a large red brand-infinity
 * boundary draws itself at 90% opacity, no fill, no text, holds a beat,
 * then the whole curtain lifts to reveal the site (~2.1s total).
 * Client-side navigations don't retrigger it, the root layout persists, so
 * it plays on load/reload only. Scroll is locked while it plays; under
 * reduced motion it renders nothing at all.
 */
export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("draw");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("fill"), 900),
      setTimeout(() => setPhase("exit"), 1400),
      setTimeout(() => setPhase("done"), 2250),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [phase]);

  if (reduce || phase === "done") return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ y: 0 }}
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background motion-reduce:hidden"
    >
      <svg viewBox="0 0 200 100" className="w-64 sm:w-[28rem]" role="presentation">
        {/* Boundary only, transparent inside, drawn at 90% opacity. */}
        <motion.path
          d={INFINITY_PATH}
          fill="none"
          stroke="var(--color-accent)"
          strokeOpacity={0.9}
          strokeWidth={2.5}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}
