"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/components/ui/utils";

/**
 * Back to top, for the long scroll on the home page.
 *
 * It appears after roughly two screens, far enough down that returning to the
 * top is a real journey, and it is a real `<button>` so it is reachable by
 * keyboard and announced properly.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > window.innerHeight * 2);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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
