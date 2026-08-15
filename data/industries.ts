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

export interface IndustryCapability {
  title: string;
  description: string;
}

export interface Industry {
  slug: string;
  name: string;
  icon: LucideIcon;
  priority: boolean;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  relevance: string;
  capabilities: IndustryCapability[];
  applications: string[];
  materials: string[];
  certifications: string[];
}

export const industries: Industry[] = [
  {
    slug: "cutting-tools",
    name: "Cutting Tools",
    icon: Drill,
    priority: true,
    seo: {
      title: "Surface Finishing for Cutting Tools",
      description:
        "MMP surface treatment for cutting edges — reduced friction, better chip flow, and longer tool life for drills, end mills, inserts and reamers.",
    },
    hero: {
      eyebrow: "Cutting Tools",
      heading: "Cutting edges that hold their line under load.",
      body: "A cutting edge is only as good as what happens at the micro-scale where it meets the workpiece. INFINI treats ground cutting-tool surfaces to reduce the friction and micro-roughness that drive edge chipping, built-up edge, and premature wear.",
    },
    relevance:
      "Grinding leaves directional roughness and micro-burrs along the cutting edge — exactly where friction and heat concentrate first. MMP treatment removes those peaks selectively, without touching the ground geometry or edge radius your tool designers specified, so the edge stays true while the surface that actually contacts the chip gets smoother.",
    capabilities: [
      {
        title: "Edge-safe treatment",
        description: "Controlled material removal that improves surface finish without rounding or softening the cutting edge.",
      },
      {
        title: "Rake and flank face finishing",
        description: "Reduced friction on rake and flank faces improves chip evacuation and lowers cutting temperatures.",
      },
      {
        title: "Batch consistency",
        description: "Every batch measured against an agreed roughness (Ra) target before it ships, so tool performance doesn't vary lot to lot.",
      },
    ],
    applications: ["Drills", "End mills", "Reamers", "Carbide inserts", "Taps and dies", "Hobs"],
    materials: ["Tungsten carbide", "HSS (high-speed steel)", "PCD-tipped tooling", "Coated substrates (pre-coat treatment)"],
    certifications: ["ISO 9001:2015"],
  },
  {
    slug: "forge-stamping-die",
    name: "Forge, Stamping & Die",
    icon: Hammer,
    priority: true,
    seo: {
      title: "Surface Finishing for Forging, Stamping & Die Tooling",
      description:
        "MMP surface treatment for forging, stamping and die tooling — cleaner part release, reduced galling, and longer die life between resharpening cycles.",
    },
    hero: {
      eyebrow: "Forge, Stamping & Die",
      heading: "Dies that release cleaner and run longer.",
      body: "Die surfaces take direct, repeated contact with hot or cold-formed metal under extreme pressure. Surface roughness on the cavity determines how cleanly a part releases and how much friction and adhesion build up over the life of the tool.",
    },
    relevance:
      "Galling, sticking and inconsistent release are surface-finish problems before they're anything else. MMP treatment refines die and punch surfaces to reduce the peak roughness that catches formed material, which directly cuts galling and extends the interval between resharpening or recoating.",
    capabilities: [
      {
        title: "Cavity and punch face finishing",
        description: "Treatment reaches complex die geometry, not just flat or externally accessible surfaces.",
      },
      {
        title: "Anti-galling surface prep",
        description: "Reduced surface roughness lowers the friction coefficient against formed stock, cutting adhesive wear.",
      },
      {
        title: "Coating-ready surfaces",
        description: "Treated surfaces provide a consistent base for PVD/CVD coatings applied afterward, improving coating adhesion.",
      },
    ],
    applications: ["Forging dies", "Progressive stamping dies", "Deep-draw tooling", "Extrusion dies", "Trim and pierce punches"],
    materials: ["Tool steel (H13, D2)", "Hardened alloy steels", "Carbide die inserts"],
    certifications: ["ISO 9001:2015"],
  },
  {
    slug: "plastic-injection-molds",
    name: "Plastic Injection Molds",
    icon: Box,
    priority: true,
    seo: {
      title: "Surface Finishing for Plastic Injection Molds",
      description:
        "MMP surface treatment for injection mold cavities — improved melt flow, cleaner part ejection, and reduced flash and sink marks.",
    },
    hero: {
      eyebrow: "Plastic Injection Molds",
      heading: "Cavity surfaces that let plastic flow the way it should.",
      body: "Cavity surface finish shows up directly on the molded part — every tool mark, every micro-roughness variance is reproduced in the plastic. INFINI treats cavity and core surfaces for consistent melt flow and clean ejection, part after part.",
    },
    relevance:
      "Injection molding transfers cavity surface texture to the part with almost no tolerance for inconsistency. MMP treatment gives mold makers a way to refine finish after EDM or milling — reducing the recast layer and micro-roughness that cause sink marks, flow lines, and ejection drag — without re-cutting the cavity geometry.",
    capabilities: [
      {
        title: "Post-EDM finishing",
        description: "Removes the recast layer and micro-cracking left by EDM, a common source of surface defects on molded parts.",
      },
      {
        title: "Ejection-surface treatment",
        description: "Lower surface friction on core and ejector surfaces reduces sticking and part drag during ejection.",
      },
      {
        title: "Vent and gate area access",
        description: "Treatment reaches tight geometry around gates, ribs and vents that manual polishing struggles to finish evenly.",
      },
    ],
    applications: ["Cavity and core inserts", "Hot-runner components", "Ejector pins and sleeves", "Multi-cavity family molds"],
    materials: ["P20 and P20+Ni tool steel", "H13 tool steel", "Stainless mold steels (420, S136)", "Beryllium-copper inserts"],
    certifications: ["ISO 9001:2015"],
  },
  {
    slug: "medical-implants",
    name: "Medical Implants",
    icon: Bone,
    priority: false,
    seo: {
      title: "Surface Finishing for Medical Implants — ISO 13485 Aligned",
      description:
        "MMP surface treatment for medical implants — contamination-free, biocompatible-safe finishing for orthopedic and surgical components, aligned to ISO 13485 process standards.",
    },
    hero: {
      eyebrow: "Medical Implants",
      heading: "Contamination-free finishes for the human body.",
      body: "An implant surface is never just cosmetic — it affects biocompatibility, fatigue life, and how the surface interacts with tissue. INFINI's treatment process operates under ISO 13485-aligned process discipline, so implant surface work is documented, repeatable, and traceable.",
    },
    relevance:
      "Implant surfaces need finishes verified to a measurable standard, not judged by eye. MMP treatment removes surface irregularities that concentrate stress and reduce fatigue life, while our process controls — process documentation, batch traceability, and contamination control — are run to ISO 13485-aligned standards appropriate for medical-grade work.",
    capabilities: [
      {
        title: "Fatigue-critical surface refinement",
        description: "Removes surface irregularities that act as stress-concentration points and reduce fatigue life under cyclic load.",
      },
      {
        title: "Contamination-controlled process",
        description: "Treatment runs under process controls aligned to ISO 13485 requirements for medical device manufacturing.",
      },
      {
        title: "Traceable batch documentation",
        description: "Every treated batch is documented and traceable — a requirement our medical customers' quality systems depend on.",
      },
    ],
    applications: ["Orthopedic implants (hip, knee)", "Spinal fixation hardware", "Surgical instruments", "Dental implant components"],
    materials: ["Titanium and titanium alloys (Ti-6Al-4V)", "Cobalt-chrome alloys", "Medical-grade stainless steel (316L)"],
    certifications: ["ISO 9001:2015", "ISO 13485 process alignment"],
  },
  {
    slug: "aerospace",
    name: "Aerospace",
    icon: Plane,
    priority: false,
    seo: {
      title: "Surface Finishing for Aerospace Components",
      description:
        "MMP surface treatment for fatigue-critical aerospace components — verified surface finish for structural and rotating parts before they fly.",
    },
    hero: {
      eyebrow: "Aerospace",
      heading: "Fatigue-critical surfaces, verified before they fly.",
      body: "In aerospace, surface finish is a fatigue-life variable, not an aesthetic one. Machining marks and micro-roughness on structural and rotating components become the origin points for fatigue cracking under cyclic loading.",
    },
    relevance:
      "Aerospace components are specified against tight roughness tolerances precisely because surface irregularities initiate fatigue failure. MMP treatment refines machined surfaces to reduce those stress-concentration points, and every treated batch is measured against the agreed spec before it ships — verification a component's engineering file can reference.",
    capabilities: [
      {
        title: "Fatigue-life-focused finishing",
        description: "Targets the surface roughness that acts as a crack-initiation site under cyclic loading.",
      },
      {
        title: "Complex-geometry access",
        description: "Reaches internal passages, blends and fillets on structural and rotating parts that abrasive-only methods can't finish evenly.",
      },
      {
        title: "Measured, documented finish",
        description: "Roughness verified against the agreed target and recorded per batch — traceable for an aerospace quality file.",
      },
    ],
    applications: ["Structural airframe components", "Turbine and compressor blades", "Landing gear components", "Fastener and fitting hardware"],
    materials: ["Titanium alloys", "Nickel superalloys (Inconel)", "Aerospace-grade aluminum alloys", "High-strength steel"],
    certifications: ["ISO 9001:2015"],
  },
  {
    slug: "additive-manufacturing",
    name: "Additive Manufacturing",
    icon: Layers3,
    priority: false,
    seo: {
      title: "Post-Processing Surface Finishing for 3D-Printed Metal Parts",
      description:
        "MMP surface treatment for additively manufactured metal components — reducing as-built layer roughness and removing partially sintered particles.",
    },
    hero: {
      eyebrow: "Additive Manufacturing",
      heading: "The finish 3D printing can't give you on its own.",
      body: "As-built metal AM parts carry layer lines and partially sintered particles that as-printed roughness data doesn't fully capture. INFINI's treatment addresses exactly that surface condition — the gap between what the printer produces and what the application actually needs.",
    },
    relevance:
      "Additive parts come off the build plate with roughness an order of magnitude higher than machined surfaces, concentrated on internal channels and overhangs that are difficult to reach any other way. MMP treatment reduces that as-built roughness and removes loosely sintered particles, improving both fatigue performance and flow characteristics on internal geometry standard finishing can't access.",
    capabilities: [
      {
        title: "Internal-channel finishing",
        description: "Reaches internal lattices, cooling channels and overhangs that line-of-sight polishing methods physically cannot access.",
      },
      {
        title: "Loose-particle removal",
        description: "Clears partially sintered powder particles from the surface — a contamination risk in downstream assembly or service.",
      },
      {
        title: "As-built roughness reduction",
        description: "Brings layer-line roughness down toward a verified, application-appropriate target.",
      },
    ],
    applications: ["Conformal-cooled tooling inserts", "Lightweight lattice structures", "Complex ducting and manifolds", "Functional prototypes and low-volume production parts"],
    materials: ["Titanium (Ti-6Al-4V)", "Stainless steel (316L, 17-4PH)", "Nickel superalloys", "Aluminum alloys (AlSi10Mg)"],
    certifications: ["ISO 9001:2015"],
  },
  {
    slug: "gears-transmission",
    name: "Gears & Transmission",
    icon: Cog,
    priority: false,
    seo: {
      title: "Surface Finishing for Gears & Transmission Components",
      description:
        "MMP surface treatment for gear tooth flanks and transmission components — quieter mesh, lower friction, and longer service life.",
    },
    hero: {
      eyebrow: "Gears & Transmission",
      heading: "Quieter mesh, lower friction, longer service life.",
      body: "Gear tooth flank finish shows up directly in noise, friction, and wear. INFINI treats gear and transmission component surfaces to reduce the micro-roughness that drives contact noise and scuffing under load.",
    },
    relevance:
      "Two gear flanks in mesh transmit load across a surface that's rougher than it looks — those asperities are what generate whine, heat and scuffing wear over the gear's service life. MMP treatment refines tooth flank surfaces to reduce friction and noise without altering the tooth profile or lead your gear geometry was cut to.",
    capabilities: [
      {
        title: "Tooth-flank finishing",
        description: "Reduces flank roughness that drives mesh noise and friction, without changing tooth profile or lead.",
      },
      {
        title: "Scuffing resistance",
        description: "A smoother, more consistent surface reduces the asperity contact that leads to scuffing under high load.",
      },
      {
        title: "Post-hardening treatment",
        description: "Applied after case hardening or grinding, refining the final working surface without affecting case depth.",
      },
    ],
    applications: ["Automotive transmission gears", "Industrial gearbox components", "Differential gears", "Bearing races and shafts"],
    materials: ["Case-hardened alloy steel", "Nitrided steel", "Powder-metal gear components"],
    certifications: ["ISO 9001:2015"],
  },
];

export const industriesSectionCopy = {
  eyebrow: "Markets We Service",
  heading:
    "Working from its own treatment labs, INFINI is poised to provide manufacturers with custom finishes to meet their specifications.",
};

export const industriesIndexCopy = {
  eyebrow: "Industries",
  heading: "Surface finishing engineered around your application.",
  body: "Seven industries, seven different sets of surface-finish problems. Every page below reflects what actually matters for that application — not a generic template with the name swapped.",
};
