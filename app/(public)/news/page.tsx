import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { cn } from "@/components/ui/utils";
import { getPublishedNews } from "@/lib/data/news";

const PAGE_SIZE = 9;

const COPY = {
  eyebrow: "Latest",
  heading: "News & insights.",
  body: "Notes on treatment process, validation, and industry standards from the INFINI team.",
};

export const metadata: Metadata = {
  title: "News",
  description: COPY.body,
  openGraph: { title: "News — INFINI", description: COPY.body, type: "website" },
};

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function NewsIndexPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const allPosts = await getPublishedNews();

  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const posts = allPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{COPY.eyebrow}</span>
          <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {COPY.heading}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{COPY.body}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          {posts.length === 0 ? (
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                Our first posts on treatment process, validation and industry standards are coming soon.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
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
                    <div className="flex flex-1 flex-col gap-2 p-6">
                      <span className="text-xs tracking-wide text-muted-foreground uppercase">{formatDate(post.publishedAt)}</span>
                      <h2 className="text-lg font-normal text-foreground">{post.title}</h2>
                      <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="News pagination" className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <Link
                      key={pageNumber}
                      href={pageNumber === 1 ? "/news" : `/news?page=${pageNumber}`}
                      aria-current={pageNumber === currentPage ? "page" : undefined}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border text-sm transition-colors",
                        pageNumber === currentPage
                          ? "border-primary text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {pageNumber}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </Container>
      </section>
    </main>
  );
}
