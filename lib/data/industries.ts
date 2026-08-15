import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { IndustryDoc, WithId } from "@/lib/types";

const COLLECTION = "industries";

/** All 7 published industries, in display order. */
export async function getPublishedIndustries(): Promise<WithId<IndustryDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as IndustryDoc) }));
}

/** A single published industry by slug, or null if it doesn't exist / isn't published. */
export async function getIndustryBySlug(slug: string): Promise<WithId<IndustryDoc> | null> {
  const snap = await getDocs(
    query(
      collection(requireDb(), COLLECTION),
      where("slug", "==", slug),
      where("published", "==", true),
      limit(1)
    )
  );
  const found = snap.docs[0];
  return found ? { id: found.id, ...(found.data() as IndustryDoc) } : null;
}

/** All published industry slugs — for generateStaticParams. */
export async function getPublishedIndustrySlugs(): Promise<string[]> {
  const industries = await getPublishedIndustries();
  return industries.map((industry) => industry.slug);
}

/** A published industry by its own document ID — for resolving relatedIndustry-style references. */
export async function getIndustryById(id: string): Promise<WithId<IndustryDoc> | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  const data = snap.data() as IndustryDoc;
  if (!data.published) return null;
  return { id: snap.id, ...data };
}
