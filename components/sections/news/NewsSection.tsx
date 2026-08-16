import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import type { NewsDoc, TeaserCopy, WithId } from "@/lib/types";

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function NewsCard({ post, featured = false }: { post: WithId<NewsDoc>; featured?: boolean }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 ease-out hover:border-primary hover:shadow-[0_20px_60px_-15px_rgba(var(--color-shadow-rgb),0.5)] ${
        featured ? "sm:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden bg-muted ${featured ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[16/10]"}`}>
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes={featured ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
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
        {/* Gradient scrim so the date chip stays legible over any image, and gives the card a finished, non-flat edge even without one. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-[11px] tracking-wide text-foreground/90 backdrop-blur-sm">
          <Calendar className="size-3" aria-hidden="true" />
          {formatDate(post.publishedAt)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className={`font-normal text-foreground ${featured ? "text-xl sm:text-2xl" : "text-lg"}`}>{post.title}</h3>
        <p className={`text-muted-foreground ${featured ? "text-sm sm:text-base" : "text-sm"} line-clamp-3`}>{post.excerpt}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-accent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
          Read article
          <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
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
            {news.map((post, index) => (
              <NewsCard key={post.slug} post={post} featured={index === 0} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
