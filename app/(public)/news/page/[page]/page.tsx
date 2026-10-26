import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsIndex, NEWS_COPY, NEWS_PAGE_SIZE } from "@/components/news/NewsIndex";
import { getPublishedNews } from "@/lib/data/news";
import { canonicalUrl } from "@/lib/seo";

export const revalidate = 600;

export async function generateStaticParams() {
  const posts = await getPublishedNews();
  const totalPages = Math.ceil(posts.length / NEWS_PAGE_SIZE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `News, page ${page}`,
    description: NEWS_COPY.body,
    openGraph: { title: "News | INFINI", description: NEWS_COPY.body, type: "website" },
    // Each archive page is distinct content, so it is its own canonical.
    alternates: { canonical: canonicalUrl(`/news/page/${page}`) },
  };
}

export default async function NewsArchivePage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const pageNumber = Number(page);
  if (!Number.isInteger(pageNumber) || pageNumber < 2) notFound();

  const posts = await getPublishedNews();
  if (pageNumber > Math.ceil(posts.length / NEWS_PAGE_SIZE)) notFound();

  return <NewsIndex pageNumber={pageNumber} />;
}
