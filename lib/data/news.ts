import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { requireDb } from "./firestore";
import type { NewsDoc, WithId } from "@/lib/types";

const COLLECTION = "news";

/** All published news posts, newest first. */
export async function getPublishedNews(): Promise<WithId<NewsDoc>[]> {
  const snap = await getDocs(
    query(collection(requireDb(), COLLECTION), where("status", "==", "published"), orderBy("publishedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as NewsDoc) }));
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
  return found ? { id: found.id, ...(found.data() as NewsDoc) } : null;
}

/** All published news slugs — for generateStaticParams. */
export async function getPublishedNewsSlugs(): Promise<string[]> {
  const posts = await getPublishedNews();
  return posts.map((post) => post.slug);
}
