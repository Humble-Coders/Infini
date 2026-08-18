import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getNewsBySlug, getPublishedNewsSlugs } from "@/lib/data/news";
import { NewsBody } from "@/components/news/NewsBody";

export async function generateStaticParams() {
  const slugs = await getPublishedNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return {};

  return {
    title: post.seo.title,
    description: post.seo.description,
    openGraph: {
      title: `${post.seo.title} | INFINI`,
      description: post.seo.description,
      type: "article",
      images: post.seo.ogImage ? [post.seo.ogImage] : post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-background">
      <article>
        <section className="border-b border-border/60 py-16 sm:py-24">
          <Container className="flex flex-col gap-5">
            <Link
              href="/news"
              className="flex w-fit items-center gap-1.5 text-xs tracking-[0.2em] text-accent uppercase transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              News
            </Link>
            <span className="text-xs tracking-wide text-muted-foreground uppercase">{formatDate(post.publishedAt)}</span>
            <h1 className="max-w-3xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
              {post.title}
            </h1>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Container>
        </section>

        {post.coverImage && (
          <section className="border-b border-border/60 py-12">
            <Container>
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
                <Image src={post.coverImage} alt={post.title} fill sizes="100vw" className="object-cover" priority />
              </div>
            </Container>
          </section>
        )}

        <section className="py-16 sm:py-20">
          <Container className="max-w-3xl">
            <NewsBody markdown={post.body} />
          </Container>
        </section>
      </article>
    </main>
  );
}
