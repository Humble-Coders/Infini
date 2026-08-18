import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { FirestoreTimestamp, NewsDoc, WithId } from "@/lib/types";

const COLLECTION = "news";

function demoTimestamp(iso: string): FirestoreTimestamp {
  const date = new Date(iso);
  return { toDate: () => date, seconds: Math.floor(date.getTime() / 1000), nanoseconds: 0 };
}

// TEMP DEMO — sample articles so the client can review the News section
// with real-looking cards before actual posts are written. Delete this
// array and its use below, plus the picsum remotePatterns in
// next.config.ts, once real news content is seeded.
const DEMO_NEWS: WithId<NewsDoc>[] = [
  {
    id: "demo-mmp-vs-traditional-polishing",
    slug: "demo-mmp-vs-traditional-polishing",
    title: "Why MMP treatment outperforms traditional polishing on complex geometry",
    excerpt:
      "Traditional polishing abrades a whole surface indiscriminately. MMP treats only the roughness that's actually a problem, here's what that means for parts with tight internal geometry.",
    body: "Traditional polishing abrades a whole surface indiscriminately. MMP treats only the roughness that's actually a problem, here's what that means for parts with tight internal geometry, fine features, and complex cavities that manual polishing struggles to reach evenly.",
    coverImage: "https://picsum.photos/seed/infini-news-mmp-polishing/1200/600",
    tags: ["technology", "MMP"],
    status: "published",
    publishedAt: demoTimestamp("2026-06-02"),
    authorId: "demo-content",
    seo: {
      title: "Why MMP treatment outperforms traditional polishing",
      description: "How MMP's frequency-based, selective material removal compares to traditional abrasive polishing on complex geometry.",
      ogTitle: "Why MMP treatment outperforms traditional polishing",
      ogDescription: "How MMP's frequency-based, selective material removal compares to traditional abrasive polishing on complex geometry.",
      ogImage: "",
      canonical: "",
      noindex: false,
    },
  },
  {
    id: "demo-medical-implant-surface-finishing",
    slug: "demo-medical-implant-surface-finishing",
    title: "Surface finishing for medical implants: what ISO 13485-aligned control actually looks like",
    excerpt:
      "Implant surfaces need finishes verified to a measurable standard, not judged by eye. A look at the traceability and process controls behind medical-grade treatment.",
    body: "Implant surfaces need finishes verified to a measurable standard, not judged by eye. A look at the traceability, batch documentation, and contamination control behind medical-grade surface treatment for orthopedic and spinal hardware.",
    coverImage: "https://picsum.photos/seed/infini-news-medical-implants/1200/600",
    tags: ["medical", "quality"],
    status: "published",
    publishedAt: demoTimestamp("2026-05-18"),
    authorId: "demo-content",
    seo: {
      title: "Surface finishing for medical implants",
      description: "What ISO 13485-aligned process control looks like for medical-grade surface finishing.",
      ogTitle: "Surface finishing for medical implants",
      ogDescription: "What ISO 13485-aligned process control looks like for medical-grade surface finishing.",
      ogImage: "",
      canonical: "",
      noindex: false,
    },
  },
  {
    id: "demo-additive-manufacturing-post-processing",
    slug: "demo-additive-manufacturing-post-processing",
    title: "The finishing step 3D-printed metal parts still need",
    excerpt:
      "As-built AM parts carry layer lines and loosely sintered particles that standard finishing can't reach. Here's how internal channels and lattices get treated.",
    body: "As-built AM parts carry layer lines and loosely sintered particles that standard finishing can't reach, especially on internal channels and lattice structures. Here's how that as-built roughness gets brought down to a verified target without losing the geometry that made additive worth using in the first place.",
    coverImage: "https://picsum.photos/seed/infini-news-additive-mfg/1200/600",
    tags: ["additive manufacturing"],
    status: "published",
    publishedAt: demoTimestamp("2026-04-30"),
    authorId: "demo-content",
    seo: {
      title: "The finishing step 3D-printed metal parts still need",
      description: "How MMP treatment reduces as-built roughness on internal AM geometry standard finishing can't access.",
      ogTitle: "The finishing step 3D-printed metal parts still need",
      ogDescription: "How MMP treatment reduces as-built roughness on internal AM geometry standard finishing can't access.",
      ogImage: "",
      canonical: "",
      noindex: false,
    },
  },
];

/** All published news posts, newest first. */
export async function getPublishedNews(): Promise<WithId<NewsDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("status", "==", "published"), orderBy("publishedAt", "desc"))
  );
  const posts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as NewsDoc) }));
  return [...DEMO_NEWS, ...posts].sort(
    (a, b) => b.publishedAt.toDate().getTime() - a.publishedAt.toDate().getTime()
  );
}

/** A single published news post by slug, or null. */
export async function getNewsBySlug(slug: string): Promise<WithId<NewsDoc> | null> {
  const snap = await getDocs(
    query(
      collection(requireDb(), COLLECTION),
      where("slug", "==", slug),
      where("status", "==", "published"),
      limit(1)
    )
  );
  const found = snap.docs[0];
  if (found) return { id: found.id, ...(found.data() as NewsDoc) };
  return DEMO_NEWS.find((post) => post.slug === slug) ?? null;
}

/** All published news slugs — for generateStaticParams. */
export async function getPublishedNewsSlugs(): Promise<string[]> {
  const posts = await getPublishedNews();
  return posts.map((post) => post.slug);
}
