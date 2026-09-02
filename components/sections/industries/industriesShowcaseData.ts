export interface IndustryShowcaseItem {
  slug: string;
  name: string;
  summary: string;
}

/**
 * Placeholder content for the editorial industries showcase, shaped to match
 * a future `IndustryDoc`-backed feed 1:1 (slug/name/summary) so wiring this
 * component to Firestore later is a prop swap, not a rewrite.
 */
export const INDUSTRIES_SHOWCASE: IndustryShowcaseItem[] = [
  {
    slug: "aeronautical-space",
    name: "Aeronautical & Space",
    summary: "Precision finishing for airfoils, guide vanes, blisks and other critical aerospace components.",
  },
  {
    slug: "energy",
    name: "Energy",
    summary: "Surface optimization for turbine wheels, impellers, diffusers and high-performance energy components.",
  },
  {
    slug: "motorsports",
    name: "Motorsports",
    summary: "High-performance finishing for gears, crankshafts and precision drivetrain components.",
  },
  {
    slug: "additive-manufacturing",
    name: "Additive Manufacturing",
    summary: "Improving the surface quality and functional performance of additively manufactured components.",
  },
  {
    slug: "cutting-tools",
    name: "Cutting Tools",
    summary: "Precision finishing designed to improve cutting performance, wear resistance and tool life.",
  },
  {
    slug: "stamping-forging-injection-mold",
    name: "Stamping, Forging & Plastic Injection Mold",
    summary: "Advanced finishing for molds, dies, ejector pins, punches and high-wear tooling.",
  },
  {
    slug: "industrial-applications",
    name: "Industrial Applications",
    summary: "Surface finishing solutions for demanding industrial components and precision applications.",
  },
  {
    slug: "medical",
    name: "Medical",
    summary: "Ultra-precise finishing for prosthetic components, implants and other medical applications.",
  },
];
