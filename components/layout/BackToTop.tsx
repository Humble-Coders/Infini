"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";
import { cn } from "@/components/ui/utils";

/**
 * Back to top, for the long scroll on the home page.
 *
 * Scrolling is handed to Lenis rather than `window.scrollTo`. The site runs
 * Lenis in root mode, so it owns the scroll position; calling the native API
 * would fight it and land somewhere between the two. `useLenis` also gives the
 * scroll callback, which is where the button's visibility is decided, so the
 * component never adds a second scroll listener of its own.
 *
 * It appears after roughly two screens, far enough down that returning to the
 * top is a real journey, and it is a real `<button>` so it is reachable by
 * keyboard and announced properly.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  const lenis = useLenis(({ scroll }) => {
    setVisible(scroll > window.innerHeight * 2);
  });

  // No initial-position effect: the root layout disables scroll restoration and
  // forces the top on load, so every page starts at zero and the first Lenis
  // callback is the first time this can be true.

  return (
    <button
      type="button"
      onClick={() => lenis?.scrollTo(0, { duration: 1.1 })}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-5 bottom-5 z-50 flex size-12 items-center justify-center rounded-full",
        "border border-border bg-background/80 text-foreground backdrop-blur-md",
        "transition-all duration-300 ease-out",
        "hover:border-accent hover:text-accent",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        "sm:right-8 sm:bottom-8",
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowUp className="size-5" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
