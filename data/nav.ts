export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/company" },
  {
    label: "Capabilities",
    href: "/capabilities",
    children: [
      { label: "The MMP Process", href: "/technology" },
      { label: "Validation", href: "/validation" },
      { label: "Deburring & Polishing", href: "/deburring-polishing" },
      { label: "Mirror-Like Finish", href: "/mirror-like-finish" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Cutting Tools", href: "/industries/cutting-tools" },
      { label: "Forge, Stamping & Die", href: "/industries/forge-stamping-die" },
      { label: "Plastic Injection Molds", href: "/industries/plastic-injection-molds" },
      { label: "Medical Implants", href: "/industries/medical-implants" },
      { label: "Aerospace", href: "/industries/aerospace" },
      { label: "Additive Manufacturing", href: "/industries/additive-manufacturing" },
      { label: "Gears & Transmission", href: "/industries/gears-transmission" },
    ],
  },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Certifications", href: "/certifications" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const footerLegalLinks: NavItem[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
