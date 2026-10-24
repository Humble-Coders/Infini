"use client";

import { useEffect, useRef, type HTMLAttributes } from "react";

/**
 * A plain <div> that pauses every CSS animation inside it while it is off
 * screen. Infinite decorative loops (marquees, tickers, aurora drift) otherwise
 * keep compositing for the whole visit after the reader has scrolled past.
 *
 * The flag is written straight to the DOM (`data-offscreen`, read by a rule in
 * globals.css), not React state, so crossing the viewport edge never
 * re-renders. Server HTML has no flag, so content animates normally before
 * hydration. Reduced motion is already handled globally in globals.css.
 */
export function PauseOffscreen(props: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) delete el.dataset.offscreen;
      else el.dataset.offscreen = "true";
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} {...props} />;
}
