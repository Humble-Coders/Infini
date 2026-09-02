import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { NewsIntro } from "./NewsIntro";
import { NewsDossier, type NewsIndexItem } from "./NewsDossier";
import { WhitePapers } from "./WhitePapers";
import type { NewsDoc, TeaserCopy, WithId } from "@/lib/types";

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.round(words / 40));
  return `${minutes} min read`;
}

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * "News & Insights" — one featured article plus a numbered editorial index, rather than a card
 * grid, backed by a white-paper archive below. Server component: `NewsDoc.publishedAt` (a
 * Firestore timestamp carrying a `toDate` function) and `seo`/`body`/`authorId`/`status` never
 * cross into the client dossier — only the plain, formatted fields the UI renders do.
 */
export function NewsSection({ copy, news }: { copy: TeaserCopy; news: WithId<NewsDoc>[] }) {
  const items: NewsIndexItem[] = news.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    category: post.tags[0] || "Insights",
    dateLabel: formatDate(post.publishedAt),
    readTime: estimateReadTime(post.excerpt || post.title),
  }));

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-16 sm:py-24 lg:py-28">
      <SectionBackground grid />
      <Container className="relative flex flex-col gap-10 sm:gap-14">
        <NewsIntro eyebrow={copy.eyebrow} heading={copy.heading} body={copy.body} />

        {items.length === 0 ? (
          <div className="mx-auto flex max-w-lg flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-10 text-center sm:px-10">
            <p className="text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <NewsDossier news={items} />
        )}
      </Container>

      <div className="relative mt-14 sm:mt-20">
        <WhitePapers />
      </div>
    </section>
  );
}
