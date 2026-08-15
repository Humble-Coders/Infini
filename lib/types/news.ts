import type { FirestoreTimestamp } from "./common";
import type { SeoMap } from "./seo";

export type NewsStatus = "draft" | "published";

/** `news` collection — blog / insights. */
export interface NewsDoc {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  tags: string[];
  status: NewsStatus;
  publishedAt: FirestoreTimestamp;
  authorId: string;
  seo: SeoMap;
}
