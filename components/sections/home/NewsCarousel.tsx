"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";

export type NewsCardData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateTime: string;
  tag: string;
  coverImage: string;
};

/**
 * News as a Freeform-style horizontal rail: tall image cards with tag and
 * date up top, headline and excerpt anchored to the bottom over a legibility
 * scrim. Native snap scroll (touch, trackpad and keyboard all work) plus
 * prev/next arrows that advance one card. Titles stay real text for SEO;
 * imagery flows from each post's own cover image.
 */
export function NewsCarousel({ items }: { items: NewsCardData[] }) {
  const railRef = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: -1 | 1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("li");
    const distance = (card?.offsetWidth ?? 400) + 24;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * distance, behavior: smooth ? "smooth" : "auto" });
  }

  const arrowClasses =
    "flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          {items.length} {items.length === 1 ? "story" : "stories"}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollByCard(-1)} aria-label="Previous story" className={arrowClasses}>
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollByCard(1)} aria-label="Next story" className={arrowClasses}>
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={railRef}
        className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 scroll-pl-6 [scrollbar-width:none] md:-mx-10 md:px-10 md:scroll-pl-10 lg:-mx-16 lg:px-16 lg:scroll-pl-16 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((post) => (
          <li key={post.id} className="w-[82vw] shrink-0 snap-start sm:w-[400px]">
            <Link
              href={`/news/${post.slug}`}
              className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl border border-border p-6 transition-colors duration-300 focus-visible:outline-none hover:border-foreground/25 sm:p-7"
            >
              {post.coverImage ? (
                <>
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="400px"
                    loading="lazy"
                    className="object-cover brightness-[0.68] transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:brightness-90"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/40"
                  />
                </>
              ) : (
                <>
                  <div aria-hidden="true" className="absolute inset-0 bg-neutral-950" />
                  <Spotlight />
                </>
              )}

              <div className="relative flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] uppercase">
                <span className="text-accent">{post.tag}</span>
                <span aria-hidden="true" className="size-1 rounded-full bg-white/40" />
                <time dateTime={post.dateTime} className="text-white/60">
                  {post.date}
                </time>
              </div>

              <div className="relative flex flex-col gap-2">
                <p className="line-clamp-3 text-xl leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-white transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                  {post.title}
                </p>
                {post.excerpt && <p className="line-clamp-2 text-sm leading-relaxed text-white/70">{post.excerpt}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
