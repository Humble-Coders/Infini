import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { IndustryDoc, WithId } from "@/lib/types";

const COLLECTION = "industries";

// TEMP DEMO — random placeholder photos for the hero carousel, keyed by
// slug so each industry gets a stable (but unrelated) image. Delete this
// map and its use below, plus the picsum remotePatterns in next.config.ts,
// once real photography is supplied.
const DEMO_HERO_IMAGES: Record<string, string> = {
  "cutting-tools": "https://picsum.photos/seed/infini-cutting-tools/1200/900",
  "forge-stamping-die": "https://picsum.photos/seed/infini-forge-die/1200/900",
  "plastic-injection-molds": "https://picsum.photos/seed/infini-injection-molds/1200/900",
  "medical-implants": "https://picsum.photos/seed/infini-medical-implants/1200/900",
  aerospace: "https://picsum.photos/seed/infini-aerospace/1200/900",
  "additive-manufacturing": "https://picsum.photos/seed/infini-additive-mfg/1200/900",
  "gears-transmission": "https://picsum.photos/seed/infini-gears/1200/900",
};

/** All 7 published industries, in display order. */
export async function getPublishedIndustries(): Promise<WithId<IndustryDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("published", "==", true), orderBy("order"))
  );
  return snap.docs.map((d) => {
    const data = d.data() as IndustryDoc;
    const heroImage = data.hero.image || DEMO_HERO_IMAGES[data.slug] || "";
    return { id: d.id, ...data, hero: { ...data.hero, image: heroImage } };
  });
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
