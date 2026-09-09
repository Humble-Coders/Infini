import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { NewsDoc, TeaserCopy, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";
import { NewsCarousel, type NewsCardData } from "./NewsCarousel";

const FALLBACK: TeaserCopy = {
  eyebrow: "News & press",
  heading: "Notes from\nthe finishing lab.",
  body: "Process data, validation thinking and industry analysis from INFINI's surface-finishing labs.",
  emptyState: "Our first posts on treatment process, validation and industry standards are coming soon.",
};

const MAX_ITEMS = 6;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Server wrapper: headline block plus the story rail. Firestore timestamps
 * are formatted here so the client carousel receives plain serialisable
 * card data. Imagery flows from each post's own cover image.
 */
export function NewsIndex({ copy, news }: { copy: TeaserCopy | null; news: WithId<NewsDoc>[] }) {
  const { eyebrow, heading, body, emptyState } = { ...FALLBACK, ...(copy ?? {}) };
  const items: NewsCardData[] = news.slice(0, MAX_ITEMS).map((post) => {
    const date = post.publishedAt.toDate();
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      date: formatDate(date),
      dateTime: date.toISOString(),
      tag: post.tags[0] || "Insights",
      coverImage: post.coverImage ?? "",
    };
  });

  return (
    <section data-surface="light" className="bg-background-elevated py-24 sm:py-32">
      <Container className="flex flex-col gap-8 lg:gap-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <MonoLabel>{eyebrow}</MonoLabel>
            <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-foreground">
              <EmphasisHeading text={heading} />
            </h2>
          </div>
          <div className="flex flex-col items-start gap-6 self-end lg:col-span-5 lg:col-start-8">
            {body && <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p>}
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-foreground uppercase transition-colors hover:text-accent"
            >
              All news
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="max-w-2xl rounded-2xl border border-dashed border-border px-6 py-10 text-sm leading-relaxed text-muted-foreground sm:px-10 sm:text-base">
            {emptyState}
          </p>
        ) : (
          <NewsCarousel items={items} />
        )}
      </Container>
    </section>
  );
}
