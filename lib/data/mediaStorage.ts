import fs from "fs";
import path from "path";

export interface MediaAsset {
  id: string;
  filename: string;
  alt: string;
  url: string;
  category: "parts" | "drawings" | "documents";
  contentType: string;
  dimensions: string;
  sizeKb: number;
  uploadedAt: string;
}

export const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: "med-1",
    filename: "gallery-01-turbine-ring.jpg",
    alt: "Aerospace turbine blisk ring after MMP superfinishing",
    url: "/images/placeholders/gallery-01-turbine-ring.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 284,
    uploadedAt: "12 Oct 2026",
  },
  {
    id: "med-2",
    filename: "gallery-02-spur-gear.jpg",
    alt: "Automotive transmission spur gear flank finish",
    url: "/images/placeholders/gallery-02-spur-gear.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 310,
    uploadedAt: "10 Oct 2026",
  },
  {
    id: "med-3",
    filename: "gallery-03-knee-implant.jpg",
    alt: "Medical CoCr knee femoral component mirror polish",
    url: "/images/placeholders/gallery-03-knee-implant.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 245,
    uploadedAt: "08 Oct 2026",
  },
  {
    id: "med-4",
    filename: "gallery-04-die-halves.jpg",
    alt: "Plastic injection mold cavity halves with polished ribs",
    url: "/images/placeholders/gallery-04-die-halves.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 298,
    uploadedAt: "05 Oct 2026",
  },
  {
    id: "med-5",
    filename: "gallery-05-carbide-drills.jpg",
    alt: "Solid carbide drills and endmill micro-honed cutting edges",
    url: "/images/placeholders/gallery-05-carbide-drills.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 270,
    uploadedAt: "03 Oct 2026",
  },
  {
    id: "med-6",
    filename: "gallery-06-additive-ring.jpg",
    alt: "Laser powder bed 3D printed additive lattice ring",
    url: "/images/placeholders/gallery-06-additive-ring.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 340,
    uploadedAt: "01 Oct 2026",
  },
  {
    id: "med-7",
    filename: "process-01-bevel-pinion.jpg",
    alt: "Bevel pinion gear tooth roughness before and after MMP",
    url: "/images/placeholders/process-01-bevel-pinion.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1200 x 800",
    sizeKb: 195,
    uploadedAt: "28 Sep 2026",
  },
  {
    id: "med-8",
    filename: "process-02-turbo-wheels.jpg",
    alt: "Dual turbo compressor wheels comparison",
    url: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1200 x 800",
    sizeKb: 215,
    uploadedAt: "25 Sep 2026",
  },
  {
    id: "med-9",
    filename: "iso-9001-2015-certificate.pdf",
    alt: "TUV SUD ISO 9001:2015 official accredited certificate",
    url: "/docs/iso-9001-2015-infini.pdf",
    category: "documents",
    contentType: "application/pdf",
    dimensions: "PDF Document",
    sizeKb: 1420,
    uploadedAt: "15 Jan 2026",
  },
  {
    id: "med-10",
    filename: "as9100d-aerospace-certificate.pdf",
    alt: "Bureau Veritas AS9100D aerospace quality document",
    url: "/docs/as9100d-aerospace-infini.pdf",
    category: "documents",
    contentType: "application/pdf",
    dimensions: "PDF Document",
    sizeKb: 1890,
    uploadedAt: "10 Mar 2026",
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "media.json");

function readFallbackFile(): MediaAsset[] | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      return JSON.parse(raw) as MediaAsset[];
    }
  } catch (err) {
    console.warn("[mediaStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(assets: MediaAsset[]) {
  // Production disk is ephemeral and per instance: Firestore is the only store there.
  if (process.env.NODE_ENV === "production") return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(assets, null, 2), "utf-8");
  } catch (err) {
    console.warn("[mediaStorage] Failed to write fallback file:", err);
  }
}

/**
 * Retrieve all media assets with dual-layer cloud/local persistence.
 */
export async function getStoredMedia(): Promise<MediaAsset[]> {
  // Firestore in every environment, so the library shows the real assets;
  // data/media.json is only an offline fallback for local development.
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const snap = await adminDb.collection("media").orderBy("uploadedAt", "desc").limit(100).get();
    return snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        filename: d.filename || "file",
        alt: d.alt || "",
        url: d.url || "",
        category: d.category || "parts",
        contentType: d.contentType || "image/jpeg",
        dimensions: d.dimensions || "Uploaded Web Asset",
        sizeKb: d.sizeKb || 1,
        uploadedAt: d.uploadedAt || "Recent",
      };
    });
  } catch (err) {
    if (process.env.NODE_ENV === "production") throw err;
    console.warn("[mediaStorage] Firestore unreachable, using data/media.json:", err);
    return readFallbackFile() ?? DEFAULT_MEDIA_ASSETS;
  }
}

/**
 * Save or upload a new media asset.
 */
export async function saveStoredMediaAsset(assetData: Partial<MediaAsset>): Promise<MediaAsset> {
  const current = await getStoredMedia();
  const id = assetData.id || `med-${Date.now()}`;
  const now = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const newAsset: MediaAsset = {
    id,
    filename: assetData.filename || "uploaded-asset",
    alt: assetData.alt || assetData.filename?.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") || "Media asset",
    url: assetData.url || "",
    category: assetData.category || "parts",
    contentType: assetData.contentType || "image/jpeg",
    dimensions: assetData.dimensions || "Uploaded Asset",
    sizeKb: assetData.sizeKb || 100,
    uploadedAt: assetData.uploadedAt || now,
  };

  const existingIdx = current.findIndex((a) => a.id === id);
  let updatedList: MediaAsset[];

  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...newAsset };
  } else {
    updatedList = [newAsset, ...current];
  }

  writeFallbackFile(updatedList);

  // Sync to Firestore if cloud credentials exist
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("media").doc(id).set(newAsset, { merge: true });
  } catch (err) {
    console.warn("[mediaStorage] Firestore write skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return newAsset;
}

/**
 * Delete a media asset by ID.
 */
export async function deleteStoredMediaAsset(id: string): Promise<boolean> {
  const current = await getStoredMedia();
  const filtered = current.filter((a) => a.id !== id);
  writeFallbackFile(filtered);

  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("media").doc(id).delete();
  } catch (err) {
    console.warn("[mediaStorage] Firestore delete skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return true;
}
