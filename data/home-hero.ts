export interface ShowcaseCard {
  id: string;
  industry: string;
  headline: string;
}

export const showcaseCards: ShowcaseCard[] = [
  {
    id: "cutting-tools",
    industry: "Cutting Tools",
    headline: "Cutting edges that hold their line under load",
  },
  {
    id: "aerospace",
    industry: "Aerospace",
    headline: "Fatigue-critical surfaces, verified before they fly",
  },
  {
    id: "medical-implants",
    industry: "Medical Implants",
    headline: "Contamination-free finishes for the human body",
  },
  {
    id: "forge-stamping-die",
    industry: "Forge, Stamping & Die",
    headline: "Dies that release cleaner and last longer runs",
  },
  {
    id: "gears-transmission",
    industry: "Gears & Transmission",
    headline: "Quieter mesh, lower friction, longer service life",
  },
];

export interface StatItemData {
  value: string;
  label: string;
}

export const stats: StatItemData[] = [
  { value: "7", label: "Industries served" },
  { value: "ISO 9001", label: "Certified treatment process" },
  { value: "< 0.1 µm Ra", label: "Achievable mirror-like finish" },
];

export const statsIntro =
  "Every component that leaves our tanks carries a finish engineers can measure and verify — not just a claim on a spec sheet.";
