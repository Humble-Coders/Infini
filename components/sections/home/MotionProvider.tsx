"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * One switch for every framer-motion animation on the page: `reducedMotion="user"`
 * disables transform-based motion (and keeps opacity fades) whenever the OS
 * preference is set, so sections don't each re-implement the check — and SSR
 * markup stays identical to the client's first render.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
