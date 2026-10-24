"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds before the entrance starts. */
  delay?: number;
  /** Rise distance in px; 0 disables the rise. */
  y?: number;
};

/*
 * One IntersectionObserver shared by every Reveal on the page. Each element
 * is shown once and then unobserved.
 */
let sharedObserver: IntersectionObserver | null = null;

function observe(element: Element) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          sharedObserver?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
  }
  sharedObserver.observe(element);
  return () => sharedObserver?.unobserve(element);
}

/**
 * The standard section entrance: fade + rise, fired once when scrolled into
 * view. Use this instead of hand-rolling animations so every section enters
 * the same way.
 *
 * Plain CSS transitions on opacity and transform (compositor-only), driven by
 * a single shared IntersectionObserver. This used to be a framer-motion
 * component per section, which pulled ~130 KB of animation runtime onto
 * every page and cost noticeable main-thread time on phones. Reduced motion
 * is handled in globals.css (`.reveal`).
 */
export function Reveal({ children, className, delay = 0, y = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      element.dataset.revealed = "true";
      return;
    }
    return observe(element);
  }, []);

  return (
    <div
      ref={ref}
      className={className ? `reveal ${className}` : "reveal"}
      style={{ "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  );
}
