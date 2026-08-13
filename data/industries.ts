import {
  Bone,
  Box,
  Cog,
  Drill,
  Hammer,
  Layers3,
  Plane,
  type LucideIcon,
} from "lucide-react";

export interface Industry {
  slug: string;
  name: string;
  icon: LucideIcon;
}

export const industries: Industry[] = [
  { slug: "aerospace", name: "Aerospace", icon: Plane },
  { slug: "forge-stamping-die", name: "Forge, Stamping & Die", icon: Hammer },
  { slug: "additive-manufacturing", name: "Additive Manufacturing", icon: Layers3 },
  { slug: "medical-implants", name: "Medical Implants", icon: Bone },
  { slug: "plastic-injection-molds", name: "Plastic Injection Molds", icon: Box },
  { slug: "cutting-tools", name: "Cutting Tools", icon: Drill },
  { slug: "gears-transmission", name: "Gears & Transmission", icon: Cog },
];

export const industriesSectionCopy = {
  eyebrow: "Markets We Service",
  heading:
    "Working from its own treatment labs, INFINI is poised to provide manufacturers with custom finishes to meet their specifications.",
};
