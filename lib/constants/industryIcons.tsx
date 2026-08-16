import { Bone, Box, Cog, Drill, Hammer, Layers3, Plane, type LucideProps } from "lucide-react";

/**
 * Icon choice per industry is a design decision, not admin-editable content
 * — Firestore's `industries` collection stores name/copy/order, not a React
 * component, so this stays a code-level lookup keyed by slug.
 *
 * Renders as a real, statically-declared component (rather than callers
 * doing `const Icon = getIndustryIcon(slug)` and using it as `<Icon />`) so
 * the icon choice can't be mistaken for a component being created at render
 * time — it's just one, picked by a prop.
 */
const INDUSTRY_ICONS: Record<string, typeof Drill> = {
  "cutting-tools": Drill,
  "forge-stamping-die": Hammer,
  "plastic-injection-molds": Box,
  "medical-implants": Bone,
  aerospace: Plane,
  "additive-manufacturing": Layers3,
  "gears-transmission": Cog,
};

export function IndustryIcon({ slug, ...props }: { slug: string } & LucideProps) {
  const Icon = INDUSTRY_ICONS[slug] ?? Box;
  return <Icon {...props} />;
}
