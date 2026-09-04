import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { NewsDoc, TeaserCopy, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";

const FALLBACK: TeaserCopy = {
  eyebrow: "News & insights",
  heading: "Latest research.\nReal impact.",
  emptyState: "Our first posts on treatment process, validation and industry standards are coming soon.",
};

const MAX_ITEMS = 3;

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/** Editorial index: date, title, excerpt, tag. Newest three; server-rendered so the dates format once. */
export function NewsIndex({ copy, news }: { copy: TeaserCopy | null; news: WithId<NewsDoc>[] }) {
  const { eyebrow, heading, body, emptyState } = { ...FALLBACK, ...(copy ?? {}) };
  const items = news.slice(0, MAX_ITEMS);

  return (
    <section data-surface="light" className="bg-background-elevated py-24 sm:py-32">
      <Container className="flex flex-col gap-12 lg:gap-16">
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
          <ol className="border-t border-border">
            {items.map((post) => {
              const date = post.publishedAt.toDate();
              return (
                <li key={post.id} className="border-b border-border">
                  <Link
                    href={`/news/${post.slug}`}
                    className="group grid gap-3 py-7 transition-colors duration-300 hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03] focus-visible:outline-none sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:py-8"
                  >
                    <time dateTime={date.toISOString()} className="font-mono text-xs text-muted-foreground tabular-nums">
                      {formatDate(date)}
                    </time>
                    <span className="flex flex-col gap-2">
                      <span className="text-xl leading-snug font-semibold tracking-[-0.02em] text-foreground transition-colors group-hover:text-accent sm:text-2xl">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{post.excerpt}</span>
                      )}
                    </span>
                    <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                      {post.tags[0] || "Insights"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </Container>
    </section>
  );
}
