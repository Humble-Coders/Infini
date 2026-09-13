"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function subscribe(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * Post-mount flag as an external store: server snapshot false, client
 * snapshot true. The subscription fires once on mount, so the server HTML
 * and the first client render always agree (see below).
 */
function subscribeMounted(callback: () => void) {
  callback();
  return () => {};
}

/** Component to reset scroll on route change */
function RouteScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Mounted gate: the server always renders the Lenis branch, and the
  // client's first render must too. Without this, a reduced-motion device
  // renders the fragment branch on its first client pass where the server
  // had ReactLenis, remounting the entire app subtree with shifted useIds
  // and tripping a hydration mismatch on every page.
  const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
  const reducedMotion = prefersReducedMotion && mounted;

  if (reducedMotion) {
    return (
      <>
        <RouteScrollReset />
        {children}
      </>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <RouteScrollReset />
      {children}
    </ReactLenis>
  );
}
