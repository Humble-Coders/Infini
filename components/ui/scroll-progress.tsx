"use client";

import { useEffect, useRef } from "react";

/**
 * Thin red scroll-progress bar pinned to the very top of the viewport.
 * Decorative (aria-hidden); fixed positioning, transform-only updates, at
 * most one write per animation frame from a passive scroll listener. A
 * short CSS transition on the transform keeps it gliding rather than
 * jittering. (It used framer-motion's spring; that pulled the whole
 * animation runtime onto every page for one bar.)
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{ transform: "scaleX(0)" }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-accent to-primary transition-transform duration-150 ease-out motion-reduce:transition-none"
    />
  );
}
