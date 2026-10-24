"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * Gate in front of SmokeCursor. The cursor is a mouse-only flourish, so on
 * touch / coarse-pointer devices and under reduced motion it never mounts and
 * its chunk (framer-motion springs included) is never downloaded. The dynamic
 * import only fires once the media query passes on the client.
 */
const SmokeCursor = dynamic(() => import("./smoke-cursor").then((m) => m.SmokeCursor), { ssr: false });

const QUERY = "(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function SmokeCursorLazy() {
  // Server snapshot false, so hydration always matches (nothing rendered).
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
  return enabled ? <SmokeCursor /> : null;
}
