"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Matches the internal industry list in IndustriesExplorer — queried at wheel-time, not held as a ref, since it's a sibling client component. */
const SCROLL_LIST_SELECTOR = "[data-industries-scroll-list]";

/**
 * True once the section fully occupies the viewport in the scroll direction
 * — either it's short enough to sit entirely on-screen, or (the usual case
 * here) it's taller than the viewport and currently spans edge to edge. The
 * hijack only engages in that state, so scrolling INTO or OUT OF the section
 * still feels like normal page scroll.
 */
function fillsViewport(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const epsilon = 1;

  if (rect.height <= viewportHeight) {
    return rect.top >= -epsilon && rect.bottom <= viewportHeight + epsilon;
  }
  return rect.top <= epsilon && rect.bottom >= viewportHeight - epsilon;
}

/**
 * Makes the whole section one wheel target: while any part of the internal
 * industry list hasn't been scrolled through yet, a wheel/trackpad gesture
 * anywhere over the section drives that list instead of the page (and
 * instead of Lenis, whose own wheel listener sits on `window` and never
 * sees the event once we stop it here). Once the list hits the edge in the
 * gesture's direction, the event is left alone and bubbles to Lenis/page
 * scroll as normal.
 */
export function IndustriesSectionScroll({ className, children }: { className?: string; children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    function onWheel(event: WheelEvent) {
      if (!section || !fillsViewport(section)) return;

      const list = section.querySelector<HTMLElement>(SCROLL_LIST_SELECTOR);
      if (!list) return;

      const maxScroll = list.scrollHeight - list.clientHeight;
      if (maxScroll <= 0) return;

      const goingDown = event.deltaY > 0;
      const atTop = list.scrollTop <= 0;
      const atBottom = list.scrollTop >= maxScroll - 1;
      if ((goingDown && atBottom) || (!goingDown && atTop)) return;

      event.preventDefault();
      event.stopPropagation();
      list.scrollTop += event.deltaY;
    }

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}
