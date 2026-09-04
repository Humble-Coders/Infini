export interface ApplicationItem {
  slug: string;
  name: string;
  description: string;
  benefit: string;
}

export interface IndustryApplications {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  applications: ApplicationItem[];
}

/**
 * Placeholder content for the Application Explorer, shaped so a future
 * Firestore-backed feed (industry -> applications, same field names) is a
 * prop swap rather than a rewrite.
 */
export const APPLICATIONS_BY_INDUSTRY: IndustryApplications[] = [
  {
    slug: "aeronautical-space",
    name: "Aeronautical & Space",
    shortName: "Aerospace",
    description:
      "Surface treatment for components where weight, fatigue life and aerodynamic performance are inseparable from finish quality.",
    applications: [
      {
        slug: "airfoils",
        name: "Airfoils",
        description: "Precision surface finishing for critical aerodynamic components.",
        benefit: "Improved surface quality • Reduced friction • Consistent finish",
      },
      {
        slug: "guide-vanes",
        name: "Guide Vanes",
        description: "Controlled finishing for vanes that direct high-velocity airflow through the engine core.",
        benefit: "Reduced drag • Uniform roughness • Extended fatigue life",
      },
      {
        slug: "blisks",
        name: "Blisks",
        description: "Uniform surface treatment across complex blisk geometries without altering critical dimensions.",
        benefit: "No dimensional drift • Full-surface access • Fatigue resistance",
      },
    ],
  },
  {
    slug: "energy",
    name: "Energy",
    shortName: "Energy",
    description:
      "Finishing that holds up inside turbines and rotating assemblies running at extreme speed and temperature.",
    applications: [
      {
        slug: "turbine-wheels",
        name: "Turbine Wheels",
        description: "Surface optimization for turbine wheels operating under extreme rotational and thermal load.",
        benefit: "Reduced stress risers • Improved flow efficiency",
      },
      {
        slug: "impellers",
        name: "Impellers",
        description: "Precision finishing across impeller vanes to improve flow characteristics and service life.",
        benefit: "Smoother flow paths • Reduced cavitation risk",
      },
      {
        slug: "diffusors",
        name: "Diffusors",
        description: "Controlled surface treatment for diffusor components in high-performance energy systems.",
        benefit: "Consistent roughness • Improved efficiency",
      },
    ],
  },
  {
    slug: "motorsports",
    name: "Motorsports",
    shortName: "Motorsports",
    description: "High-performance finishing for the drivetrain components where friction and fatigue decide races.",
    applications: [
      {
        slug: "gears",
        name: "Gears",
        description: "High-performance finishing for gear tooth flanks under repeated high-load cycles.",
        benefit: "Reduced friction • Improved wear resistance",
      },
      {
        slug: "crankshafts",
        name: "Crankshafts",
        description: "Precision surface treatment for crankshaft journals and fillets.",
        benefit: "Extended fatigue life • Reduced friction losses",
      },
    ],
  },
  {
    slug: "additive-manufacturing",
    name: "Additive Manufacturing",
    shortName: "Additive Mfg.",
    description: "Turning as-printed surfaces into finishes that perform, without altering the part's geometry.",
    applications: [
      {
        slug: "additive-components",
        name: "Additive Manufactured Components",
        description: "Improving the surface quality and functional performance of additively manufactured parts.",
        benefit: "Removed print texture • Improved fatigue performance",
      },
    ],
  },
  {
    slug: "cutting-tools",
    name: "Cutting Tools",
    shortName: "Cutting Tools",
    description: "Finishing engineered to extend tool life and cutting performance in production.",
    applications: [
      {
        slug: "cutting-tools",
        name: "Cutting Tools",
        description: "Precision finishing designed to improve cutting performance, wear resistance and tool life.",
        benefit: "Reduced friction • Longer tool life",
      },
    ],
  },
  {
    slug: "stamping-forging-injection-mold",
    name: "Stamping, Forging & Plastic Injection Mold",
    shortName: "Stamping & Mold",
    description:
      "Finishing for the tooling that shapes everything else, where surface quality decides part quality and die life.",
    applications: [
      {
        slug: "injection-mold-inserts",
        name: "Plastic Injection Mold Inserts",
        description: "Mirror-grade finishing for injection mold inserts to improve part release and surface transfer.",
        benefit: "Improved part release • Reduced cycle time",
      },
      {
        slug: "ejector-pins",
        name: "Ejector Pins",
        description: "Precision finishing for ejector pins to reduce wear and galling in high-cycle production.",
        benefit: "Reduced galling • Longer service life",
      },
      {
        slug: "screw-head-punches",
        name: "Screw Head Punches",
        description: "Surface treatment for punches that must hold geometry through millions of cycles.",
        benefit: "Reduced adhesion • Consistent output quality",
      },
      {
        slug: "cutting-stamping-dies",
        name: "Cutting & Stamping Dies",
        description: "Finishing engineered to extend die life and maintain consistent part quality.",
        benefit: "Reduced wear • Consistent stamped quality",
      },
    ],
  },
  {
    slug: "industrial-applications",
    name: "Industrial Applications",
    shortName: "Industrial",
    description: "Surface finishing solutions for demanding industrial components across general precision manufacturing.",
    applications: [
      {
        slug: "precision-industrial-components",
        name: "Precision Industrial Components",
        description: "Surface finishing solutions for demanding industrial components and precision applications.",
        benefit: "Consistent finish • Application-specific tuning",
      },
    ],
  },
  {
    slug: "medical",
    name: "Medical",
    shortName: "Medical",
    description: "Ultra-precise finishing for components where biocompatibility and surface quality are non-negotiable.",
    applications: [
      {
        slug: "prosthetic-components",
        name: "Prosthetic Components",
        description: "Ultra-precise finishing for prosthetic components requiring biocompatible surface quality.",
        benefit: "Biocompatible finish • Consistent surface quality",
      },
      {
        slug: "implants",
        name: "Implants",
        description: "Mirror-level finishing for implant surfaces meeting strict biocompatibility requirements.",
        benefit: "Reduced surface defects • Biocompatible finish",
      },
    ],
  },
];
