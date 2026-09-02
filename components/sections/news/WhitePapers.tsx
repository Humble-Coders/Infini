"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { WHITE_PAPERS } from "./whitePapersData";

function pad(n: number) {
  return String(n + 1).padStart(2, "0");
}

/**
 * Horizontal white-paper archive — one scroll-snap track for every breakpoint, so mobile gets
 * real swipe/peek behavior for free instead of a second bespoke carousel implementation.
 */
export function WhitePapers() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const total = WHITE_PAPERS.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[];
        const center = track.scrollLeft + track.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = ((index % total) + total) % total;
    const card = track.children[clamped] as HTMLElement | undefined;
    if (card) {
      track.scrollTo({ left: card.offsetLeft, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div className="border-t border-border/60 bg-background-elevated">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-16 sm:py-20 md:px-10 lg:px-16">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          <span className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            <FileText aria-hidden="true" className="size-3.5" />
            White papers
          </span>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="text-2xl leading-tight font-light text-foreground sm:text-3xl">Research worth keeping.</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Technical publications and detailed studies from our engineering work.
            </p>
          </div>
        </div>

        <div
          ref={trackRef}
          className="scrollbar-none -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10 lg:-mx-16 lg:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {WHITE_PAPERS.map((paper) => (
            <a
              key={paper.id}
              href={paper.url}
              className="group flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-colors duration-300 hover:border-accent/40 sm:w-[60%] md:w-[45%] lg:w-[calc(25%-12px)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-background-elevated">
                <Image
                  src={paper.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 85vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">PDF</span>
                <h4 className="text-balance line-clamp-3 text-sm leading-snug font-normal text-foreground">{paper.title}</h4>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{paper.description}</p>
                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground/70">{paper.fileSize}</span>
                  <ArrowDown
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent"
                  />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous white paper"
            className="flex size-11 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent active:border-accent/60 active:text-accent"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
          </button>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {pad(activeIndex)} / {pad(total - 1)}
          </span>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next white paper"
            className="flex size-11 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent active:border-accent/60 active:text-accent"
          >
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
