"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/components/ui/utils";

/**
 * A vertical beam that traces the user's scroll position with a glowing dot
 * and a subtle gradient trail. Wrap content inside, the beam is positioned
 * absolutely on the left side of the container.
 */
export function TracingBeam({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Beam track */}
      <div className="pointer-events-none absolute left-6 top-0 h-full w-px bg-border sm:left-10">
        {/* Filled portion */}
        <motion.div
          className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-accent via-accent/60 to-transparent"
          style={{ scaleY: smoothProgress }}
        />
      </div>

      {/* Glowing dot */}
      <motion.div
        className="pointer-events-none absolute left-6 top-0 z-10 -translate-x-1/2 sm:left-10"
        style={{ top: smoothProgress }}
      >
        <motion.div
          className="size-3 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(var(--color-accent-rgb),0.6)]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Content with left padding for the beam */}
      <div className="relative z-[1] pl-14 sm:pl-24">{children}</div>
    </div>
  );
}

/**
 * A single block inside the TracingBeam layout, fades in as the user scrolls
 * into view. Use alternating `align="left"` / `align="right"` for the zigzag.
 */
export function TracingBeamItem({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === "left" ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("py-10 sm:py-14", className)}
    >
      {children}
    </motion.div>
  );
}
