import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { FeatureLead } from "@/components/sections/shared/FeatureLead";
import { IndexRows, type IndexRowItem } from "@/components/sections/shared/IndexRows";
import { MarqueeBand } from "@/components/sections/shared/MarqueeBand";
import { DetailRows } from "@/components/sections/shared/DetailRows";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { cn } from "@/components/ui/utils";
import { getPublishedNews } from "@/lib/data/news";
import type { FirestoreTimestamp } from "@/lib/types";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const PAGE_SIZE = 9;

const COPY = {
  eyebrow: "Latest",
  heading: "News and insights.",
  body: "Notes on treatment process, validation, and industry standards from the INFINI team.",
};

/**
 * The static spine of the page. It carries the band whether or not the news
 * collection has anything in it, and it tells a reader what kind of writing to
 * expect before they open a single post.
 */
const SUBJECTS = [
  {
    label: "Process",
    detail: "How microtools, catalyst and cycle are matched to a given alloy, roughness and geometry.",
  },
  {
    label: "Metrology",
    detail: "Ra, Rz and Rsk read on real parts, and why an average alone hides the peaks that matter.",
  },
  {
    label: "Standards",
    detail: "What ISO 9001 and ISO 13485 aligned control looks like on a finishing line, in practice.",
  },
  {
    label: "Geometry",
    detail: "Complex shapes, gently curved passages and tooth flanks, and where the limits of a flow-based process sit.",
  },
];

export const metadata: Metadata = {
  title: "News",
  description: COPY.body,
  openGraph: { title: "News | INFINI", description: COPY.body, type: "website" },
};

function formatDate(timestamp: FirestoreTimestamp): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

/** Reading time at 220 words per minute, floored at one minute. */
function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export default async function NewsIndexPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const allPosts = await getPublishedNews();

  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
  const posts = allPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // The lead treatment is only honest on the first page, where the newest post
  // actually is. Deeper pages are a straight run of rows.
  const lead = currentPage === 1 ? posts[0] : undefined;
  const rest = lead ? posts.slice(1) : posts;

  const rows: IndexRowItem[] = rest.map((post) => ({
    title: post.title,
    href: `/news/${post.slug}`,
    meta: formatDate(post.publishedAt),
    summary: post.excerpt,
    tags: post.tags,
    image: post.coverImage || undefined,
  }));

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        image={HERO_IMAGERY.news.src}
        imageAlt={HERO_IMAGERY.news.alt}
        priority
        badges={[{ label: "Research" }, { label: "Process notes" }, { label: "Events" }]}
        spec={{
          title: `${allPosts.length} ${allPosts.length === 1 ? "note" : "notes"} published`,
          body: "Written by the engineers who run the cycles, not by a marketing desk.",
        }}
      />

      {lead && (
        <FeatureLead
          eyebrow="Lead note"
          index={1}
          title={lead.title}
          excerpt={lead.excerpt}
          href={`/news/${lead.slug}`}
          image={lead.coverImage || undefined}
          imageAlt={lead.title}
          tags={lead.tags}
          surface="light"
          meta={[
            { label: "Published", value: formatDate(lead.publishedAt) },
            { label: "Length", value: readingTime(lead.body) },
          ]}
        />
      )}

      {rows.length > 0 && (
        <IndexRows
          eyebrow="Archive"
          index={2}
          heading="Everything else we have written down."
          items={rows}
          startIndex={lead ? 2 : (currentPage - 1) * PAGE_SIZE + 1}
          surface="dark"
        />
      )}

      {allPosts.length === 0 && (
        <section data-surface="light" className="bg-background py-20 sm:py-28">
          <Container>
            <div className="flex max-w-xl flex-col gap-4 border-t border-border pt-8">
              <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                Archive empty
              </span>
              <p className="text-lg leading-relaxed text-foreground">
                Our first notes on treatment process, validation and industry standards are being written now.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                In the meantime, the four subjects below are what this archive will cover.
              </p>
            </div>
          </Container>
        </section>
      )}

      {totalPages > 1 && (
        <section className="bg-background py-10">
          <Container>
            <nav aria-label="News pagination" className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <span className="font-mono text-[10px] tracking-[0.16em] tabular-nums text-muted-foreground uppercase">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={pageNumber === 1 ? "/news" : `/news?page=${pageNumber}`}
                    aria-current={pageNumber === currentPage ? "page" : undefined}
                    className={cn(
                      "flex size-10 items-center justify-center border font-mono text-xs tabular-nums transition-colors",
                      pageNumber === currentPage
                        ? "border-accent text-accent"
                        : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                    )}
                  >
                    {String(pageNumber).padStart(2, "0")}
                  </Link>
                ))}
              </div>
            </nav>
          </Container>
        </section>
      )}

      <MarqueeBand text={["Measured, not claimed", "Ra, Rz, Rsk", "Written by the line", "Process before opinion"]} />

      <DetailRows
        eyebrow="Subjects"
        heading="What this archive covers."
        body="Four recurring subjects, chosen because they are the questions engineers actually send us."
        rows={SUBJECTS}
        surface="light"
        image={HERO_IMAGERY.benefits.src}
        imageAlt={HERO_IMAGERY.benefits.alt}
        imageLabel="Ra 0.04 µm"
      />
    </main>
  );
}
