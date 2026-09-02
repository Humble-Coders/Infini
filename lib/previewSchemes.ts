export const PREVIEW_SCHEMES = [
  { slug: "dark", label: "Current (dark/red)" },
  { slug: "emerald-noir", label: "Emerald noir (dark)" },
  { slug: "emerald-light", label: "Emerald light" },
  { slug: "slate-indigo", label: "Slate indigo" },
  { slug: "sand-charcoal", label: "Sand charcoal (light)" },
] as const;

export type PreviewSchemeSlug = (typeof PREVIEW_SCHEMES)[number]["slug"];
