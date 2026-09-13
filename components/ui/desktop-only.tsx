"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/**
 * Renders children on capable desktop viewports only: wide screen with a fine
 * pointer (mouse/trackpad). Phones, tablets and touch laptops get nothing —
 * no download, no WebGL context, no per-frame GPU cost.
 *
 * Used for decorative heavy layers (three.js particle fields) that would turn
 * a phone into a slideshow. The mounted gate mirrors SmokeCursor: the server
 * renders null and the client's first render must be null too, otherwise the
 * subtree mounts with shifted useIds and trips a hydration mismatch.
 */
const QUERY = "(min-width: 1024px) and (pointer: fine)";

function subscribeQuery(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function subscribeMounted(callback: () => void) {
  callback();
  return () => {};
}

export function DesktopOnly({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const matches = useSyncExternalStore(
    subscribeQuery,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
  if (!mounted || !matches) return null;
  return <>{children}</>;
}
