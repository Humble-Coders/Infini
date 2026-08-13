export interface CaseStudySummary {
  slug: string;
  title: string;
  industry: string;
  summary: string;
}

// Empty until content lands via T5 (data layer) + T13 (case studies ticket).
// CaseStudiesSection renders its designed empty state against this array.
export const caseStudies: CaseStudySummary[] = [];

export const caseStudiesSectionCopy = {
  eyebrow: "Proven Work",
  heading: "Selected case studies.",
  emptyState:
    "We're publishing our first case studies shortly. In the meantime, tell us about your components and we'll walk you through comparable work directly.",
};
