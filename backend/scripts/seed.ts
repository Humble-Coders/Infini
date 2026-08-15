/**
 * Populates the Firestore emulator with the 7 industries, 4 certifications,
 * and light sample content for the other collections, for local dev.
 *
 * Run via `npm run seed` (wraps this in `firebase emulators:exec`, which
 * starts the emulator, sets FIRESTORE_EMULATOR_HOST, runs this script, then
 * tears the emulator down). Never targets a real project — there is no
 * credential path here that could reach production Firestore.
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error(
    "FIRESTORE_EMULATOR_HOST is not set — run this via `npm run seed`, not directly, so it never touches a real project."
  );
}

const app = initializeApp({ projectId: process.env.GCLOUD_PROJECT ?? "infini-2fdec" });
const db = getFirestore(app);

const baseSeo = (title: string, description: string) => ({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "",
  canonical: "",
  noindex: false,
});

const CERTIFICATIONS = [
  {
    id: "iso-9001-2015",
    name: "ISO 9001:2015",
    logoUrl: "",
    certificateNumber: "Q-000001",
    issuedDate: Timestamp.fromDate(new Date("2024-01-15")),
    validUntil: Timestamp.fromDate(new Date("2027-01-14")),
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
    issuedDate: Timestamp.fromDate(new Date("2024-03-01")),
    validUntil: Timestamp.fromDate(new Date("2027-02-28")),
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
    issuedDate: Timestamp.fromDate(new Date("2024-01-15")),
    validUntil: Timestamp.fromDate(new Date("2027-01-14")),
    description: "Environmental management system certification for INFINI's treatment facility.",
    fileUrl: "",
    order: 3,
    published: true,
  },
  {
    id: "as9100d",
    name: "AS9100D",
    logoUrl: "",
    certificateNumber: "A-000004",
    issuedDate: Timestamp.fromDate(new Date("2024-06-01")),
    validUntil: Timestamp.fromDate(new Date("2027-05-31")),
    description: "Aerospace quality management certification for fatigue-critical structural and rotating components.",
    fileUrl: "",
    order: 4,
    published: true,
  },
];

const INDUSTRIES = [
  {
    slug: "cutting-tools",
    name: "Cutting Tools",
    order: 1,
    overview:
      "Grinding leaves directional roughness and micro-burrs along the cutting edge — exactly where friction and heat concentrate first. MMP treatment removes those peaks selectively, without touching the ground geometry or edge radius your tool designers specified.",
    hero: {
      headline: "Cutting edges that hold their line under load.",
      subheadline:
        "A cutting edge is only as good as what happens at the micro-scale where it meets the workpiece.",
      image: "",
    },
    capabilities: ["Edge-safe treatment", "Rake and flank face finishing", "Batch consistency"],
    applications: ["Drills", "End mills", "Reamers", "Carbide inserts", "Taps and dies", "Hobs"],
    materials: ["Tungsten carbide", "HSS (high-speed steel)", "PCD-tipped tooling", "Coated substrates (pre-coat treatment)"],
    relatedCertIds: ["iso-9001-2015"],
  },
  {
    slug: "forge-stamping-die",
    name: "Forge, Stamping & Die",
    order: 2,
    overview:
      "Galling, sticking and inconsistent release are surface-finish problems before they're anything else. MMP treatment refines die and punch surfaces to reduce the peak roughness that catches formed material.",
    hero: {
      headline: "Dies that release cleaner and run longer.",
      subheadline: "Die surfaces take direct, repeated contact with formed metal under extreme pressure.",
      image: "",
    },
    capabilities: ["Cavity and punch face finishing", "Anti-galling surface prep", "Coating-ready surfaces"],
    applications: ["Forging dies", "Progressive stamping dies", "Deep-draw tooling", "Extrusion dies", "Trim and pierce punches"],
    materials: ["Tool steel (H13, D2)", "Hardened alloy steels", "Carbide die inserts"],
    relatedCertIds: ["iso-9001-2015"],
  },
  {
    slug: "plastic-injection-molds",
    name: "Plastic Injection Molds",
    order: 3,
    overview:
      "Injection molding transfers cavity surface texture to the part with almost no tolerance for inconsistency. MMP treatment refines finish after EDM or milling without re-cutting the cavity geometry.",
    hero: {
      headline: "Cavity surfaces that let plastic flow the way it should.",
      subheadline: "Cavity surface finish shows up directly on the molded part.",
      image: "",
    },
    capabilities: ["Post-EDM finishing", "Ejection-surface treatment", "Vent and gate area access"],
    applications: ["Cavity and core inserts", "Hot-runner components", "Ejector pins and sleeves", "Multi-cavity family molds"],
    materials: ["P20 and P20+Ni tool steel", "H13 tool steel", "Stainless mold steels (420, S136)", "Beryllium-copper inserts"],
    relatedCertIds: ["iso-9001-2015"],
  },
  {
    slug: "medical-implants",
    name: "Medical Implants",
    order: 4,
    overview:
      "Implant surfaces need finishes verified to a measurable standard, not judged by eye. MMP treatment removes surface irregularities that concentrate stress and reduce fatigue life, run under ISO 13485-aligned process controls.",
    hero: {
      headline: "Contamination-free finishes for the human body.",
      subheadline: "An implant surface affects biocompatibility, fatigue life, and tissue interaction.",
      image: "",
    },
    capabilities: ["Fatigue-critical surface refinement", "Contamination-controlled process", "Traceable batch documentation"],
    applications: ["Orthopedic implants (hip, knee)", "Spinal fixation hardware", "Surgical instruments", "Dental implant components"],
    materials: ["Titanium and titanium alloys (Ti-6Al-4V)", "Cobalt-chrome alloys", "Medical-grade stainless steel (316L)"],
    relatedCertIds: ["iso-9001-2015", "iso-13485-2016"],
  },
  {
    slug: "aerospace",
    name: "Aerospace",
    order: 5,
    overview:
      "Aerospace components are specified against tight roughness tolerances precisely because surface irregularities initiate fatigue failure. MMP treatment refines machined surfaces to reduce those stress-concentration points.",
    hero: {
      headline: "Fatigue-critical surfaces, verified before they fly.",
      subheadline: "In aerospace, surface finish is a fatigue-life variable, not an aesthetic one.",
      image: "",
    },
    capabilities: ["Fatigue-life-focused finishing", "Complex-geometry access", "Measured, documented finish"],
    applications: ["Structural airframe components", "Turbine and compressor blades", "Landing gear components", "Fastener and fitting hardware"],
    materials: ["Titanium alloys", "Nickel superalloys (Inconel)", "Aerospace-grade aluminum alloys", "High-strength steel"],
    relatedCertIds: ["iso-9001-2015", "as9100d"],
  },
  {
    slug: "additive-manufacturing",
    name: "Additive Manufacturing",
    order: 6,
    overview:
      "Additive parts come off the build plate with roughness an order of magnitude higher than machined surfaces. MMP treatment reduces as-built roughness and removes loosely sintered particles on internal geometry other methods can't access.",
    hero: {
      headline: "The finish 3D printing can't give you on its own.",
      subheadline: "As-built metal AM parts carry layer lines and partially sintered particles.",
      image: "",
    },
    capabilities: ["Internal-channel finishing", "Loose-particle removal", "As-built roughness reduction"],
    applications: ["Conformal-cooled tooling inserts", "Lightweight lattice structures", "Complex ducting and manifolds", "Functional prototypes and low-volume production parts"],
    materials: ["Titanium (Ti-6Al-4V)", "Stainless steel (316L, 17-4PH)", "Nickel superalloys", "Aluminum alloys (AlSi10Mg)"],
    relatedCertIds: ["iso-9001-2015"],
  },
  {
    slug: "gears-transmission",
    name: "Gears & Transmission",
    order: 7,
    overview:
      "Two gear flanks in mesh transmit load across a surface that's rougher than it looks — those asperities generate whine, heat and scuffing wear. MMP treatment refines tooth flank surfaces without altering the tooth profile or lead.",
    hero: {
      headline: "Quieter mesh, lower friction, longer service life.",
      subheadline: "Gear tooth flank finish shows up directly in noise, friction, and wear.",
      image: "",
    },
    capabilities: ["Tooth-flank finishing", "Scuffing resistance", "Post-hardening treatment"],
    applications: ["Automotive transmission gears", "Industrial gearbox components", "Differential gears", "Bearing races and shafts"],
    materials: ["Case-hardened alloy steel", "Nitrided steel", "Powder-metal gear components"],
    relatedCertIds: ["iso-9001-2015"],
  },
];

const TESTIMONIALS = [
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

const EVENTS = [
  {
    id: "sample-trade-show-2026",
    title: "IMTEX 2026",
    startDate: Timestamp.fromDate(new Date("2026-01-20")),
    endDate: Timestamp.fromDate(new Date("2026-01-25")),
    location: "Bengaluru, India",
    description: "INFINI at IMTEX, showcasing MMP surface-finishing capability for precision manufacturers.",
    images: [] as string[],
    link: "",
    published: true,
  },
];

const NEWS = [
  {
    id: "sample-first-post",
    slug: "sample-first-post",
    title: "Sample news post",
    excerpt: "Placeholder excerpt for local development.",
    body: "Placeholder body content for local development.",
    coverImage: "",
    tags: ["announcement"],
    status: "published" as const,
    publishedAt: Timestamp.fromDate(new Date("2026-01-01")),
    authorId: "seed-script",
    seo: baseSeo("Sample news post", "Placeholder excerpt for local development."),
  },
];

async function seed() {
  const batch = db.batch();

  for (const cert of CERTIFICATIONS) {
    const { id, ...data } = cert;
    batch.set(db.collection("certifications").doc(id), data);
  }

  for (const industry of INDUSTRIES) {
    const { slug, name, ...rest } = industry;
    batch.set(db.collection("industries").doc(slug), {
      slug,
      name,
      ...rest,
      relatedCaseStudyIds: [] as string[],
      seo: baseSeo(`Surface Finishing for ${name}`, rest.overview),
      published: true,
    });
  }

  for (const testimonial of TESTIMONIALS) {
    const { id, ...data } = testimonial;
    batch.set(db.collection("testimonials").doc(id), data);
  }

  for (const event of EVENTS) {
    const { id, ...data } = event;
    batch.set(db.collection("events").doc(id), data);
  }

  for (const post of NEWS) {
    const { id, ...data } = post;
    batch.set(db.collection("news").doc(id), data);
  }

  await batch.commit();

  console.log(
    `Seeded ${INDUSTRIES.length} industries, ${CERTIFICATIONS.length} certifications, ${TESTIMONIALS.length} testimonials, ${EVENTS.length} events, ${NEWS.length} news posts.`
  );
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
