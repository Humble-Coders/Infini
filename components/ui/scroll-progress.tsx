"use client";

import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin red scroll-progress bar pinned to the very top of the viewport.
 * Spring-smoothed so it glides rather than jittering with the scroll.
 * Decorative (aria-hidden); zero layout cost, fixed positioning.
 */
export function ScrollProgress() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 130, damping: 28, mass: 0.4 });

  if (isAdmin) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-accent to-primary"
    />
  );
}
