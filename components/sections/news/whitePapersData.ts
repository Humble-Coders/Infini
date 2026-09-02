/**
 * Placeholder white-paper archive — no `whitePapers` Firestore collection exists yet, so this
 * stands in until real publications are wired up (see CaseStudiesSection's DEMO_CASE_STUDIES for
 * the same pattern). Titles are plausible placeholders, not real published research; swap this
 * array for a CMS-backed accessor without touching WhitePapers.tsx.
 */
export interface WhitePaper {
  id: string;
  title: string;
  description: string;
  image: string;
  fileSize: string;
  url: string;
}

export const WHITE_PAPERS: WhitePaper[] = [
  {
    id: "wp-1",
    title: "Surface Integrity and Fatigue Performance in Aerospace Applications",
    description: "A comprehensive analysis of surface finishing and its impact on component performance.",
    image: "https://picsum.photos/seed/infini-wp-aerospace/900/700",
    fileSize: "2.4 MB · PDF",
    url: "#",
  },
  {
    id: "wp-2",
    title: "Precision Surface Engineering for Medical Implants",
    description: "How controlled surface treatment supports biocompatibility and long-term implant reliability.",
    image: "https://picsum.photos/seed/infini-wp-medical/900/700",
    fileSize: "1.8 MB · PDF",
    url: "#",
  },
  {
    id: "wp-3",
    title: "Improving Tool Life with Advanced Superfinishing",
    description: "Findings on cutting-edge geometry and wear resistance under sustained production loads.",
    image: "https://picsum.photos/seed/infini-wp-tooling/900/700",
    fileSize: "2.1 MB · PDF",
    url: "#",
  },
  {
    id: "wp-4",
    title: "Surface Engineering for Energy Turbine Components",
    description: "Controlled finishing strategies for components operating under demanding thermal cycles.",
    image: "https://picsum.photos/seed/infini-wp-energy/900/700",
    fileSize: "2.6 MB · PDF",
    url: "#",
  },
];
