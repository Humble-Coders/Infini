import type { Metadata } from "next";
import { NewsIndex, NEWS_COPY } from "@/components/news/NewsIndex";
import { canonicalUrl } from "@/lib/seo";

/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "News",
  description: NEWS_COPY.body,
  openGraph: { title: "News | INFINI", description: NEWS_COPY.body, type: "website" },
  alternates: { canonical: canonicalUrl("/news") },
};

export default function NewsIndexPage() {
  return <NewsIndex pageNumber={1} />;
}
