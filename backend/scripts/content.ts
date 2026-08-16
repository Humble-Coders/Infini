/**
 * Shared seed content for both the emulator seed (seed.ts, local dev) and
 * the real-project seed (seed-real-content.ts) — one source of text so the
 * two never drift apart. Timestamps are passed in by each caller since the
 * emulator and Admin SDK use different Timestamp constructors under the hood
 * but share the same `{ fromDate }` shape.
 */
export interface TimestampFactory {
  fromDate(date: Date): unknown;
}

const baseSeo = (title: string, description: string) => ({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "",
  canonical: "",
  noindex: false,
});

export function buildCertifications(ts: TimestampFactory) {
  return [
    {
      id: "iso-9001-2015",
      name: "ISO 9001:2015",
      logoUrl: "",
      certificateNumber: "Q-000001",
      issuedDate: ts.fromDate(new Date("2024-01-15")),
      validUntil: ts.fromDate(new Date("2027-01-14")),
      description: "Quality management system certification covering INFINI's surface-finishing process controls.",
      fileUrl: "",
      order: 1,
      published: true,
    },
    {
      id: "iso-13485-2016",
      name: "ISO 13485:2016",
      logoUrl: "",
      certificateNumber: "M-000002",
      issuedDate: ts.fromDate(new Date("2024-03-01")),
      validUntil: ts.fromDate(new Date("2027-02-28")),
      description: "Medical device quality management alignment for implant and surgical-instrument surface finishing.",
      fileUrl: "",
      order: 2,
      published: true,
    },
    {
      id: "iso-14001-2015",
      name: "ISO 14001:2015",
      logoUrl: "",
      certificateNumber: "E-000003",
      issuedDate: ts.fromDate(new Date("2024-01-15")),
      validUntil: ts.fromDate(new Date("2027-01-14")),
      description: "Environmental management system certification for INFINI's treatment facility.",
      fileUrl: "",
      order: 3,
      published: true,
    },
    {
      id: "iso-45001-2018",
      name: "ISO 45001:2018",
      logoUrl: "",
      certificateNumber: "H-000004",
      issuedDate: ts.fromDate(new Date("2024-01-15")),
      validUntil: ts.fromDate(new Date("2027-01-14")),
      description: "Occupational health and safety management system certification for the treatment facility.",
      fileUrl: "",
      order: 4,
      published: true,
    },
    {
      id: "udyam-registration",
      name: "Udyam Registration",
      logoUrl: "",
      certificateNumber: "UDYAM-HP-00-0000000",
      issuedDate: ts.fromDate(new Date("2023-06-01")),
      validUntil: ts.fromDate(new Date("2099-12-31")),
      description: "Government of India MSME (Udyam) registration for INFINI Precision Pvt. Ltd.",
      fileUrl: "",
      order: 5,
      published: true,
    },
  ];
}

export function buildIndustries() {
  return [
    {
      slug: "cutting-tools",
      name: "Cutting Tools",
      order: 1,
      hero: {
        eyebrow: "Cutting Tools",
        headline: "Cutting edges that hold their line under load.",
        subheadline:
          "A cutting edge is only as good as what happens at the micro-scale where it meets the workpiece.",
        image: "",
      },
      overview:
        "INFINI treats ground cutting-tool surfaces to reduce the friction and micro-roughness that drive edge chipping, built-up edge, and premature wear.",
      relevance:
        "Grinding leaves directional roughness and micro-burrs along the cutting edge — exactly where friction and heat concentrate first. MMP treatment removes those peaks selectively, without touching the ground geometry or edge radius your tool designers specified, so the edge stays true while the surface that actually contacts the chip gets smoother.",
      capabilities: [
        { title: "Edge-safe treatment", description: "Controlled material removal that improves surface finish without rounding or softening the cutting edge." },
        { title: "Rake and flank face finishing", description: "Reduced friction on rake and flank faces improves chip evacuation and lowers cutting temperatures." },
        { title: "Batch consistency", description: "Every batch measured against an agreed roughness (Ra) target before it ships, so tool performance doesn't vary lot to lot." },
      ],
      applications: ["Drills", "End mills", "Reamers", "Carbide inserts", "Taps and dies", "Hobs"],
      materials: ["Tungsten carbide", "HSS (high-speed steel)", "PCD-tipped tooling", "Coated substrates (pre-coat treatment)"],
      relatedCertIds: ["iso-9001-2015"],
    },
    {
      slug: "forge-stamping-die",
      name: "Forge, Stamping & Die",
      order: 2,
      hero: {
        eyebrow: "Forge, Stamping & Die",
        headline: "Dies that release cleaner and run longer.",
        subheadline: "Die surfaces take direct, repeated contact with formed metal under extreme pressure.",
        image: "",
      },
      overview:
        "MMP treatment refines die and punch surfaces to reduce the peak roughness that catches formed material.",
      relevance:
        "Galling, sticking and inconsistent release are surface-finish problems before they're anything else. MMP treatment refines die and punch surfaces to reduce the peak roughness that catches formed material, which directly cuts galling and extends the interval between resharpening or recoating.",
      capabilities: [
        { title: "Cavity and punch face finishing", description: "Treatment reaches complex die geometry, not just flat or externally accessible surfaces." },
        { title: "Anti-galling surface prep", description: "Reduced surface roughness lowers the friction coefficient against formed stock, cutting adhesive wear." },
        { title: "Coating-ready surfaces", description: "Treated surfaces provide a consistent base for PVD/CVD coatings applied afterward, improving coating adhesion." },
      ],
      applications: ["Forging dies", "Progressive stamping dies", "Deep-draw tooling", "Extrusion dies", "Trim and pierce punches"],
      materials: ["Tool steel (H13, D2)", "Hardened alloy steels", "Carbide die inserts"],
      relatedCertIds: ["iso-9001-2015"],
    },
    {
      slug: "plastic-injection-molds",
      name: "Plastic Injection Molds",
      order: 3,
      hero: {
        eyebrow: "Plastic Injection Molds",
        headline: "Cavity surfaces that let plastic flow the way it should.",
        subheadline: "Cavity surface finish shows up directly on the molded part.",
        image: "",
      },
      overview:
        "MMP treatment refines finish after EDM or milling without re-cutting the cavity geometry.",
      relevance:
        "Injection molding transfers cavity surface texture to the part with almost no tolerance for inconsistency. MMP treatment gives mold makers a way to refine finish after EDM or milling — reducing the recast layer and micro-roughness that cause sink marks, flow lines, and ejection drag — without re-cutting the cavity geometry.",
      capabilities: [
        { title: "Post-EDM finishing", description: "Removes the recast layer and micro-cracking left by EDM, a common source of surface defects on molded parts." },
        { title: "Ejection-surface treatment", description: "Lower surface friction on core and ejector surfaces reduces sticking and part drag during ejection." },
        { title: "Vent and gate area access", description: "Treatment reaches tight geometry around gates, ribs and vents that manual polishing struggles to finish evenly." },
      ],
      applications: ["Cavity and core inserts", "Hot-runner components", "Ejector pins and sleeves", "Multi-cavity family molds"],
      materials: ["P20 and P20+Ni tool steel", "H13 tool steel", "Stainless mold steels (420, S136)", "Beryllium-copper inserts"],
      relatedCertIds: ["iso-9001-2015"],
    },
    {
      slug: "medical-implants",
      name: "Medical Implants",
      order: 4,
      hero: {
        eyebrow: "Medical Implants",
        headline: "Contamination-free finishes for the human body.",
        subheadline: "An implant surface affects biocompatibility, fatigue life, and tissue interaction.",
        image: "",
      },
      overview:
        "MMP treatment removes surface irregularities that concentrate stress and reduce fatigue life, run under ISO 13485-aligned process controls.",
      relevance:
        "Implant surfaces need finishes verified to a measurable standard, not judged by eye. MMP treatment removes surface irregularities that concentrate stress and reduce fatigue life, while our process controls — process documentation, batch traceability, and contamination control — are run to ISO 13485-aligned standards appropriate for medical-grade work.",
      capabilities: [
        { title: "Fatigue-critical surface refinement", description: "Removes surface irregularities that act as stress-concentration points and reduce fatigue life under cyclic load." },
        { title: "Contamination-controlled process", description: "Treatment runs under process controls aligned to ISO 13485 requirements for medical device manufacturing." },
        { title: "Traceable batch documentation", description: "Every treated batch is documented and traceable — a requirement our medical customers' quality systems depend on." },
      ],
      applications: ["Orthopedic implants (hip, knee)", "Spinal fixation hardware", "Surgical instruments", "Dental implant components"],
      materials: ["Titanium and titanium alloys (Ti-6Al-4V)", "Cobalt-chrome alloys", "Medical-grade stainless steel (316L)"],
      relatedCertIds: ["iso-9001-2015", "iso-13485-2016"],
    },
    {
      slug: "aerospace",
      name: "Aerospace",
      order: 5,
      hero: {
        eyebrow: "Aerospace",
        headline: "Fatigue-critical surfaces, verified before they fly.",
        subheadline: "In aerospace, surface finish is a fatigue-life variable, not an aesthetic one.",
        image: "",
      },
      overview:
        "MMP treatment refines machined surfaces to reduce stress-concentration points, measured and documented against the agreed spec.",
      relevance:
        "Aerospace components are specified against tight roughness tolerances precisely because surface irregularities initiate fatigue failure. MMP treatment refines machined surfaces to reduce those stress-concentration points, and every treated batch is measured against the agreed spec before it ships — verification a component's engineering file can reference.",
      capabilities: [
        { title: "Fatigue-life-focused finishing", description: "Targets the surface roughness that acts as a crack-initiation site under cyclic loading." },
        { title: "Complex-geometry access", description: "Reaches internal passages, blends and fillets on structural and rotating parts that abrasive-only methods can't finish evenly." },
        { title: "Measured, documented finish", description: "Roughness verified against the agreed target and recorded per batch — traceable for an aerospace quality file." },
      ],
      applications: ["Structural airframe components", "Turbine and compressor blades", "Landing gear components", "Fastener and fitting hardware"],
      materials: ["Titanium alloys", "Nickel superalloys (Inconel)", "Aerospace-grade aluminum alloys", "High-strength steel"],
      relatedCertIds: ["iso-9001-2015"],
    },
    {
      slug: "additive-manufacturing",
      name: "Additive Manufacturing",
      order: 6,
      hero: {
        eyebrow: "Additive Manufacturing",
        headline: "The finish 3D printing can't give you on its own.",
        subheadline: "As-built metal AM parts carry layer lines and partially sintered particles.",
        image: "",
      },
      overview:
        "MMP treatment reduces as-built roughness and removes loosely sintered particles on internal geometry other methods can't access.",
      relevance:
        "Additive parts come off the build plate with roughness an order of magnitude higher than machined surfaces, concentrated on internal channels and overhangs that are difficult to reach any other way. MMP treatment reduces that as-built roughness and removes loosely sintered particles, improving both fatigue performance and flow characteristics on internal geometry standard finishing can't access.",
      capabilities: [
        { title: "Internal-channel finishing", description: "Reaches internal lattices, cooling channels and overhangs that line-of-sight polishing methods physically cannot access." },
        { title: "Loose-particle removal", description: "Clears partially sintered powder particles from the surface — a contamination risk in downstream assembly or service." },
        { title: "As-built roughness reduction", description: "Brings layer-line roughness down toward a verified, application-appropriate target." },
      ],
      applications: ["Conformal-cooled tooling inserts", "Lightweight lattice structures", "Complex ducting and manifolds", "Functional prototypes and low-volume production parts"],
      materials: ["Titanium (Ti-6Al-4V)", "Stainless steel (316L, 17-4PH)", "Nickel superalloys", "Aluminum alloys (AlSi10Mg)"],
      relatedCertIds: ["iso-9001-2015"],
    },
    {
      slug: "gears-transmission",
      name: "Gears & Transmission",
      order: 7,
      hero: {
        eyebrow: "Gears & Transmission",
        headline: "Quieter mesh, lower friction, longer service life.",
        subheadline: "Gear tooth flank finish shows up directly in noise, friction, and wear.",
        image: "",
      },
      overview:
        "MMP treatment refines tooth flank surfaces without altering the tooth profile or lead.",
      relevance:
        "Two gear flanks in mesh transmit load across a surface that's rougher than it looks — those asperities are what generate whine, heat and scuffing wear over the gear's service life. MMP treatment refines tooth flank surfaces to reduce friction and noise without altering the tooth profile or lead your gear geometry was cut to.",
      capabilities: [
        { title: "Tooth-flank finishing", description: "Reduces flank roughness that drives mesh noise and friction, without changing tooth profile or lead." },
        { title: "Scuffing resistance", description: "A smoother, more consistent surface reduces the asperity contact that leads to scuffing under high load." },
        { title: "Post-hardening treatment", description: "Applied after case hardening or grinding, refining the final working surface without affecting case depth." },
      ],
      applications: ["Automotive transmission gears", "Industrial gearbox components", "Differential gears", "Bearing races and shafts"],
      materials: ["Case-hardened alloy steel", "Nitrided steel", "Powder-metal gear components"],
      relatedCertIds: ["iso-9001-2015"],
    },
  ].map((industry) => ({
    ...industry,
    relatedCaseStudyIds: [] as string[],
    seo: baseSeo(`Surface Finishing for ${industry.name}`, industry.overview),
    published: true,
  }));
}

export function buildTestimonials() {
  return [
    {
      id: "testimonial-1",
      quote:
        "INFINI's treatment cut our die resharpening cycles noticeably. The parts release cleaner and the finish is consistent batch to batch.",
      personName: "Sample Contact",
      designation: "Tooling Manager",
      company: "Sample Manufacturing Co.",
      logoUrl: "",
      order: 1,
      published: true,
    },
    {
      id: "testimonial-2",
      quote: "Documented, traceable, and repeatable — exactly what our quality system needed from a finishing partner.",
      personName: "Sample Contact",
      designation: "Quality Lead",
      company: "Sample Precision Ltd.",
      logoUrl: "",
      order: 2,
      published: true,
    },
  ];
}

export function buildEvents(ts: TimestampFactory) {
  return [
    {
      id: "sample-trade-show-2026",
      title: "IMTEX 2026",
      startDate: ts.fromDate(new Date("2026-01-20")),
      endDate: ts.fromDate(new Date("2026-01-25")),
      location: "Bengaluru, India",
      description: "INFINI at IMTEX, showcasing MMP surface-finishing capability for precision manufacturers.",
      images: [] as string[],
      link: "",
      published: true,
    },
  ];
}

export function buildNews(ts: TimestampFactory) {
  return [
    {
      id: "sample-first-post",
      slug: "sample-first-post",
      title: "Sample news post",
      excerpt: "Placeholder excerpt for local development.",
      body: "Placeholder body content for local development.",
      coverImage: "",
      tags: ["announcement"],
      status: "published" as const,
      publishedAt: ts.fromDate(new Date("2026-01-01")),
      authorId: "seed-script",
      seo: baseSeo("Sample news post", "Placeholder excerpt for local development."),
    },
  ];
}

export function buildSettings() {
  return {
    contact: {
      phone: "+91 XX XXXX XXXX",
      email: "enquiries@infini.co.in",
      address: "Treatment & validation labs, Parwanoo, Himachal Pradesh, India",
    },
    social: {
      linkedin: "",
      instagram: "",
      youtube: "",
    },
    nav: [
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
    ],
    footerLegalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    defaultSeo: baseSeo(
      "INFINI — Precision Surface-Finishing",
      "INFINI is a precision surface-finishing partner to manufacturers, applying ISO 9001-certified MMP treatment."
    ),
    cookieBanner: {
      enabled: false,
      message: "",
      policyUrl: "/privacy",
    },
  };
}

export function buildPages() {
  return {
    home: {
      id: "home" as const,
      sections: [
        {
          type: "hero",
          fields: {
            heading: "A finish\nthat performs.",
            body: "Precision surface-finishing for components precision manufacturers already trust — applied in-house, verified before it ships.",
            ctaNote: "No project too precise. Talk to our engineers.",
          },
        },
        {
          type: "stats",
          fields: {
            intro:
              "Every component that leaves our tanks carries a finish engineers can measure and verify — not just a claim on a spec sheet.",
            items: [
              { value: "7", label: "Industries served" },
              { value: "ISO 9001", label: "Certified treatment process" },
              { value: "< 0.1 µm Ra", label: "Achievable mirror-like finish" },
            ],
          },
        },
        {
          type: "technology",
          fields: {
            eyebrow: "The MMP Process",
            heading: "A treatment, not a coating.",
            body: "MMP (Micro Machining Process) is a mechanical-physical-chemical treatment performed in dedicated tanks. It selectively removes frequencies of surface roughness from components our customers manufacture — no material added, no dimensional drift, just a controlled finish verified against measurable roughness targets.",
            steps: [
              { step: "01", title: "Validation", description: "Component geometry, material and target roughness are assessed before treatment begins." },
              { step: "02", title: "Treatment", description: "The MMP process runs in-house, in tanks tuned to the component and finish required." },
              { step: "03", title: "Verification", description: "Every batch is measured against the agreed roughness spec before it ships." },
            ],
          },
        },
        {
          type: "industriesTeaser",
          fields: {
            eyebrow: "Markets We Service",
            heading:
              "Working from its own treatment labs, INFINI is poised to provide manufacturers with custom finishes to meet their specifications.",
          },
        },
        {
          type: "caseStudiesTeaser",
          fields: {
            eyebrow: "Proven Work",
            heading: "Selected case studies.",
            emptyState:
              "We're publishing our first case studies shortly. In the meantime, tell us about your components and we'll walk you through comparable work directly.",
          },
        },
        {
          type: "testimonialsTeaser",
          fields: {
            eyebrow: "Trusted By",
            heading: "What manufacturers say.",
            emptyState: "Client testimonials are being collected as projects complete — check back soon.",
          },
        },
        {
          type: "newsTeaser",
          fields: {
            eyebrow: "Latest",
            heading: "News & insights.",
            emptyState: "Our first posts on treatment process, validation and industry standards are coming soon.",
          },
        },
        {
          type: "contactTeaser",
          fields: {
            eyebrow: "Get In Touch",
            heading: "Tell us what you need finished.",
            body: "Share your component, tolerance and volume — our engineers will get back to you with a treatment recommendation, not a sales script.",
          },
        },
      ],
      seo: baseSeo(
        "INFINI — Precision Surface-Finishing",
        "INFINI applies ISO 9001-certified MMP surface-finishing to components precision manufacturers already make — validated in-house, verified before it ships."
      ),
    },
    company: {
      id: "company" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Company",
            heading: "A specialist surface-finishing partner, not a manufacturer.",
            body: "INFINI Precision Pvt. Ltd. applies MMP surface-finishing technology to components its customers manufacture — it does not manufacture the parts itself. The company operates from a treatment facility in Parwanoo, Himachal Pradesh, and serves precision manufacturers across seven industries.",
          },
        },
        {
          type: "facts",
          fields: {
            items: [
              { label: "Legal entity", value: "INFINI Precision Pvt. Ltd." },
              { label: "Facility location", value: "Parwanoo, Himachal Pradesh, India" },
              {
                label: "Markets served",
                value: "Cutting Tools, Forge/Stamping/Die, Plastic Injection Molds, Medical Implants, Aerospace, Additive Manufacturing, Gears & Transmission",
              },
              { label: "Certifications held", value: "ISO 9001, ISO 13485, ISO 14001, ISO 45001, Udyam registration" },
            ],
          },
        },
        {
          type: "process",
          fields: {
            heading: "How INFINI treats a surface",
            body: "INFINI's MMP (Micro Machining Process) technology is a mechanical treatment, not a chemical one, applied to parts placed in a treatment tank. It maps a surface as a collection of roughness frequencies and removes the highest frequencies first, working progressively lower — which means the process can stop at any target roughness rather than over-treating the part. Because material removal is controlled and selective, MMP preserves the part's form, including fine features that conventional polishing would alter or destroy.",
          },
        },
        {
          type: "quality",
          fields: {
            heading: "How a treatment is validated",
            body: "Before a component goes to production volume, INFINI measures the workpiece's surface roughness, accounts for the material being treated, and agrees the target roughness and constraints with the customer. Production batches are then run against that agreed objective, with traceability and control built into the process rather than checked after the fact.",
          },
        },
      ],
      seo: baseSeo(
        "About INFINI — Precision Surface Finishing",
        "INFINI Precision Pvt. Ltd. applies MMP surface-finishing technology from its treatment facility in Parwanoo, Himachal Pradesh, serving precision manufacturers across seven industries."
      ),
    },
    capabilities: {
      id: "capabilities" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Capabilities",
            heading: "From controlled roughness to mirror-like brilliance.",
            body: "MMP treatment covers a range of finishes on a single process — the same underlying technology takes a surface from a specified controlled roughness through to a mirror-like finish, depending on what the application needs.",
          },
        },
        {
          type: "processCapabilities",
          fields: {
            items: [
              {
                title: "Selective, frequency-based removal",
                description:
                  "The surface is mapped as a collection of roughness frequencies. Treatment removes the highest frequencies first, then progressively lower ones, so the process can stop at any target roughness instead of over-treating the part.",
              },
              {
                title: "Geometry-preserving",
                description:
                  "Because material removal is controlled and selective rather than abrasive across the whole surface, MMP preserves the part's form — including fine features that conventional polishing would alter or destroy.",
              },
              {
                title: "Measured and traceable",
                description:
                  "Every treatment starts from a roughness measurement of the actual workpiece and an agreed target with the customer, and production batches are run and documented against that objective.",
              },
            ],
          },
        },
        {
          type: "capacity",
          fields: {
            heading: "Capacity & lead times",
            body: "Production capacity, batch size and turnaround depend on the component, material and finish specified. Rather than publish a generic figure that may not hold for your part, tell us what you're treating and we'll give you a capacity and lead-time estimate specific to it.",
          },
        },
      ],
      seo: baseSeo(
        "Capabilities — MMP Surface Finishing Process",
        "INFINI's treatment capabilities: MMP surface finishing from controlled roughness to mirror-like brilliance, with measured, traceable batch validation."
      ),
    },
  };
}
