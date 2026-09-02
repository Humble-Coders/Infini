export const PREVIEW_SCHEMES = [
  { slug: "dark", label: "Current (dark/red)" },
  { slug: "emerald-light", label: "Emerald light" },
  { slug: "sand-charcoal", label: "Sand charcoal (light)" },
  { slug: "mmp-industrial", label: "MMP industrial (blue accent)" },
] as const;

export type PreviewSchemeSlug = (typeof PREVIEW_SCHEMES)[number]["slug"];
