import { cache } from "react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { IndustryDoc, WithId } from "@/lib/types";

const COLLECTION = "industries";

// TEMP DEMO, random placeholder photos for the hero carousel, keyed by
// slug so each industry gets a stable (but unrelated) image. Delete this
// map and its use below, once real photography is supplied.
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

/*
 * One distinct image per industry, matched to that industry's actual subject.
 *
 * Two rules learned the hard way. Seeded picsum URLs return whatever photo the
 * seed maps to, which is how aerospace ended up showing a street scene. And an
 * Unsplash ID is only used here once it has been seen to load, because an
 * unverified ID 404s silently and leaves an empty frame; every ID below is one
 * already serving elsewhere on the site.
 */
const DEMO_HERO_IMAGES: Record<string, string> = {
  "cutting-tools": "/images/placeholders/gallery-05-carbide-drills.jpg",
  // Forging and die work on the shop floor.
  "forge-stamping-die": unsplash("photo-1504328345606-18bbc8c9d7d1"),
  // Two mould halves with polished cavities, which is the injection-tooling subject exactly.
  "plastic-injection-molds": "/images/placeholders/gallery-04-die-halves.jpg",
  "medical-implants": "/images/placeholders/gallery-03-knee-implant.jpg",
  aerospace: "/images/placeholders/gallery-01-turbine-ring.jpg",
  "additive-manufacturing": "/images/placeholders/gallery-06-additive-ring.jpg",
  "gears-transmission": "/images/placeholders/gallery-02-spur-gear.jpg",
  // Metal powder in a build chamber: the powder itself is the subject here.
  "powder-metallurgy": unsplash("photo-1611117775350-ac3950990985"),
};

/** All 7 published industries, in display order. */
async function getPublishedIndustriesUncached(): Promise<WithId<IndustryDoc>[]> {
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
async function getIndustryBySlugUncached(slug: string): Promise<WithId<IndustryDoc> | null> {
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

/** All published industry slugs, for generateStaticParams. */
async function getPublishedIndustrySlugsUncached(): Promise<string[]> {
  const industries = await getPublishedIndustries();
  return industries.map((industry) => industry.slug);
}

/** A published industry by its own document ID, for resolving relatedIndustry-style references. */
async function getIndustryByIdUncached(id: string): Promise<WithId<IndustryDoc> | null> {
  const snap = await getDoc(doc(requireDb(), COLLECTION, id));
  if (!snap.exists()) return null;
  const data = snap.data() as IndustryDoc;
  if (!data.published) return null;
  return { id: snap.id, ...data };
}

/*
 * Reads are memoised per request with React's `cache()`.
 *
 * A page and its `generateMetadata` run in the same pass and routinely ask for
 * the same document, so an uncached accessor cost two identical round trips on
 * every request. `cache()` collapses those to one.
 *
 * It has to be `cache()` and not `unstable_cache`: the latter serialises what it
 * stores, which strips `.toDate()` off every Firestore Timestamp and breaks
 * every date on the site. This only dedupes within a single render, so
 * documents arrive exactly as Firestore returned them.
 */
export const getPublishedIndustries = cache(getPublishedIndustriesUncached);
export const getIndustryBySlug = cache(getIndustryBySlugUncached);
export const getPublishedIndustrySlugs = cache(getPublishedIndustrySlugsUncached);
export const getIndustryById = cache(getIndustryByIdUncached);
