"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InfinityMark } from "@/components/sections/home/InfinityMark";

/**
 * Opening curtain / route loader:
 * Plays the hero glowing infinity neon animation centered on a pure black background.
 *
 * Plays smoothly on first load and on route transitions without any heavy video decoding,
 * network video requests, or layout lag.
 */
const PLAY_MS = 1050;

export function RouteCurtain() {
  const pathname = usePathname();
  // Which route the curtain has finished playing for
  const [donePath, setDonePath] = useState<string | null>(null);
  const done = donePath === pathname;

  useEffect(() => {
    // Reduced motion hides the curtain immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setDonePath(pathname), 0);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setDonePath(pathname);
    }, PLAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="route-curtain fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-300 pointer-events-none overflow-hidden"
      data-state={done ? "done" : "playing"}
    >
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6">
        <InfinityMark
          alwaysActive
          duration={3800}
          className="w-[82vw] max-w-[420px] sm:max-w-[540px] md:max-w-[660px] lg:max-w-[760px] h-auto drop-shadow-[0_0_36px_rgba(242,53,64,0.48)]"
        />
      </div>
    </div>
  );
}
