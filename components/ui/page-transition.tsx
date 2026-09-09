"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { INFINITY_PATH } from "./infinity";

type Phase = "idle" | "playing";

/** Glyph swell: full curves visible at the hold size, then dissolving outward (+5% end size). */
const GLYPH_SCALE = [0, 2.4, 3.57];
const GLYPH_SCALE_TIMES = [0, 0.65, 1];
const GLYPH_OPACITY = [0, 1, 1, 0];
const GLYPH_OPACITY_TIMES = [0, 0.12, 0.68, 1];
const GLYPH_DURATION = 1.15;

/** Veil: fully dark from the very first frame (no preview flash), holds, then opens. */
const VEIL_OPACITY = [1, 1, 0];
const VEIL_OPACITY_TIMES = [0, 0.78, 1];
const SEQUENCE_DURATION = 1.5;

/**
 * Route-change wipe, mmptechnology-style but ours: the moment an internal
 * link is clicked a red glowing infinity grows from screen centre to a
 * frame-filling hold, curves fully visible, then keeps swelling toward
 * the corners while dissolving, as the veil opens onto the new page. One
 * forward-only sequence (~1.5s), never restarted mid-flight.
 *
 * The App Router exposes no navigation-start event, so the sequence starts
 * on internal-link clicks and on pathname landings (back/forward buttons);
 * whichever fires first wins and the other becomes a no-op, which is what
 * keeps it flicker-free. Modifier keys, new tabs, downloads, external links
 * and hash jumps pass through untouched. The first mount never plays:
 * IntroCurtain owns the opening paint. A safety timer guarantees the veil
 * can never trap the page, and reduced motion renders nothing at all.
 */
export function PageTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const firstMount = useRef(true);
  const finishTimer = useRef<number | null>(null);

  const clearFinishTimer = () => {
    if (finishTimer.current !== null) {
      window.clearTimeout(finishTimer.current);
      finishTimer.current = null;
    }
  };

  useEffect(() => () => clearFinishTimer(), []);

  const start = () => {
    setPhase((current) => {
      if (current !== "idle") return current;
      clearFinishTimer();
      finishTimer.current = window.setTimeout(() => setPhase("idle"), SEQUENCE_DURATION * 1000);
      return "playing";
    });
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (
        !href.startsWith("/") ||
        href.startsWith("//") ||
        href.includes("#") ||
        anchor.hasAttribute("download") ||
        anchor.target === "_blank"
      ) {
        return;
      }
      start();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (phase !== "playing") return;
    const safety = window.setTimeout(() => setPhase("idle"), SEQUENCE_DURATION * 1000 + 1000);
    return () => window.clearTimeout(safety);
  }, [phase]);

  if (reduce || phase === "idle") return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: VEIL_OPACITY }}
      transition={{ duration: SEQUENCE_DURATION, times: VEIL_OPACITY_TIMES, ease: "easeInOut" }}
      className="fixed inset-0 z-[95] bg-background"
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden">
        <motion.svg
          viewBox="0 0 200 100"
          className="w-72 will-change-transform sm:w-96"
          role="presentation"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: GLYPH_SCALE, opacity: GLYPH_OPACITY }}
          transition={{
            scale: { duration: GLYPH_DURATION, times: GLYPH_SCALE_TIMES, ease: "easeOut" },
            opacity: { duration: GLYPH_DURATION, times: GLYPH_OPACITY_TIMES, ease: "easeInOut" },
          }}
          style={{
            filter:
              "drop-shadow(0 0 18px rgba(var(--color-accent-rgb),0.9)) drop-shadow(0 0 60px rgba(var(--color-primary-rgb),0.55))",
          }}
        >
          <path
            d={INFINITY_PATH}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}
