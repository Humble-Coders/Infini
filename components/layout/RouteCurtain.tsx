"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { InfinityMark } from "@/components/sections/home/InfinityMark";

/**
 * Route Transition Curtain:
 * - Skipped on initial site load so the landing page renders immediately.
 * - Triggers cleanly on inner page changes with zero stutter or duplicate loops.
 */
const DISPLAY_DURATION_MS = 500;

export function RouteCurtain() {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const [active, setActive] = useState(false);

  // Synchronize state on pathname change during render (React recommended pattern)
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setActive(true);
  }

  // Manage duration timer when curtain is active
  useEffect(() => {
    if (!active) return;

    const timer = window.setTimeout(() => {
      setActive(false);
    }, DISPLAY_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [active, pathname]);

  return (
    <div
      aria-hidden="true"
      className="route-curtain fixed inset-0 z-[200] flex items-center justify-center bg-black transition-opacity duration-300 pointer-events-none overflow-hidden"
      data-state={active ? "playing" : "done"}
    >
      <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6">
        <InfinityMark
          alwaysActive={active}
          duration={3600}
          className="w-[82vw] max-w-[420px] sm:max-w-[540px] md:max-w-[660px] lg:max-w-[760px] h-auto drop-shadow-[0_0_36px_rgba(242,53,64,0.48)]"
        />
      </div>
    </div>
  );
}
