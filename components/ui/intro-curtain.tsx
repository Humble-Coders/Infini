"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { InfinityMark } from "@/components/sections/home/InfinityMark";

type Phase = "play" | "exit" | "done";

/**
 * Opening curtain: on full page load, plays the glowing hero infinity neon mark
 * centered on black, holds briefly, and then lifts to reveal the site.
 */
export function IntroCurtain() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("play");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("exit"), 1100),
      setTimeout(() => setPhase("done"), 1550),
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
      initial={{ opacity: 1 }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black motion-reduce:hidden pointer-events-none"
    >
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6">
        <InfinityMark
          alwaysActive
          duration={3800}
          className="w-[82vw] max-w-[420px] sm:max-w-[540px] md:max-w-[660px] lg:max-w-[760px] h-auto drop-shadow-[0_0_36px_rgba(242,53,64,0.48)]"
        />
      </div>
    </motion.div>
  );
}
