"use client";

import dynamic from "next/dynamic";
import type { CaseStudyShowcaseItem } from "@/components/case-studies/CaseStudyShowcase";

/**
 * Thin client boundary for the framer-motion-heavy sticky showcase.
 * `ssr: false` is only legal inside a Client Component, so the server page
 * imports this loader directly and the showcase (and framer-motion) is
 * deferred to the client bundle.
 */
const CaseStudyShowcase = dynamic(
  () => import("@/components/case-studies/CaseStudyShowcase").then((m) => m.CaseStudyShowcase),
  { ssr: false }
);

export function CaseStudyShowcaseLoader({
  caseStudies,
  industryNameById,
}: {
  caseStudies: CaseStudyShowcaseItem[];
  industryNameById?: Record<string, string | undefined> | Map<string, string | undefined>;
}) {
  return <CaseStudyShowcase caseStudies={caseStudies} industryNameById={industryNameById} />;
}

