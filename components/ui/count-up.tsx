"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CountUpProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Seconds for the full count. */
  duration?: number;
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Animated number that counts up once when scrolled into view (React Bits
 * CountUp-style). Grouped en-IN formatting. Server-renders the starting
 * value so there is no content shift; under reduced motion it jumps straight
 * to the final value with no animation.
 */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "", duration = 1.6, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  const format = (target: number) =>
    `${prefix}${new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(target)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!inView || reduce) {
      node.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
    // format is stable for fixed props; value/decimals/prefix/suffix covered via value + key inputs below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, decimals, prefix, suffix, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
