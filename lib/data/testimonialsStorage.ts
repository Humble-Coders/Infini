import fs from "fs";
import path from "path";
import { DEMO_TESTIMONIALS } from "@/lib/demo/testimonials";
import type { TestimonialDoc, WithId } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "testimonials.json");

function readFallbackFile(): WithId<TestimonialDoc>[] | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as WithId<TestimonialDoc>[];
      }
    }
  } catch (err) {
    console.warn("[testimonialsStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(data: WithId<TestimonialDoc>[]) {
  // Production disk is ephemeral and per instance: Firestore is the only store there.
  if (process.env.NODE_ENV === "production") return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[testimonialsStorage] Failed to write fallback file:", err);
  }
}

/**
 * Retrieve all testimonials (published and drafts).
 * In production: Reads from Google Cloud Firestore (the global cloud source of truth).
 * In development: Uses local persisted file fallback for immediate offline updates, falling back to Firestore.
 */
export async function getStoredTestimonials(): Promise<WithId<TestimonialDoc>[]> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snapshot = await adminDb
        .collection("testimonials")
        .orderBy("order", "asc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as TestimonialDoc),
        }));
      }
      // An empty collection is a real answer in production, never a cue for demo data.
      return [];
    } catch (err) {
      console.warn("[testimonialsStorage] Production Firestore read fallback:", err);
    }
  }

  // Local development file check
  const fileData = readFallbackFile();
  if (fileData && fileData.length > 0) {
    return fileData.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  if (!isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snapshot = await adminDb
        .collection("testimonials")
        .orderBy("order", "asc")
        .get();

      if (!snapshot.empty) {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as TestimonialDoc),
        }));
        writeFallbackFile(docs);
        return docs;
      }
    } catch {
      // offline dev
    }
  }

  // Seed with default demo testimonials if empty
  writeFallbackFile(DEMO_TESTIMONIALS);
  return DEMO_TESTIMONIALS;
}

/**
 * Retrieve only published testimonials for the public client side (homepage carousel).
 */
export async function getStoredPublishedTestimonials(): Promise<WithId<TestimonialDoc>[]> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snapshot = await adminDb
        .collection("testimonials")
        .where("published", "==", true)
        .orderBy("order", "asc")
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as TestimonialDoc),
        }));
      }
      // An empty collection is a real answer in production, never a cue for demo data.
      return [];
    } catch (err) {
      console.warn("[testimonialsStorage] Production Firestore published query fallback:", err);
    }
  }

  const all = await getStoredTestimonials();
  return all
    .filter((t) => t.published)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Save (create or update) a testimonial.
 * Persists locally and synchronizes to Firestore if cloud credentials are present.
 */
export async function saveStoredTestimonial(
  item: WithId<TestimonialDoc>
): Promise<WithId<TestimonialDoc>> {
  const all = await getStoredTestimonials();
  const existingIdx = all.findIndex((t) => t.id === item.id);

  let updatedList: WithId<TestimonialDoc>[];
  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = item;
  } else {
    updatedList = [...all, item];
  }

  updatedList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  writeFallbackFile(updatedList);

  // Attempt Firestore write (in production / when cloud credentials exist)
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const { id, ...docData } = item;
    await adminDb.collection("testimonials").doc(id).set(docData, { merge: true });
  } catch (err) {
    console.warn("[testimonialsStorage] Firestore Admin write skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return item;
}

/**
 * Delete a testimonial by ID.
 * Removes locally and deletes from Firestore if cloud credentials are present.
 */
export async function deleteStoredTestimonial(id: string): Promise<boolean> {
  const all = await getStoredTestimonials();
  const filtered = all.filter((t) => t.id !== id);

  writeFallbackFile(filtered);

  // Attempt Firestore delete
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("testimonials").doc(id).delete();
  } catch (err) {
    console.warn("[testimonialsStorage] Firestore Admin delete skipped/failed:", err);
    if (process.env.NODE_ENV === "production") throw err;
  }

  return true;
}
