export interface NewsSummary {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
}

// Empty until content lands via T5 (data layer) + T14 (news ticket).
// NewsSection renders its designed empty state against this array.
export const newsPosts: NewsSummary[] = [];

export const newsSectionCopy = {
  eyebrow: "Latest",
  heading: "News & insights.",
  emptyState: "Our first posts on treatment process, validation and industry standards are coming soon.",
};
