import fs from "fs";
import path from "path";
import type { CaseStudyDoc, CaseStudyResult, CaseStudySpecs, FirestoreTimestamp, WithId } from "@/lib/types";

export interface StoredCaseStudy {
  id: string;
  slug: string;
  title: string;
  industry: string;
  industryId?: string;
  challenge: string;
  solution: string;
  process?: string;
  result?: string;
  results?: CaseStudyResult[];
  beforeRa: string;
  afterRa: string;
  toolLifeGain: string;
  beforeImage: string;
  afterImage: string;
  material: string;
  specs?: CaseStudySpecs;
  gallery?: string[];
  published: boolean;
  publishedAt?: string | FirestoreTimestamp;
  createdAt?: string;
  sourceUrl?: string;
  seo?: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonical: string;
    noindex: boolean;
  };
}

export const INITIAL_CASE_STUDIES: StoredCaseStudy[] = [
  {
    id: "cs-1",
    slug: "turbine-blisk-internal-passages",
    title: "Turbine Blisk Internal Passages Superfinishing",
    industry: "Aerospace",
    industryId: "aerospace",
    challenge:
      "Complex internal aerofoil cooling passages suffered from micro-scratches and recast layer following EDM, creating stress concentrations.",
    solution:
      "Multi-axis selective MMP formulation filtered high-frequency surface wave-lengths without eroding leading edge tolerances.",
    process:
      "Passage roughness sampled by replica casting before and after, aerofoil profile scanned on a CMM, and wall thickness re-confirmed at thinnest sections.",
    result:
      "Internal cooling passage roughness fell from Ra 0.80 µm to Ra 0.03 µm with no dimensional deviation, extending fatigue life by +280%.",
    results: [
      { label: "Surface Roughness", value: "Ra 0.80 -> 0.03 µm", direction: "down" },
      { label: "Fatigue Life", value: "+280% Extension", direction: "up" },
      { label: "Aerofoil Profile", value: "Zero Deviation", direction: "check" },
    ],
    beforeRa: "0.80 µm",
    afterRa: "0.03 µm",
    toolLifeGain: "+280% Fatigue Life",
    beforeImage: "/images/cutting-tool-1.jpg",
    afterImage: "/images/cutting-tool-3.webp",
    material: "Inconel 718",
    specs: {
      material: "Inconel 718",
      process: "Multi-axis MMP Whole-Component Treatment",
      duration: "9 hours per batch",
    },
    published: true,
    createdAt: "2026-03-04T10:00:00.000Z",
  },
  {
    id: "cs-2",
    slug: "carbide-gun-drills-edge-honing",
    title: "Solid Carbide Gun Drills Edge Honing",
    industry: "Cutting Tools",
    industryId: "cutting-tools",
    challenge:
      "Micro-chipping on cutting edges led to premature tool failure during deep hole automotive crankshaft drilling.",
    solution:
      "Controlled MMP micro-edge honing imparted an exact 15 µm symmetric edge radius while polishing flutes to mirror brilliance.",
    process:
      "Sub-micron aggregate formulation tuned to remove micro-serrations along the cutting line while polishing flute valleys for laminar chip evacuation.",
    result:
      "Edge chipping completely eliminated and tool life extended by +320% across 50,000 hole cycles.",
    results: [
      { label: "Flute Roughness", value: "Ra 0.45 -> 0.02 µm", direction: "down" },
      { label: "Tool Life", value: "+320% Increase", direction: "up" },
      { label: "Edge Radius", value: "15 µm Symmetric", direction: "check" },
    ],
    beforeRa: "0.45 µm",
    afterRa: "0.02 µm",
    toolLifeGain: "+320% Tool Life",
    beforeImage: "/images/cutting-tool-2.png",
    afterImage: "/images/cutting-tool-3.webp",
    material: "Tungsten Carbide",
    specs: {
      material: "Sub-micron Grain Tungsten Carbide",
      process: "MMP Edge Honing & Flute Polish",
      duration: "Production Batch",
    },
    published: true,
    createdAt: "2026-02-18T14:00:00.000Z",
  },
  {
    id: "cs-3",
    slug: "femoral-knee-component-mirror-finish",
    title: "Femoral Knee Component Mirror Finish Without Edge Rounding",
    industry: "Medical Implants",
    industryId: "medical-implants",
    challenge:
      "Hand polishing reached mirror finish on the bearing surface but rounded transition edges inconsistently from operator to operator.",
    solution:
      "Replaced manual buffing with an automated MMP cycle that treats the whole bearing surface uniformly without rounding critical blend radii.",
    process:
      "Five-point profilometry verification per component with shadowgraph edge inspection against the CAD master.",
    result:
      "Consistent Ra 0.02 µm achieved across 100% of implants with zero batch rejection.",
    results: [
      { label: "Bearing Ra", value: "0.02 µm Verified", direction: "down" },
      { label: "Edge Geometry", value: "Matches Master", direction: "check" },
      { label: "Batch Variance", value: "Inside ISO Limit", direction: "check" },
    ],
    beforeRa: "0.62 µm",
    afterRa: "0.02 µm",
    toolLifeGain: "100% Batch Consistency",
    beforeImage: "/images/placeholders/process-01-bevel-pinion.jpg",
    afterImage: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    material: "CoCrMo, Forged",
    specs: {
      material: "CoCrMo Medical Grade",
      process: "MMP Controlled Bearing Superfinish",
      duration: "Cleanroom Validated",
    },
    published: true,
    createdAt: "2026-01-20T09:00:00.000Z",
  },
  {
    id: "cs-4",
    slug: "helical-gear-set-contact-fatigue",
    title: "Helical Gear Set, Micropitting Under Sustained Torque",
    industry: "Gears & Transmission",
    industryId: "gears-transmission",
    challenge:
      "Ground helical gears showed micropitting on the flanks after endurance running due to directional peak stresses breaking the oil film.",
    solution:
      "MMP treatment selectively removed directional grinding peaks while preserving gear tooth profile and tip relief intact.",
    process:
      "Flank roughness traced before and after across multiple teeth on a Klingelnberg gear analyzer.",
    result:
      "Flank roughness reduced from Ra 0.62 µm to Ra 0.11 µm with zero micropitting after full endurance load testing.",
    results: [
      { label: "Flank Ra", value: "0.62 -> 0.11 µm", direction: "down" },
      { label: "Profile Deviation", value: "In Drawing Tolerance", direction: "check" },
      { label: "Micropitting", value: "Zero After 10M Cycles", direction: "check" },
    ],
    beforeRa: "0.62 µm",
    afterRa: "0.11 µm",
    toolLifeGain: "Zero Micropitting",
    beforeImage: "/images/placeholders/process-01-bevel-pinion.jpg",
    afterImage: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    material: "18CrNiMo7-6 Case-Hardened",
    specs: {
      material: "18CrNiMo7-6 Steel",
      process: "MMP Flank Superfinishing",
      duration: "6 hours per batch",
    },
    published: true,
    createdAt: "2026-02-11T12:00:00.000Z",
  },
  {
    id: "cs-5",
    slug: "laser-fused-bracket-as-built-roughness",
    title: "Laser-Fused Bracket, As-Built Roughness on a Flight Part",
    industry: "Additive Manufacturing",
    industryId: "additive-manufacturing",
    challenge:
      "Sintered powder particles on 3D printed aerospace brackets created high friction and fatigue crack initiation sites.",
    solution:
      "MMP treatment polished internal contours and lattices without thinning critical thin-wall features.",
    process:
      "Volumetric flow-based MMP formulation penetrating interior voids and external mounting faces simultaneously.",
    result:
      "As-printed roughness dropped from Ra 18 µm to Ra 2.4 µm with full dimensional compliance.",
    results: [
      { label: "Surface Ra", value: "18 -> 2.4 µm", direction: "down" },
      { label: "Dimensional Loss", value: "< 0.005 mm", direction: "check" },
      { label: "Fatigue Life", value: "+190% Improvement", direction: "up" },
    ],
    beforeRa: "18.0 µm",
    afterRa: "2.40 µm",
    toolLifeGain: "+190% Fatigue Life",
    beforeImage: "/images/cutting-tool-1.jpg",
    afterImage: "/images/cutting-tool-2.png",
    material: "Ti-6Al-4V Grade 23",
    specs: {
      material: "Ti-6Al-4V Additive",
      process: "MMP Additive Superfinish",
      duration: "4 hours per batch",
    },
    published: true,
    createdAt: "2026-03-15T08:00:00.000Z",
  },
  {
    id: "cs-6",
    slug: "mould-cavity-release-drag",
    title: "Mould Cavity, Release Drag Across Multi-Cavity Tool",
    industry: "Plastic Injection Molds",
    industryId: "plastic-injection-molds",
    challenge:
      "EDM texture in deep mold ribs caused part sticking, high ejection forces, and cosmetic drag marks on molded optical casings.",
    solution:
      "Applied isotropic non-directional MMP polish that eliminates demolding resistance without rounding sharp shutoff corners.",
    process:
      "Precision masking on parting lines with targeted cavity media finishing.",
    result:
      "Ejection forces dropped by 45%, cycle time reduced by 3.2 seconds, and cosmetic drag marks eliminated.",
    results: [
      { label: "Cavity Finish", value: "< Ra 0.01 µm", direction: "down" },
      { label: "Ejection Force", value: "-45% Reduction", direction: "down" },
      { label: "Cycle Time", value: "-3.2s Faster", direction: "up" },
    ],
    beforeRa: "0.75 µm",
    afterRa: "0.01 µm",
    toolLifeGain: "-45% Ejection Force",
    beforeImage: "/images/cutting-tool-2.png",
    afterImage: "/images/cutting-tool-3.webp",
    material: "H13 Tool Steel (52 HRC)",
    specs: {
      material: "Premium H13 Tool Steel",
      process: "MMP Non-Directional Mold Polish",
      duration: "Toolroom Cycle",
    },
    published: true,
    createdAt: "2026-04-02T15:00:00.000Z",
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "caseStudies.json");

function readFallbackFile(): StoredCaseStudy[] | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as StoredCaseStudy[];
      }
    }
  } catch (err) {
    console.warn("[caseStudiesStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(data: StoredCaseStudy[]) {
  // Production disk is ephemeral and per instance: Firestore is the only store there.
  if (process.env.NODE_ENV === "production") return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[caseStudiesStorage] Failed to write fallback file:", err);
  }
}

export function toTimestamp(val: unknown): FirestoreTimestamp {
  if (val && typeof (val as { toDate?: unknown }).toDate === "function") {
    return val as FirestoreTimestamp;
  }
  let date: Date;
  if (typeof val === "string") {
    date = new Date(val);
  } else if (typeof val === "number") {
    date = new Date(val);
  } else if (val && typeof (val as { seconds?: unknown }).seconds === "number") {
    date = new Date((val as { seconds: number }).seconds * 1000);
  } else {
    date = new Date();
  }
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  return {
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: 0,
  };
}

export function caseStudyToDoc(item: StoredCaseStudy): WithId<CaseStudyDoc> {
  const industryId =
    item.industryId ||
    item.industry?.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    "aerospace";

  const results: CaseStudyResult[] =
    item.results && item.results.length > 0
      ? item.results
      : [
          { label: "Before Ra", value: item.beforeRa || "0.60 µm", direction: "down" },
          { label: "Finished Ra", value: item.afterRa || "0.02 µm", direction: "up" },
          { label: "Tool Life / Gain", value: item.toolLifeGain || "+280%", direction: "check" },
        ];

  const dateObj = item.createdAt ? new Date(item.createdAt) : new Date();
  const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

  return {
    id: item.id || item.slug,
    slug: item.slug,
    title: item.title,
    industryId,
    challenge: item.challenge,
    solution: item.solution,
    process: item.process || item.solution || "Controlled MMP precision micro-finishing.",
    result: item.result || item.toolLifeGain || "Surface roughness improved to mirror finish.",
    results,
    beforeImage: item.beforeImage || "/images/cutting-tool-1.jpg",
    afterImage: item.afterImage || "/images/cutting-tool-3.webp",
    gallery: item.gallery || [],
    specs: {
      material: item.material || item.specs?.material || "Specialty Alloy",
      process: item.specs?.process || "MMP Surface Treatment",
      duration: item.specs?.duration || "Production Validated",
      ...item.specs,
    },
    published: typeof item.published === "boolean" ? item.published : true,
    publishedAt: toTimestamp(validDate),
    seo: {
      title: item.seo?.title || `${item.title} | Case Study | INFINI`,
      description: item.seo?.description || item.challenge || item.title,
      ogTitle: item.seo?.ogTitle || item.title,
      ogDescription: item.seo?.ogDescription || item.challenge || item.title,
      ogImage: item.afterImage || "",
      canonical: `/case-studies/${item.slug}`,
      noindex: !item.published,
    },
  };
}

/**
 * Retrieve all case studies (for admin console).
 */
export async function getStoredCaseStudies(): Promise<StoredCaseStudy[]> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snapshot = await adminDb
        .collection("caseStudies")
        .orderBy("publishedAt", "desc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug || doc.id,
            title: data.title || "",
            industry: data.industry || (data.industryId ? data.industryId.replace(/-/g, " ") : "Aerospace"),
            industryId: data.industryId,
            challenge: data.challenge || "",
            solution: data.solution || "",
            process: data.process,
            result: data.result,
            results: data.results,
            beforeRa: data.beforeRa || (data.results?.[0]?.value ?? "0.60 µm"),
            afterRa: data.afterRa || (data.results?.[1]?.value ?? "0.02 µm"),
            toolLifeGain: data.toolLifeGain || (data.results?.[2]?.value ?? data.result ?? "+280%"),
            beforeImage: data.beforeImage || "/images/cutting-tool-1.jpg",
            afterImage: data.afterImage || "/images/cutting-tool-3.webp",
            material: data.material || data.specs?.material || "Specialty Alloy",
            published: typeof data.published === "boolean" ? data.published : true,
            createdAt: data.createdAt || (data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : undefined),
            sourceUrl: data.sourceUrl,
          };
        });
      }
      // An empty collection is a real answer in production, never a cue for demo data.
      return [];
    } catch (err) {
      console.warn("[caseStudiesStorage] Production Firestore read fallback:", err);
    }
  }

  // Local development file check
  const fileData = readFallbackFile();
  if (fileData && fileData.length > 0) {
    return fileData;
  }

  if (!isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snapshot = await adminDb.collection("caseStudies").get();
      if (!snapshot.empty) {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StoredCaseStudy[];
        writeFallbackFile(docs);
        return docs;
      }
    } catch {
      // offline dev
    }
  }

  // Seed default case studies if none exist
  writeFallbackFile(INITIAL_CASE_STUDIES);
  return INITIAL_CASE_STUDIES;
}

/**
 * Retrieve all published case studies for public pages (`HomePage`, `/case-studies`).
 */
export async function getStoredPublishedCaseStudies(): Promise<WithId<CaseStudyDoc>[]> {
  const all = await getStoredCaseStudies();
  const published = all
    .filter((cs) => cs.published)
    .map(caseStudyToDoc);

  return published;
}

/**
 * Retrieve single case study by slug.
 */
export async function getStoredCaseStudyBySlug(slug: string): Promise<WithId<CaseStudyDoc> | null> {
  const all = await getStoredCaseStudies();
  const found = all.find((cs) => cs.slug === slug);
  if (!found) return null;

  if (process.env.NODE_ENV === "production" && !found.published) {
    return null;
  }

  return caseStudyToDoc(found);
}

/**
 * Retrieve case studies filtered by industry ID.
 */
export async function getStoredCaseStudiesByIndustry(industryId: string): Promise<WithId<CaseStudyDoc>[]> {
  const all = await getStoredPublishedCaseStudies();
  return all.filter((cs) => cs.industryId === industryId);
}

/**
 * Retrieve all published slugs for `generateStaticParams`.
 */
export async function getStoredPublishedCaseStudySlugs(): Promise<string[]> {
  const all = await getStoredCaseStudies();
  return all
    .filter((cs) => cs.published)
    .map((cs) => cs.slug);
}

/**
 * Save (create or update) a case study.
 */
export async function saveStoredCaseStudy(payload: Partial<StoredCaseStudy>): Promise<StoredCaseStudy> {
  const all = await getStoredCaseStudies();

  const slug =
    payload.slug ||
    payload.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    `cs-${Date.now()}`;

  const id = payload.id && !payload.id.startsWith("cs-") ? payload.id : slug;
  const nowIso = new Date().toISOString();

  const industry = payload.industry || "Aerospace";
  const industryId =
    payload.industryId || industry.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const fullCaseStudy: StoredCaseStudy = {
    id,
    slug,
    title: payload.title || "Untitled Case Study",
    industry,
    industryId,
    challenge: payload.challenge || "",
    solution: payload.solution || "",
    process: payload.process || payload.solution || "Controlled MMP precision micro-finishing.",
    result: payload.toolLifeGain || "",
    // Only the measurements the editor entered: a published dossier never carries invented numbers.
    results: (
      [
        { label: "Initial Ra", value: payload.beforeRa || "", direction: "down" },
        { label: "Target Ra", value: payload.afterRa || "", direction: "up" },
        { label: "Tool Life / Gain", value: payload.toolLifeGain || "", direction: "check" },
      ] as CaseStudyResult[]
    ).filter((r) => r.value.trim() !== ""),
    beforeRa: payload.beforeRa || "",
    afterRa: payload.afterRa || "",
    toolLifeGain: payload.toolLifeGain || "",
    beforeImage: payload.beforeImage || "/images/cutting-tool-1.jpg",
    afterImage: payload.afterImage || "/images/cutting-tool-3.webp",
    material: payload.material || "Specialty Alloy",
    specs: {
      material: payload.material || "Specialty Alloy",
      process: "MMP Surface Treatment",
      duration: "Validated Production",
      ...payload.specs,
    },
    // Unspecified means draft: nothing goes live without an explicit publish.
    published: typeof payload.published === "boolean" ? payload.published : false,
    createdAt: payload.createdAt || nowIso,
    sourceUrl: payload.sourceUrl,
  };

  const existingIdx = all.findIndex((cs) => cs.id === id || cs.slug === slug);
  // Editing keeps the original publish date, so a correction doesn't reorder the list.
  const firstPublished = existingIdx >= 0 ? all[existingIdx].createdAt : undefined;
  let updatedList: StoredCaseStudy[];

  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...fullCaseStudy,
      createdAt: updatedList[existingIdx].createdAt || nowIso,
    };
  } else {
    updatedList = [fullCaseStudy, ...all];
  }

  writeFallbackFile(updatedList);

  // Attempt Firestore Admin write if cloud credentials exist
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const { Timestamp } = await import("firebase-admin/firestore");
    const docData = {
      ...fullCaseStudy,
      publishedAt: firstPublished && !Number.isNaN(Date.parse(firstPublished)) ? Timestamp.fromDate(new Date(firstPublished)) : Timestamp.now(),
      seo: {
        title: `${fullCaseStudy.title} | Case Study | INFINI`,
        description: fullCaseStudy.challenge || fullCaseStudy.title,
        ogTitle: fullCaseStudy.title,
        ogDescription: fullCaseStudy.challenge || fullCaseStudy.title,
        ogImage: fullCaseStudy.afterImage || "",
        canonical: `/case-studies/${fullCaseStudy.slug}`,
        noindex: !fullCaseStudy.published,
      },
    };
    await adminDb.collection("caseStudies").doc(id).set(docData, { merge: true });
  } catch (err) {
    console.warn("[caseStudiesStorage] Firestore Admin write skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return fullCaseStudy;
}

/**
 * Delete a case study by ID or slug.
 */
export async function deleteStoredCaseStudy(idOrSlug: string): Promise<boolean> {
  const all = await getStoredCaseStudies();
  const target = all.find((cs) => cs.id === idOrSlug || cs.slug === idOrSlug);
  const filtered = all.filter((cs) => cs.id !== idOrSlug && cs.slug !== idOrSlug);

  writeFallbackFile(filtered);

  // Attempt Firestore delete: by the document id, which can differ from the slug.
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const ids = new Set([idOrSlug, ...(target?.id ? [target.id] : [])]);
    await Promise.all([...ids].map((docId) => adminDb.collection("caseStudies").doc(docId).delete()));
  } catch (err) {
    console.warn("[caseStudiesStorage] Firestore Admin delete skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return true;
}
