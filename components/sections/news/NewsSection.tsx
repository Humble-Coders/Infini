import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { NewsDoc, TeaserCopy, WithId } from "@/lib/types";

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export function NewsSection({ copy, news }: { copy: TeaserCopy; news: WithId<NewsDoc>[] }) {
  return (
    <section className="relative border-t border-border/60 bg-background py-20 sm:py-28">
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{copy.eyebrow}</span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">{copy.heading}</h2>
        </div>

        {news.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
            <p className="max-w-lg text-sm text-muted-foreground sm:text-base">{copy.emptyState}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((post) => (
              <Link
                key={post.slug}
                href={`/news/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border transition-colors hover:border-primary"
              >
                {post.coverImage && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <span className="text-xs tracking-wide text-muted-foreground uppercase">{formatDate(post.publishedAt)}</span>
                  <h3 className="text-lg font-normal text-foreground">{post.title}</h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
