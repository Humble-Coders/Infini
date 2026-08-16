"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

function subscribe(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** SSR has no matchMedia — default to "not reduced" server-side; the client snapshot corrects it on hydration, same as any other browser-only preference. */
function getServerSnapshot() {
  return false;
}

/**
 * Wraps the public site in Lenis smooth scroll. Explicitly disabled under
 * prefers-reduced-motion — Lenis intercepts wheel/touch input and animates
 * scroll position itself, so the CSS `scroll-behavior: auto !important`
 * fallback in globals.css doesn't reach it; this is the JS-level opt-out
 * the same rule expects everywhere else on the site.
 *
 * Uses useSyncExternalStore rather than useEffect+setState to read the
 * media query — subscribing to an external source with a consistent
 * snapshot is exactly what it's for, and it avoids the extra render pass
 * of setting state from inside an effect.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
