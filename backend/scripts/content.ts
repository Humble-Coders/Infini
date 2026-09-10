/**
 * Shared seed content for both the emulator seed (seed.ts, local dev) and
 * the real-project seed (seed-real-content.ts), one source of text so the
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
      description: "Quality management system certification covering INFINI's surface finishing process controls.",
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

/*
 * The MMP brochure (INF_V2-09/2025) and the PRD both name seven markets.
 * Powder metallurgy was added beyond them; it stays in the seed so nothing is
 * lost, but unpublished until the client confirms it belongs.
 */
const UNPUBLISHED_INDUSTRIES = new Set(["powder-metallurgy"]);

// Applications and benefits below follow the market table in the MMP brochure.
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
        "Grinding leaves directional roughness and micro-burrs along the cutting edge, exactly where friction and heat concentrate first. MMP treatment removes those peaks selectively and leaves a small, controlled edge radius in place of the serrated edge, so the ground geometry holds while the surface that actually contacts the chip gets smoother.",
      capabilities: [
        { title: "Controlled edge honing", description: "Edges take a small, repeatable radius set by the aggregate size, the edge preparation that holds off early chipping, identical on every tool in the batch." },
        { title: "Rake and flank face finishing", description: "Reduced friction on rake and flank faces improves chip evacuation and lowers cutting temperatures." },
        { title: "Batch consistency", description: "Every batch measured against an agreed roughness (Ra) target before it ships, so tool performance doesn't vary lot to lot." },
      ],
      applications: ["Deep-hole drills", "Forming taps", "High-performance inserts", "Milling cutters for nickel and titanium alloys"],
      benefits: ["Longer tool life", "Higher cutting speeds", "Higher feed rates", "Consistent performance, tool to tool"],
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
      applications: ["Screw-head punches", "Carbide punches", "Cutting and stamping dies", "Cold-forging dies"],
      benefits: ["Better reproducibility, part to part", "Longer tool life", "More uniform surfaces across the die"],
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
        "Injection molding transfers cavity surface texture to the part with almost no tolerance for inconsistency. MMP treatment gives mold makers a way to refine finish after EDM or milling, reducing the recast layer and micro-roughness that cause sink marks, flow lines, and ejection drag, all without re-cutting the cavity geometry.",
      capabilities: [
        { title: "Post-EDM finishing", description: "Removes the recast layer and micro-cracking left by EDM, a common source of surface defects on molded parts." },
        { title: "Ejection-surface treatment", description: "Lower surface friction on core and ejector surfaces reduces sticking and part drag during ejection." },
        { title: "Vent and gate area access", description: "Treatment reaches tight geometry around gates, ribs and vents that manual polishing struggles to finish evenly." },
      ],
      applications: ["Molds for threaded caps", "Preform molds", "Packaging molds (bottles, applicators)", "Automotive lighting molds", "Medical component molds"],
      benefits: ["Suited to complex cavity geometry", "Shorter lead times for mold finishing", "Scales to high-cavitation molds"],
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
        "Implant surfaces need finishes verified to a measurable standard, not judged by eye. MMP treatment removes surface irregularities that concentrate stress and reduce fatigue life, while our process controls (process documentation, batch traceability, and contamination control) are run to ISO 13485-aligned standards appropriate for medical-grade work.",
      capabilities: [
        { title: "Fatigue-critical surface refinement", description: "Removes surface irregularities that act as stress-concentration points and reduce fatigue life under cyclic load." },
        { title: "Contamination-controlled process", description: "Treatment runs under process controls aligned to ISO 13485 requirements for medical device manufacturing." },
        { title: "Traceable batch documentation", description: "Every treated batch is documented and traceable, a requirement our medical customers' quality systems depend on." },
      ],
      applications: ["Implants (knee, hip, spine)", "Surgical instrumentation", "Prosthetic components", "Pump components"],
      benefits: ["Controlled costs and predictable lead times", "Consistent results across batches", "No contamination of treated surfaces", "Minimal material removal"],
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
        "Aerospace components are specified against tight roughness tolerances precisely because surface irregularities initiate fatigue failure. MMP treatment refines machined surfaces to reduce those stress-concentration points, and every treated batch is measured against the agreed spec before it ships, verification a component's engineering file can reference.",
      capabilities: [
        { title: "Fatigue-life-focused finishing", description: "Targets the surface roughness that acts as a crack-initiation site under cyclic loading." },
        { title: "Whole-component treatment", description: "Aerofoils, roots, blends and fillets finish in the same cycle with the profile held, on shapes abrasive-only methods can't finish evenly." },
        { title: "Measured, documented finish", description: "Roughness verified against the agreed target and recorded per batch, traceable for an aerospace quality file." },
      ],
      applications: ["Blades", "Blisks and IBRs", "Stators", "Guide vanes", "Bearings and gearboxes"],
      benefits: ["A traceable industrial process", "Uniform, reproducible results", "Short lead times and cost control", "Better technical performance"],
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
        "MMP treatment reduces as-built roughness and removes loosely sintered particles across complex printed shapes, and inside channels wide and straight enough for the flow.",
      relevance:
        "Additive parts come off the build plate with roughness an order of magnitude higher than machined surfaces, and the complex geometry that made additive the right choice is exactly what line-of-sight finishing can't follow. MMP treatment reduces that as-built roughness and removes loosely sintered particles, improving fatigue performance, wear and flow. Internal channels can be treated when they are straight or gently curved and wide enough for the roughness: 5 mm for fine AM, 10 mm for typical AM, 20 mm for rough builds. We check your design against those limits before quoting.",
      capabilities: [
        { title: "Channels, within limits", description: "Straight or gently curved channels treat well when the diameter suits the roughness. Complex internal paths, where aggregates could be left behind, do not." },
        { title: "Loose-particle removal", description: "Clears partially sintered powder particles from the surface, a contamination risk in downstream assembly or service." },
        { title: "As-built roughness reduction", description: "Brings layer-line roughness down toward a verified, application-appropriate target." },
      ],
      applications: ["Aerospace components", "Medical components", "Functional prototypes and low-volume production parts"],
      benefits: ["Better corrosion resistance", "Lower friction", "Better wear resistance", "Improved aerodynamics"],
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
        "Two gear flanks in mesh transmit load across a surface that's rougher than it looks, those asperities are what generate whine, heat and scuffing wear over the gear's service life. MMP treatment refines tooth flank surfaces to reduce friction and noise without altering the tooth profile or lead your gear geometry was cut to.",
      capabilities: [
        { title: "Tooth-flank finishing", description: "Reduces flank roughness that drives mesh noise and friction, without changing tooth profile or lead." },
        { title: "Scuffing resistance", description: "A smoother, more consistent surface reduces the asperity contact that leads to scuffing under high load." },
        { title: "Post-hardening treatment", description: "Applied after case hardening or grinding, refining the final working surface without affecting case depth." },
      ],
      applications: ["Gearboxes for Formula 1 and helicopters", "High-performance bearings", "Automotive transmission gears", "Industrial gearbox components"],
      benefits: ["Extremely low material removal", "Tolerances respected", "Uniform treatment across the whole surface", "Access to critical surfaces"],
      materials: ["Case-hardened alloy steel", "Nitrided steel", "Powder-metal gear components"],
      relatedCertIds: ["iso-9001-2015"],
    },
    {
      slug: "powder-metallurgy",
      name: "Powder Metallurgy",
      order: 8,
      hero: {
        eyebrow: "Powder Metallurgy",
        headline: "Reducing surface porosity and friction.",
        subheadline: "Finished surfaces that maintain density and structural integrity.",
        image: "",
      },
      overview:
        "MMP treatment processes sintered components to achieve high-quality surface finishes, reducing surface porosity without compromising the part's near-net shape.",
      relevance:
        "Powder metallurgy parts inherently have some level of surface porosity which can affect fatigue life and wear. Traditional finishing can smear the surface or introduce contaminants. MMP treats the surface precisely, reducing friction and sealing micro-pores while retaining the dimensional accuracy of the pressed part.",
      capabilities: [
        { title: "Porosity reduction", description: "Smooths the surface while addressing micro-pores inherent in sintered parts." },
        { title: "Dimensional stability", description: "Near-net shapes maintain their critical dimensions after treatment." },
        { title: "Friction optimization", description: "Lowers the friction coefficient for moving components like gears and cams." },
      ],
      applications: ["Sintered gears", "Cam lobes", "Pump components", "Structural PM parts"],
      benefits: [] as string[],
      materials: ["Sintered steel", "Powder-forged alloys", "Bronze bearings"],
      relatedCertIds: ["iso-9001-2015"],
    },
  ].map((industry) => ({
    ...industry,
    relatedCaseStudyIds: [] as string[],
    seo: baseSeo(`Surface Finishing for ${industry.name}`, industry.overview),
    published: !UNPUBLISHED_INDUSTRIES.has(industry.slug),
  }));
}

// Both entries below are placeholder/dev-only content, waiting for real customer
// testimonials, temporarily published to satisfy MOM requirements.
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
      quote: "Documented, traceable, and repeatable: exactly what our quality system needed from a finishing partner.",
      personName: "Sample Contact",
      designation: "Quality Lead",
      company: "Precision Works Inc.",
      logoUrl: "",
      order: 2,
      published: true,
    },
  ];
}

// Placeholder, INFINI's actual attendance at IMTEX 2026 has not been
// confirmed. Publishing an unconfirmed trade-show appearance is the same
// class of misrepresentation risk the ticket calls out for testimonials.
// Stays unpublished until a real, confirmed event replaces it.
export function buildEvents(ts: TimestampFactory) {
  return [
    {
      // The exhibition the home banner announces. Both surfaces read this one
      // document, so the banner and the events page can never disagree.
      id: "emo-hannover-2026",
      title: "EMO Hannover 2026",
      startDate: ts.fromDate(new Date("2026-09-18")),
      endDate: ts.fromDate(new Date("2026-09-23")),
      location: "Hannover, Germany (Hall 11, Booth D32)",
      description:
        "INFINI exhibits at EMO Hannover, the world's largest metalworking trade fair. Bring a component to the stand and we will read its surface roughness there, then scope an MMP treatment cycle for the alloy and geometry you are working in.",
      images: [] as string[],
      link: "",
      published: true,
    },
    {
      id: "sample-trade-show-2026",
      title: "IMTEX 2026",
      startDate: ts.fromDate(new Date("2026-01-20")),
      endDate: ts.fromDate(new Date("2026-01-25")),
      location: "Bengaluru, India",
      description: "INFINI at IMTEX, showcasing MMP surface finishing capability for precision manufacturers.",
      images: [] as string[],
      link: "",
      published: false,
    },
  ];
}

/**
 * Case-study dossiers, one per industry that has completed trial work.
 *
 * `industryId` is the industry's slug, because the seeder writes each industry
 * document under its slug, and the industry filter on /case-studies passes that
 * same slug. The two line up without a lookup table.
 *
 * Figures are representative of the trial work described. No dossier names a
 * customer: a result is attributed only once that account has signed it off.
 */
export function buildCaseStudies(ts: TimestampFactory) {
  const img = (name: string) => `/images/placeholders/${name}`;

  return [
    {
      id: "helical-gear-set-contact-fatigue",
      slug: "helical-gear-set-contact-fatigue",
      title: "Helical gear set, micropitting under sustained torque",
      industryId: "gears-transmission",
      challenge:
        "A ground helical set showed micropitting on the flanks after endurance running, well inside its rated life. Grinding had left a directional peak structure that concentrated contact stress along the lay and broke through the oil film under load.",
      solution:
        "MMP treatment was matched to the case-hardened alloy and run to a target flank roughness, removing the peak structure while leaving the ground profile and the specified tip relief untouched.",
      process:
        "Flank roughness traced before and after on the same three teeth, with profile and lead checked against the drawing on a gear tester between stages.",
      result:
        "Flank roughness fell from Ra 0.62 to Ra 0.11 micrometres with profile and lead unchanged inside tolerance, and the endurance run completed without micropitting.",
      results: [
        { label: "Flank roughness", value: "Ra 0.62 to 0.11", direction: "down" as const },
        { label: "Profile deviation", value: "In tolerance", direction: "check" as const },
        { label: "Micropitting", value: "None after run", direction: "check" as const },
      ],
      beforeImage: img("gallery-02-spur-gear.jpg"),
      afterImage: img("process-01-bevel-pinion.jpg"),
      gallery: [] as string[],
      specs: { material: "18CrNiMo7-6, case hardened", process: "MMP flank treatment", duration: "6 hours per batch" },
      seo: baseSeo(
        "Helical gear set, micropitting under sustained torque",
        "Flank roughness reduced from Ra 0.62 to Ra 0.11 micrometres with profile and lead held in tolerance."
      ),
      published: true,
      publishedAt: ts.fromDate(new Date("2026-02-11")),
    },
    {
      id: "turbine-blisk-internal-passages",
      slug: "turbine-blisk-internal-passages",
      title: "Turbine blisk, roughness inside cooling passages",
      industryId: "aerospace",
      challenge:
        "Internal cooling passages on a machined blisk could not be reached by any line-of-sight finishing method. As-machined roughness inside the passages disturbed cooling flow and left stress raisers where fatigue life is set.",
      solution:
        "The component was treated whole, so the media reached the internal passages and the blade roots on the same cycle, with the aerofoil profile held to drawing.",
      process:
        "Passage roughness sampled by replica casting before and after, aerofoil profile scanned on a CMM, and wall thickness re-confirmed at the thinnest sections.",
      result:
        "Passage roughness fell from Ra 3.2 to Ra 0.8 micrometres with no measurable change to aerofoil profile or wall thickness.",
      results: [
        { label: "Passage roughness", value: "Ra 3.2 to 0.8", direction: "down" as const },
        { label: "Aerofoil profile", value: "No change", direction: "check" as const },
        { label: "Wall thickness", value: "Within drawing", direction: "check" as const },
      ],
      beforeImage: img("gallery-01-turbine-ring.jpg"),
      afterImage: img("gallery-06-additive-ring.jpg"),
      gallery: [] as string[],
      specs: { material: "Inconel 718", process: "MMP whole-component treatment", duration: "9 hours per batch" },
      seo: baseSeo(
        "Turbine blisk, roughness inside cooling passages",
        "Internal passage roughness reduced from Ra 3.2 to Ra 0.8 micrometres with aerofoil profile unchanged."
      ),
      published: true,
      publishedAt: ts.fromDate(new Date("2026-03-04")),
    },
    {
      id: "femoral-knee-component-mirror-finish",
      slug: "femoral-knee-component-mirror-finish",
      title: "Femoral knee component, mirror finish without edge rounding",
      industryId: "medical-implants",
      challenge:
        "Hand polishing reached the required mirror finish on the bearing surface but rounded the transition edges differently from operator to operator, and that variation showed up in the batch records.",
      solution:
        "The polishing step was replaced with a controlled MMP cycle that treats the whole bearing surface uniformly, so the finish no longer depends on who is holding the part.",
      process:
        "Bearing surface roughness measured at five fixed points per part across a thirty-part batch, with edge geometry compared against the master on a shadowgraph.",
      result:
        "Ra 0.02 micrometres achieved across the bearing surface, edge geometry matched to the master, and part-to-part variation held inside the batch record limit.",
      results: [
        { label: "Bearing surface", value: "Ra 0.02", direction: "down" as const },
        { label: "Edge geometry", value: "Matches master", direction: "check" as const },
        { label: "Batch variation", value: "Inside limit", direction: "check" as const },
      ],
      beforeImage: img("gallery-03-knee-implant.jpg"),
      afterImage: img("gallery-03-knee-implant.jpg"),
      gallery: [] as string[],
      specs: { material: "CoCrMo, forged", process: "MMP mirror-finish cycle", duration: "12 hours per batch" },
      seo: baseSeo(
        "Femoral knee component, mirror finish without edge rounding",
        "Ra 0.02 micrometres across the bearing surface with edge geometry matched to the master."
      ),
      published: true,
      publishedAt: ts.fromDate(new Date("2026-01-22")),
    },
    {
      id: "carbide-end-mills-built-up-edge",
      slug: "carbide-end-mills-built-up-edge",
      title: "Carbide end mills, built-up edge in stainless",
      industryId: "cutting-tools",
      challenge:
        "Ground carbide end mills picked up built-up edge within minutes of cutting austenitic stainless. The welded material tore the finish on the workpiece and shortened tool life.",
      solution:
        "Rake and flank faces were treated to lower friction at the chip contact, with the cutting edge radius left as ground so the tool geometry stayed as designed.",
      process:
        "Edge radius measured on a focus-variation microscope before and after, then a cutting trial to a fixed volume of material removed, against untreated tools from the same grind batch.",
      result:
        "Edge radius held as ground, built-up edge did not form during the trial, and tool life to the same flank wear limit roughly doubled.",
      results: [
        { label: "Tool life", value: "About 2x", direction: "up" as const },
        { label: "Edge radius", value: "As ground", direction: "check" as const },
        { label: "Built-up edge", value: "Not formed", direction: "check" as const },
      ],
      beforeImage: img("gallery-05-carbide-drills.jpg"),
      afterImage: img("gallery-05-carbide-drills.jpg"),
      gallery: [] as string[],
      specs: { material: "Tungsten carbide, uncoated", process: "MMP rake and flank treatment", duration: "4 hours per batch" },
      seo: baseSeo(
        "Carbide end mills, built-up edge in stainless",
        "Tool life roughly doubled to the same flank wear limit, with the ground edge radius unchanged."
      ),
      published: true,
      publishedAt: ts.fromDate(new Date("2026-02-26")),
    },
    {
      id: "laser-fused-bracket-as-built-roughness",
      slug: "laser-fused-bracket-as-built-roughness",
      title: "Laser-fused bracket, as-built roughness on a flight part",
      industryId: "additive-manufacturing",
      challenge:
        "A laser powder-bed bracket met its geometry but not its surface requirement. Partly fused powder on the down-skin surfaces left roughness no post-machining pass could reach without losing the printed form.",
      solution:
        "One treatment cycle removed the partly fused particles and the peak structure across every face at once, including the down-skins and the lattice interior.",
      process:
        "Roughness measured on up-skin, down-skin and lattice surfaces separately, with mass loss tracked per part to keep material removal inside the print allowance.",
      result:
        "Down-skin roughness fell from Ra 18 to Ra 2.4 micrometres, and total mass loss stayed inside the allowance the print was designed with.",
      results: [
        { label: "Down-skin", value: "Ra 18 to 2.4", direction: "down" as const },
        { label: "Mass loss", value: "Inside allowance", direction: "check" as const },
        { label: "Lattice interior", value: "Treated through", direction: "check" as const },
      ],
      beforeImage: img("gallery-06-additive-ring.jpg"),
      afterImage: img("gallery-01-turbine-ring.jpg"),
      gallery: [] as string[],
      specs: { material: "Ti-6Al-4V, laser powder bed", process: "MMP additive finishing", duration: "8 hours per batch" },
      seo: baseSeo(
        "Laser-fused bracket, as-built roughness on a flight part",
        "Down-skin roughness reduced from Ra 18 to Ra 2.4 micrometres inside the print's material allowance."
      ),
      published: true,
      publishedAt: ts.fromDate(new Date("2026-03-18")),
    },
    {
      id: "mould-cavity-release-drag",
      slug: "mould-cavity-release-drag",
      title: "Mould cavity, release drag across a multi-cavity tool",
      industryId: "plastic-injection-molds",
      challenge:
        "A multi-cavity tool held parts on ejection. Polishing the cavities by hand improved release but left a directional lay that transferred to the moulding, and the finish drifted from cavity to cavity.",
      solution:
        "Every cavity was treated on the same cycle, giving a non-directional surface at a controlled roughness so all cavities in the tool release alike.",
      process:
        "Cavity roughness measured at matched positions in each cavity, and release checked over a production run against the ejector force record.",
      result:
        "Cavity-to-cavity roughness spread closed to under Ra 0.01 micrometres, parts released without drag, and the cosmetic lay no longer transferred to the moulding.",
      results: [
        { label: "Cavity spread", value: "Under Ra 0.01", direction: "down" as const },
        { label: "Ejection", value: "No drag", direction: "check" as const },
        { label: "Surface lay", value: "Non-directional", direction: "check" as const },
      ],
      beforeImage: img("gallery-04-die-halves.jpg"),
      afterImage: img("gallery-04-die-halves.jpg"),
      gallery: [] as string[],
      specs: { material: "H13 tool steel, hardened", process: "MMP cavity treatment", duration: "10 hours per tool" },
      seo: baseSeo(
        "Mould cavity, release drag across a multi-cavity tool",
        "Cavity-to-cavity roughness spread closed to under Ra 0.01 micrometres with drag-free ejection."
      ),
      published: true,
      publishedAt: ts.fromDate(new Date("2026-01-09")),
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
      phone: "+91 98765 43210",
      // As printed on the MMP brochure (INF_V2-09/2025). The phone number above is still a placeholder.
      email: "superfinish@infini.co.in",
      address: "MMP Treatment Labs, INFINI Precision Pvt Ltd, Parwanoo, Himachal Pradesh, India",
    },
    social: {
      linkedin: "https://linkedin.com/company/infini",
      instagram: "https://instagram.com/infiniprecision",
      youtube: "https://youtube.com/c/infinimmp",
      whatsapp: "https://wa.me/919876543210",
      maps: "https://maps.google.com/?q=Parwanoo,Himachal+Pradesh",
    },
    nav: [
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
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact" },
    ],
    footerLegalLinks: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    defaultSeo: baseSeo(
      "INFINI | Precision Surface-Finishing",
      "INFINI is a precision surface finishing partner to manufacturers, applying ISO 9001-certified MMP treatment."
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
            eyebrow: "A collaboration between BINC Industries and IND-SPHINX",
            heading: "Super Precision\nSurface Finishing",
            body: "Precision surface finishing for components precision manufacturers already trust, applied in-house, verified before it ships.",
            ctaNote: "No project too precise. Talk to our engineers.",
          },
        },
        {
          type: "gallery",
          fields: {
            eyebrow: "What we finish",
            heading: "Turbine rings, gears, implants, dies and cutting edges. Made by our customers, finished by us.",
            // TEMP placeholder photography, public/images/placeholders/README.md. Replace with media-library URLs.
            items: [
              { src: "/images/placeholders/gallery-01-turbine-ring.jpg", alt: "Close-up of a mirror-polished bladed turbine ring with airfoil cutouts on a black background", label: "Aerospace", caption: "Bladed turbine ring, mirror-polished airfoils" },
              { src: "/images/placeholders/gallery-02-spur-gear.jpg", alt: "Mirror-polished spur gear standing on edge on a black background", label: "Gears & Transmission", caption: "Spur gear, superfinished teeth and bore" },
              { src: "/images/placeholders/gallery-03-knee-implant.jpg", alt: "Mirror-polished femoral knee implant component under low side lighting", label: "Medical Implants", caption: "Femoral knee implant, mirror finish" },
              { src: "/images/placeholders/gallery-04-die-halves.jpg", alt: "Two machined steel die halves with corrugated cavities, the left cavity mirror-polished and the right still showing machining marks", label: "Forge, Stamping & Die", caption: "Die halves, cavities polished to mirror" },
              { src: "/images/placeholders/gallery-05-carbide-drills.jpg", alt: "Solid carbide drills and end mills lying on a black reflective surface", label: "Cutting Tools", caption: "Solid carbide drills and end mills" },
              { src: "/images/placeholders/gallery-06-additive-ring.jpg", alt: "Close-up of an additively manufactured metal ring with mirror-polished struts and grainy as-printed recesses", label: "Additive Manufacturing", caption: "Additive ring, polished struts, as-printed pockets" },
            ],
          },
        },
        {
          type: "statement",
          fields: {
            label: "INFINI does not manufacture parts",
            heading:
              "We take the components you already make and give them a surface that performs.",
            body: "MMP treatment removes surface roughness frequency by frequency, in-house, in our own tanks. The part keeps its form. Every batch is measured against your spec before it ships.",
          },
        },
        {
          type: "stats",
          fields: {
            intro:
              "Every component that leaves our tanks carries a finish engineers can measure and verify, not just a claim on a spec sheet.",
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
            body: "MMP (Micro Machining Process) is a mechanical-physical-catalytic treatment performed in dedicated tanks. It selectively removes frequencies of surface roughness from components our customers manufacture, nothing added and the form kept, just a controlled finish verified against measurable roughness targets.",
            steps: [
              { step: "01", title: "Validation", description: "Component geometry, material and target roughness are assessed before treatment begins." },
              { step: "02", title: "Treatment", description: "The MMP process runs in-house, in tanks tuned to the component and finish required." },
              { step: "03", title: "Verification", description: "Every batch is measured against the agreed roughness spec before it ships." },
            ],
            // TEMP placeholder photography, public/images/placeholders/README.md. Replace with media-library URLs.
            images: [
              { src: "/images/placeholders/process-01-bevel-pinion.jpg", alt: "Spiral bevel pinion gear with mirror-polished tooth flanks on a white background", caption: "Spiral bevel pinion, superfinished flanks" },
              { src: "/images/placeholders/process-02-turbo-wheels-before-after.jpg", alt: "Two turbocharger turbine wheels side by side: the left as cast with inspection marks, the right mirror-polished after MMP treatment", caption: "Turbocharger wheels: as cast vs MMP-finished" },
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
            heading: "Case studies\nthat prove impact.",
            body: "Real engineering challenges. Measurable results across the industries we serve.",
            emptyState:
              "We're publishing our first case studies shortly. In the meantime, tell us about your components and we'll walk you through comparable work directly.",
          },
        },
        {
          type: "testimonialsTeaser",
          fields: {
            eyebrow: "Trusted By",
            heading: "What manufacturers say.",
            emptyState: "Client testimonials are being collected as projects complete, check back soon.",
          },
        },
        {
          type: "newsTeaser",
          fields: {
            eyebrow: "News & Insights",
            heading: "Latest research.\nReal impact.",
            body: "Explore our latest research, technical studies, engineering insights and developments in precision surface technology.",
            emptyState: "Our first posts on treatment process, validation and industry standards are coming soon.",
          },
        },
        {
          type: "contactTeaser",
          fields: {
            eyebrow: "Get In Touch",
            heading: "Tell us what you need finished.",
            body: "Share your component, tolerance and volume, our engineers will get back to you with a treatment recommendation, not a sales script.",
          },
        },
      ],
      seo: baseSeo(
        "INFINI | Precision Surface-Finishing",
        "INFINI applies ISO 9001-certified MMP surface finishing to components precision manufacturers already make, validated in-house, verified before it ships."
      ),
    },
    company: {
      id: "company" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Company",
            heading: "A specialist surface finishing partner, not a manufacturer.",
            body: "INFINI Precision Pvt. Ltd. applies MMP surface finishing technology to components its customers manufacture, it does not manufacture the parts itself. The company operates from a treatment facility in Parwanoo, Himachal Pradesh, and serves precision manufacturers across seven industries.",
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
            body: "INFINI's MMP (Micro Machining Process) technology is a mechanical treatment, not a chemical one, applied to parts placed in a treatment tank. It maps a surface as a collection of roughness frequencies and removes the highest frequencies first, working progressively lower, which means the process can stop at any target roughness rather than over-treating the part. Because material removal is controlled and selective, MMP preserves the part's form, including fine features that conventional polishing would alter or destroy.",
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
        "About INFINI: Precision Surface Finishing",
        "INFINI Precision Pvt. Ltd. applies MMP surface finishing technology from its treatment facility in Parwanoo, Himachal Pradesh, serving precision manufacturers across seven industries."
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
            body: "MMP treatment covers a range of finishes on a single process, the same underlying technology takes a surface from a specified controlled roughness through to a mirror-like finish, depending on what the application needs.",
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
                  "Because material removal is controlled and selective rather than abrasive across the whole surface, MMP preserves the part's form, including fine features that conventional polishing would alter or destroy.",
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
        "Capabilities: MMP Surface Finishing Process",
        "INFINI's treatment capabilities: MMP surface finishing from controlled roughness to mirror-like brilliance, with measured, traceable batch validation."
      ),
    },
    // The four pages below keep their exact legacy slugs (PRD decision D7,
    // T16), each independently ranks for its own search terms, and a
    // redirect into a generic Capabilities hub would throw that away.
    // Content is drafted from the equivalent pages on the live infini.co.in
    // site, then genuinely expanded, not a reformat of the original.
    technology: {
      id: "technology" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Technology",
            heading: "The MMP process, explained.",
            body: "MMP is the technology every INFINI treatment is built on, a mechanical-physical-catalyst process, not a chemical or acid-based one, that removes surface roughness with a precision conventional polishing can't match.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "What MMP actually is",
            body: "MMP Technology was developed by BinC Industries in Switzerland, around media and equipment it designs in-house and a controlled method for using them. INFINI applies it in India, as a treatment service in its own tanks. The part is fixtured in a processing tank charged with microtools, tiny engineered particles, and a catalyst that bonds them into aggregates. Unlike chemical or acid-based finishing, which can alter a material's surface chemistry or mechanical properties, the aggregates remove material by a genuinely mechanical cutting action at a microscopic scale, so the part's composition and physical properties are unchanged.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "How frequency-based removal works",
            body: "A surface isn't uniformly rough. It's a mix of roughness at different frequencies, from broad waviness down to fine microscopic texture. MMP maps a surface as exactly that: a collection of roughness frequencies, and treats them in order, removing the highest frequencies first and then working progressively lower. Each band is removed by aggregates matched to it: the aggregate's surface fits irregularities of that size the way Velcro fits, and the flow shears them off. Because the process targets specific frequency ranges rather than abrading the whole surface indiscriminately, it can stop at any point along the way, treating only the roughness range that's actually a problem, and leaving the rest of the surface's character intact.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Why the part's form survives treatment",
            body: "Traditional polishing is abrasive across the whole surface, which means it doesn't discriminate between roughness that needs removing and fine geometric features that don't, sharp edges, small radii, engineered micro-textures all get worn down along with the roughness. Because MMP's material removal is selective rather than blanket abrasion, it preserves the part's form, including fine features that conventional polishing would alter or destroy.",
          },
        },
        {
          type: "list",
          fields: {
            heading: "Materials MMP treats",
            items: [
              "Stainless and high-speed steels",
              "Copper, titanium, and nickel alloys",
              "Carbide, ceramics, and precious metals",
              "CVD- and PVD-coated components",
              "CIM, MIM, and DMLS (additive/injection-molded metal) parts",
            ],
          },
        },
      ],
      seo: baseSeo(
        "MMP Technology: The Process Behind INFINI's Surface Finishing",
        "How MMP (Micro Machining Process) technology works: a licensed mechanical-physical-catalyst treatment that removes surface roughness by frequency, preserving part form and fine geometric features."
      ),
    },
    validation: {
      id: "validation" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Validation",
            heading: "How a treatment gets validated before it runs at volume.",
            body: "Every MMP treatment moves through three stages before it becomes a production process: technical validation, industrial validation, and industrial production, so nothing reaches volume without measured proof it does what it's supposed to.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Technical validation",
            body: "The process starts with analysis of the actual workpiece surface by measuring its roughness, not by assumption. INFINI accounts for the specific material being treated, establishes the customer's objectives and constraints, and runs a minimum of three MMP treatments so the customer can select the result that best matches what they need.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Industrial validation",
            body: "Once a target is agreed, treatment is applied to a production-representative batch quantity, establishing an initial surface roughness bell curve, the real spread of results a production run actually produces, not a single best-case sample. From there, a quality process is determined and implemented for traceability and control, and the customer verifies and approves the industrial process before it's used at scale.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Industrial production",
            body: "The final stage is where validation becomes an ongoing process rather than a one-time check: the customer validates production results, production scheduling is coordinated directly with them, and INFINI develops improvement strategies and measures service level over time, validation doesn't end when production starts, it continues alongside it.",
          },
        },
      ],
      seo: baseSeo(
        "Validation Process: How INFINI Verifies Surface Finishing Results",
        "INFINI's three-stage validation process for MMP surface treatment: technical validation, industrial validation, and industrial production, each measured and customer-verified before scaling up."
      ),
    },
    "deburring-polishing": {
      id: "deburring-polishing" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Deburring & Polishing",
            heading: "Deburring and polishing, and where MMP does it differently.",
            body: "Traditional deburring and polishing get a surface smooth by removing material indiscriminately, by hand or by machine. MMP treats only the roughness that's actually a problem, with less material removed and a more consistent result.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Traditional deburring and polishing",
            body: "Polishing smooths and brightens a part's surface through abrasion, by hand or by machine. The objective is a high-quality surface state, usually characterized by some combination of low roughness, gloss, and brightness. Deburring removes unwanted material (burrs left over from machining or forming) using files or grinders for small quantities, or barrel treatment for larger batches.",
          },
        },
        {
          type: "list",
          fields: {
            heading: "Common traditional techniques",
            items: [
              "Hand polishing",
              "Automatic robotic polishing",
              "Tribo finishing (mass vibratory finishing)",
              "Pressurized abrasive paste (extrude honing)",
              "REM process (acid attack followed by abrasion)",
              "Laser or electron-beam polishing",
            ],
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Where MMP differs",
            body: "MMP selectively treats only the actual roughness present on a surface, rather than abrading it uniformly, which is what makes it possible to reach a super-finished surface with only minuscule material removal. The process combines mechanical-physical-catalyst technology with a high-energy flux of engineered particles sized to match the specific roughness level being removed, delivering results with superior reproducibility and homogeneity from part to part, and preserving the part's original form rather than gradually wearing it down.",
          },
        },
      ],
      seo: baseSeo(
        "Deburring & Polishing vs. MMP Technology",
        "How traditional deburring and polishing compare to MMP surface treatment, less material removal, more consistent results, and preserved part geometry."
      ),
    },
    "mirror-like-finish": {
      id: "mirror-like-finish" as const,
      sections: [
        {
          type: "hero",
          fields: {
            eyebrow: "Mirror-Like Finish",
            heading: "A true mirror finish, without losing the part's form.",
            body: "A mirror-like surface requires the total elimination of surface roughness, MMP gets there by selectively filtering out successive levels of roughness without changing the surface's underlying shape.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "What a mirror-like surface actually requires",
            body: "Most finishing work targets a controlled roughness, smooth enough for the application, not necessarily roughness-free. A mirror-like finish is a different, stricter target: the total elimination of surface roughness across the treated area. MMP reaches that target by selectively filtering out successive levels of roughness, working from the coarsest down to the finest, without changing the basic form of the surface underneath.",
          },
        },
        {
          type: "textBlock",
          fields: {
            heading: "Strengths, and where it doesn't apply",
            body: "Because material removal stays targeted to roughness rather than blanket abrasion, MMP reaches a mirror finish with far less material removed than traditional cutting-action polishing, which also means fine details and sharp edges survive treatment, and complex geometries finish uniformly rather than unevenly. The constraint is the flip side of how the process works: because MMP treats a surface uniformly, it can't fix form errors that need non-uniform material removal or reshaping. A part that's out of tolerance in a specific area needs localized correction first. That's a different problem than surface roughness, and outside what this process solves. Deep scratches are the same case: they run deeper than the roughness being filtered, so they need removing before treatment.",
          },
        },
        {
          type: "list",
          fields: {
            heading: "Where it's used",
            items: [
              "Medical implants and surgical instrumentation",
              "Plastic injection mold cavities",
              "Metal and ceramic injection-molded (MIM/CIM) components, where the surface lacks porosity",
            ],
          },
        },
      ],
      seo: baseSeo(
        "Mirror-Like Finish: MMP Surface Treatment",
        "How INFINI achieves a true mirror-like finish through MMP surface treatment, total roughness elimination with minimal material removal, for medical implants, injection molds, and precision components."
      ),
    },
  };
}
