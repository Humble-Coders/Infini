"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

function subscribeFinePointer(callback: () => void) {
  const query = window.matchMedia("(pointer: fine)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/**
 * Ambient red-smoke cursor: a small glowing core that tracks the pointer
 * tightly plus a larger smoke wisp that lags behind on a looser spring.
 * Performance notes: cursor position flows through motion values (no React
 * re-renders per mousemove), all movement is GPU transform-only, and the
 * listener is passive. Interaction-safe: the layer is pointer-events-none so
 * every click, drag and text selection passes straight through, and the
 * native cursor stays visible. Renders only on fine-pointer devices (mice,
 * trackpads), touch screens get nothing, and nothing at all under reduced
 * motion.
 */
export function SmokeCursor() {
  const reduce = useReducedMotion();
  // Server snapshot is always false so hydration matches; after hydration
  // the live query takes over (and follows device changes for free).
  const finePointer = useSyncExternalStore(
    subscribeFinePointer,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const coreX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const coreY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const smokeX = useSpring(x, { stiffness: 90, damping: 18, mass: 0.9 });
  const smokeY = useSpring(y, { stiffness: 90, damping: 18, mass: 0.9 });

  useEffect(() => {
    if (!finePointer) return;
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [finePointer, x, y]);

  if (reduce || !finePointer) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] motion-reduce:hidden">
      <motion.div style={{ x: smokeX, y: smokeY }} className="absolute top-0 left-0 will-change-transform">
        <div className="h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[64px] mix-blend-screen" />
      </motion.div>
      <motion.div style={{ x: coreX, y: coreY }} className="absolute top-0 left-0 will-change-transform">
        <div className="size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_4px_rgba(var(--color-accent-rgb),0.55)]" />
      </motion.div>
    </div>
  );
}
