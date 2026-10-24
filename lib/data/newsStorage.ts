import fs from "fs";
import path from "path";
import type { FirestoreTimestamp, NewsDoc, WithId } from "@/lib/types";

export interface StoredArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  tags: string[];
  status: "published" | "draft";
  publishedDate: string;
  author: string;
  readTime: string;
  seoTitle: string;
  seoDesc: string;
  createdAt?: string;
}

export const INITIAL_ARTICLES: StoredArticle[] = [
  {
    id: "art-1",
    slug: "mmp-vs-traditional-polishing",
    title: "Why MMP Treatment Outperforms Traditional Polishing on Complex Geometry",
    excerpt: "Traditional polishing abrades a whole surface indiscriminately. MMP treats only the roughness that is actually a problem, preserving critical cutting edges and profiles.",
    body: "Traditional abrasive polishing removes material across all peaks and valleys alike, often degrading tight tolerances and rounding precision cutting edges. Micro Machining Process (MMP) utilizes controlled micro-friction tailored to specific material hardness and frequency thresholds. The result is selective roughness reduction down to sub-nanometer levels without altering the macro-geometry.",
    coverImage: "/images/placeholders/process-01-bevel-pinion.jpg",
    tags: ["Technology", "MMP", "Aerospace"],
    status: "published",
    publishedDate: "02 Jun 2026",
    author: "Technical Metrology Team",
    readTime: "5 min read",
    seoTitle: "Why MMP Treatment Outperforms Traditional Polishing | Infini",
    seoDesc: "How MMP frequency-based selective material removal compares to traditional abrasive polishing on complex geometry.",
    createdAt: "2026-06-02T09:00:00.000Z",
  },
  {
    id: "art-2",
    slug: "medical-implant-surface-finishing",
    title: "Surface Finishing for Medical Implants: ISO 13485-Aligned Control",
    excerpt: "Implant surfaces need finishes verified to measurable Ra/Rz standards, not judged by eye. A breakdown of traceability and batch repeatability for orthopedic components.",
    body: "Orthopedic implants demand validated surface topography to ensure patient biocompatibility and long fatigue life. Cobalt-chrome femoral heads and titanium bone screws require Ra below 0.02 um with zero abrasive residue embedding. Here we examine cleanroom passivation and traceable metrology logs.",
    coverImage: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    tags: ["Medical", "Quality", "ISO 13485"],
    status: "published",
    publishedDate: "18 May 2026",
    author: "Quality Directorate",
    readTime: "6 min read",
    seoTitle: "Surface Finishing for Medical Implants | Infini",
    seoDesc: "What ISO 13485-aligned process control looks like for medical-grade surface finishing.",
    createdAt: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "art-3",
    slug: "extending-carbide-tool-life",
    title: "Extending Carbide Tool Life by 300% via Controlled Micro-Honing",
    excerpt: "How micro-polishing the flute valleys and rounding the cutting edge radius reduces friction, prevents chip welding, and doubles tool longevity.",
    body: "Drills, endmills, and gear hobs fail prematurely when micro-cracks on the flutes cause chip clogging and heat buildup. Pre-coat and post-coat micro-finishing ensures uniform coating adhesion and eliminates stress risers along the cutting perimeter.",
    coverImage: "/images/cutting-tool-1.jpg",
    tags: ["Tooling", "Manufacturing"],
    status: "published",
    publishedDate: "28 Apr 2026",
    author: "Engineering Team",
    readTime: "4 min read",
    seoTitle: "Extending Carbide Tool Life with Micro-Finishing | Infini",
    seoDesc: "Engineering report on reducing cutting friction and extending tool operating cycles.",
    createdAt: "2026-04-28T14:30:00.000Z",
  },
  {
    id: "art-4",
    slug: "aerospace-turbine-blade-aerodynamics",
    title: "Aerospace Turbine Blade Aerodynamics and Boundary Layer Drag Reduction",
    excerpt: "Achieving aerodynamic efficiency on nickel superalloy blades through isotropic surface refinement.",
    body: "Superalloy turbine blades operate in severe thermal and aerodynamic environments. Minimizing skin friction drag directly translates to improved fuel efficiency. Draft notes and data awaiting final CFD validation charts.",
    coverImage: "/images/cutting-tool-2.png",
    tags: ["Aerospace", "Superalloys"],
    status: "draft",
    publishedDate: "12 Jul 2026",
    author: "Chief Engineer",
    readTime: "7 min read",
    seoTitle: "Aerospace Turbine Blade Aerodynamics | Infini",
    seoDesc: "Surface finish impact on aerodynamic drag in turbine components.",
    createdAt: "2026-07-12T11:00:00.000Z",
  },
];

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "news.json");

function readFallbackFile(): StoredArticle[] | null {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as StoredArticle[];
      }
    }
  } catch (err) {
    console.warn("[newsStorage] Failed to read fallback file:", err);
  }
  return null;
}

function writeFallbackFile(data: StoredArticle[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("[newsStorage] Failed to write fallback file:", err);
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

export function articleToNewsDoc(item: StoredArticle): WithId<NewsDoc> {
  const publishedDateObj = item.createdAt ? new Date(item.createdAt) : new Date(item.publishedDate);
  const validDate = isNaN(publishedDateObj.getTime()) ? new Date() : publishedDateObj;

  return {
    id: item.id || item.slug,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    body: item.body,
    coverImage: item.coverImage,
    tags: Array.isArray(item.tags) ? item.tags : ["Technology"],
    status: item.status,
    authorId: item.author || "Infini Engineering",
    publishedAt: toTimestamp(validDate),
    seo: {
      title: item.seoTitle || `${item.title} | INFINI Insights`,
      description: item.seoDesc || item.excerpt,
      ogTitle: item.seoTitle || item.title,
      ogDescription: item.seoDesc || item.excerpt,
      ogImage: item.coverImage || "",
      canonical: `/news/${item.slug}`,
      noindex: item.status === "draft",
    },
  };
}

/**
 * Retrieve all news articles (published + drafts) for the admin console.
 */
export async function getStoredArticles(): Promise<StoredArticle[]> {
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    try {
      const { adminDb } = await import("@/backend/firebase/admin");
      const snapshot = await adminDb.collection("news").get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => {
          const data = doc.data();
          const dateStr = data.publishedAt?.toDate
            ? data.publishedAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
            : data.publishedDate || "Recently";

          return {
            id: doc.id,
            slug: data.slug || doc.id,
            title: data.title || "",
            excerpt: data.excerpt || "",
            body: data.body || "",
            coverImage: data.coverImage || "/images/placeholders/process-01-bevel-pinion.jpg",
            tags: Array.isArray(data.tags) ? data.tags : ["Technology"],
            status: data.status === "draft" ? "draft" : "published",
            publishedDate: dateStr,
            author: data.author || data.authorId || "Infini Engineering",
            readTime: data.readTime || "5 min read",
            seoTitle: data.seo?.title || data.seoTitle || "",
            seoDesc: data.seo?.description || data.seoDesc || "",
            createdAt: data.createdAt || (data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : undefined),
          };
        });
      }
    } catch (err) {
      console.warn("[newsStorage] Production Firestore read fallback:", err);
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
      const snapshot = await adminDb.collection("news").get();
      if (!snapshot.empty) {
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug || doc.id,
            title: data.title || "",
            excerpt: data.excerpt || "",
            body: data.body || "",
            coverImage: data.coverImage || "/images/placeholders/process-01-bevel-pinion.jpg",
            tags: Array.isArray(data.tags) ? data.tags : ["Technology"],
            status: (data.status === "draft" ? "draft" : "published") as "published" | "draft",
            publishedDate: data.publishedDate || "Recently",
            author: data.author || data.authorId || "Infini Engineering",
            readTime: data.readTime || "5 min read",
            seoTitle: data.seo?.title || data.seoTitle || "",
            seoDesc: data.seo?.description || data.seoDesc || "",
          };
        });
        writeFallbackFile(docs);
        return docs;
      }
    } catch {
      // offline dev
    }
  }

  // Seed default articles if none exist
  writeFallbackFile(INITIAL_ARTICLES);
  return INITIAL_ARTICLES;
}

/**
 * Retrieve all published news articles for public `/news` page (sorted newest first).
 */
export async function getStoredPublishedNews(): Promise<WithId<NewsDoc>[]> {
  const all = await getStoredArticles();
  const published = all
    .filter((a) => a.status === "published")
    .map(articleToNewsDoc);

  return published.sort(
    (a, b) => (b.publishedAt?.toDate().getTime() ?? 0) - (a.publishedAt?.toDate().getTime() ?? 0)
  );
}

/**
 * Retrieve a single news article by slug for public `/news/[slug]` page.
 */
export async function getStoredNewsBySlug(slug: string): Promise<WithId<NewsDoc> | null> {
  const all = await getStoredArticles();
  const found = all.find((a) => a.slug === slug);
  if (!found) return null;

  // In production, only return published articles
  if (process.env.NODE_ENV === "production" && found.status !== "published") {
    return null;
  }

  return articleToNewsDoc(found);
}

/**
 * Retrieve all published news slugs for `generateStaticParams`.
 */
export async function getStoredPublishedNewsSlugs(): Promise<string[]> {
  const all = await getStoredArticles();
  return all
    .filter((a) => a.status === "published")
    .map((a) => a.slug);
}

/**
 * Save (create or update) a news article.
 */
export async function saveStoredArticle(payload: Partial<StoredArticle>): Promise<StoredArticle> {
  const all = await getStoredArticles();

  const slug =
    payload.slug ||
    payload.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    `article-${Date.now()}`;

  const id = payload.id && !payload.id.startsWith("art-") ? payload.id : slug;

  const nowIso = new Date().toISOString();
  const dateFormatted = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const fullArticle: StoredArticle = {
    id,
    slug,
    title: payload.title || "Untitled Article",
    excerpt: payload.excerpt || "",
    body: payload.body || payload.excerpt || "",
    coverImage: payload.coverImage || "/images/placeholders/process-01-bevel-pinion.jpg",
    tags: Array.isArray(payload.tags) && payload.tags.length > 0 ? payload.tags : ["Technology"],
    status: payload.status === "draft" ? "draft" : "published",
    publishedDate: payload.publishedDate || dateFormatted,
    author: payload.author || "Infini Engineering",
    readTime: payload.readTime || "5 min read",
    seoTitle: payload.seoTitle || `${payload.title} | INFINI Insights`,
    seoDesc: payload.seoDesc || payload.excerpt || "",
    createdAt: payload.createdAt || nowIso,
  };

  const existingIdx = all.findIndex((a) => a.id === id || a.slug === slug);
  let updatedList: StoredArticle[];

  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = {
      ...updatedList[existingIdx],
      ...fullArticle,
      createdAt: updatedList[existingIdx].createdAt || nowIso,
    };
  } else {
    updatedList = [fullArticle, ...all];
  }

  writeFallbackFile(updatedList);

  // Attempt Firestore Admin write if cloud credentials exist
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    const { Timestamp } = await import("firebase-admin/firestore");
    const docData = {
      ...fullArticle,
      publishedAt: Timestamp.now(),
      seo: {
        title: fullArticle.seoTitle,
        description: fullArticle.seoDesc,
        ogTitle: fullArticle.seoTitle,
        ogDescription: fullArticle.seoDesc,
        ogImage: fullArticle.coverImage,
        canonical: `/news/${fullArticle.slug}`,
        noindex: fullArticle.status === "draft",
      },
    };
    await adminDb.collection("news").doc(id).set(docData, { merge: true });
  } catch (err) {
    console.warn("[newsStorage] Firestore Admin write skipped/failed:", err);
  }

  return fullArticle;
}

/**
 * Delete a news article by ID or slug.
 */
export async function deleteStoredArticle(idOrSlug: string): Promise<boolean> {
  const all = await getStoredArticles();
  const filtered = all.filter((a) => a.id !== idOrSlug && a.slug !== idOrSlug);

  writeFallbackFile(filtered);

  // Attempt Firestore delete
  try {
    const { adminDb } = await import("@/backend/firebase/admin");
    await adminDb.collection("news").doc(idOrSlug).delete();
  } catch (err) {
    console.warn("[newsStorage] Firestore Admin delete skipped/failed:", err);
  }

  return true;
}
