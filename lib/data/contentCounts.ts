import { collection, getCountFromServer } from "firebase/firestore";
import { requireDb } from "./firestore";

const CONTENT_COLLECTIONS = [
  "industries",
  "caseStudies",
  "certifications",
  "news",
  "testimonials",
  "events",
] as const;

export type ContentCollection = (typeof CONTENT_COLLECTIONS)[number];

export type ContentCounts = Record<ContentCollection, number>;

/**
 * Document counts (published + draft — rules let Content Editor/Super Admin
 * see both) across every admin-managed content collection, for the T7
 * dashboard's content-counts widget. Uses a server-side count aggregation,
 * not a full document fetch, so it stays cheap regardless of collection size.
 */
export async function getContentCounts(): Promise<ContentCounts> {
  const db = requireDb();
  const entries = await Promise.all(
    CONTENT_COLLECTIONS.map(async (name) => {
      const snap = await getCountFromServer(collection(db, name));
      return [name, snap.data().count] as const;
    })
  );
  return Object.fromEntries(entries) as ContentCounts;
}
