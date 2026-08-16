import { collection, getDocs } from "firebase/firestore";
import { requireDb } from "./firestore";

const CONTENT_COLLECTIONS = ["industries", "caseStudies", "certifications", "news", "testimonials", "events", "pages"] as const;

export interface MediaReference {
  collection: string;
  id: string;
  title: string;
}

/**
 * Scans every content collection for a document whose data contains this
 * media asset's URL anywhere (hero images, galleries, logos, PDF links —
 * whatever shape each content type uses). A field-by-field query per
 * collection would need to track each one's specific image fields and go
 * stale the moment a new one is added; these collections are small, so a
 * full-document scan is simpler and can't drift out of sync. Used by the
 * delete-confirmation warning (T8 acceptance criterion).
 */
export async function findMediaReferences(mediaUrl: string): Promise<MediaReference[]> {
  const db = requireDb();
  const results = await Promise.all(
    CONTENT_COLLECTIONS.map(async (collectionName) => {
      const snap = await getDocs(collection(db, collectionName));
      const matches: MediaReference[] = [];
      for (const docSnap of snap.docs) {
        const data = docSnap.data();
        if (JSON.stringify(data).includes(mediaUrl)) {
          const title = (data.name ?? data.title ?? data.slug ?? docSnap.id) as string;
          matches.push({ collection: collectionName, id: docSnap.id, title });
        }
      }
      return matches;
    })
  );
  return results.flat();
}
