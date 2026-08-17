import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import type { NewsDoc, TeaserCopy, WithId } from "@/lib/types";

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function NewsCard({ post }: { post: WithId<NewsDoc> }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_30px_-18px_rgba(var(--color-shadow-rgb),0.6)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_60px_-16px_rgba(var(--color-shadow-rgb),0.55)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-80"
            style={{
              background:
                "conic-gradient(from 200deg at 50% 50%, var(--color-popover), var(--color-muted) 25%, var(--color-background) 50%, var(--color-primary-muted) 70%, var(--color-popover))",
            }}
          />
        )}
        {/* Gradient scrim so overlaid chips stay legible over any image, and gives the card a finished, non-flat edge even without one. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/95 via-background/10 to-transparent" />

        {post.tags[0] && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium tracking-wide text-primary-foreground uppercase">
            {post.tags[0]}
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[11px] tracking-wide text-foreground/80">
            <Calendar className="size-3" aria-hidden="true" />
            {formatDate(post.publishedAt)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-base font-normal text-foreground transition-colors duration-300 group-hover:text-primary">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <span className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium text-accent">
          Read article
          <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function NewsSection({ copy, news }: { copy: TeaserCopy; news: WithId<NewsDoc>[] }) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground grid />
      <Container className="relative flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{copy.eyebrow}</span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
        </div>

        {news.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
            <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((post) => (
              <NewsCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
