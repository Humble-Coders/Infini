"use client";

import dynamic from "next/dynamic";

/**
 * Client-only lazy shell around the three.js particle field. BenefitsSection
 * is a server component, where next/dynamic forbids `ssr: false` — so the
 * dynamic boundary lives here instead. Same visual output, but the 3D engine
 * leaves the initial bundle and loads on the client after first paint.
 */
export const AntigravityLazy = dynamic(() => import("./antigravity").then((m) => m.Antigravity), {
  ssr: false,
});
