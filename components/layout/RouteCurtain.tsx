"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InfinityMark } from "@/components/sections/home/InfinityMark";

/**
 * Route Transition Curtain:
 * - Skipped on initial site load so the landing page renders immediately.
 * - Triggers on inner page changes as a brief black beat with the mark.
 * - Skipped entirely under prefers-reduced-motion.
 *
 * Nothing is mounted between navigations. The mark is a per-frame canvas, so
 * keeping it in the tree (even visibility-hidden) meant it drew every frame
 * for the whole visit. HOLD + FADE stays under 300ms so the curtain reads as
 * a transition, not a loading screen. FADE_MS matches `.route-curtain` in
 * globals.css.
 */
const HOLD_MS = 140;
const FADE_MS = 120;

type Phase = "idle" | "playing" | "fading";

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function RouteCurtain() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [prevPath, setPrevPath] = useState(pathname);
  const [phase, setPhase] = useState<Phase>("idle");

  // Synchronize state on pathname change during render (React recommended pattern)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (!isAdmin && !prevPath?.startsWith("/admin") && !prefersReducedMotion()) {
      setPhase("playing");
    }
  }

  // playing -> fading -> idle; a new navigation mid-fade restarts at playing.
  useEffect(() => {
    if (phase === "idle") return;
    const timer = window.setTimeout(
      () => setPhase(phase === "playing" ? "fading" : "idle"),
      phase === "playing" ? HOLD_MS : FADE_MS
    );
    return () => window.clearTimeout(timer);
  }, [phase, pathname]);

  // Admin routes require instant responses without transition curtain
  if (isAdmin || phase === "idle") {
    return null;
  }

  return (
    <div aria-hidden="true" className="route-curtain" data-state={phase === "playing" ? "playing" : "done"}>
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6">
        <InfinityMark
          alwaysActive
          duration={3600}
          className="w-[82vw] max-w-[420px] sm:max-w-[540px] md:max-w-[660px] lg:max-w-[760px] h-auto drop-shadow-[0_0_36px_rgba(242,53,64,0.48)]"
        />
      </div>
    </div>
  );
}
