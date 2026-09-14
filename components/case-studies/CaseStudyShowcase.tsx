"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { CaseStudyResult, CaseStudyDoc, WithId } from "@/lib/types";

/**
 * A sticky two-column showcase of the case studies loaded for the current
 * filter. The left column stays pinned while the user scrolls; text fades in
 * per item as the right column scrolls its imagery. Uses next/image and keeps
 * all copy/links from the source data.
 *
 * Each sticky-side slide is its own component (`ShowcaseSlide`) so the
 * per-item useTransform hooks are stable across re-renders, never call
 * hooks inside a `.map()`.
 */
export function CaseStudyShowcase({
  caseStudies,
  industryNameById,
}: {
  caseStudies: WithId<CaseStudyDoc>[];
  industryNameById: Map<string, string | undefined>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (caseStudies.length === 0) return null;

  const total = caseStudies.length;

  return (
    <div ref={containerRef} className="relative">
      <div className="grid lg:grid-cols-2">
        {/* Sticky left column, text */}
        <div className="sticky top-20 hidden h-[70vh] items-center lg:flex">
          <div className="relative w-full">
            {caseStudies.map((caseStudy, i) => (
              <ShowcaseSlide
                key={caseStudy.slug}
                caseStudy={caseStudy}
                index={i}
                total={total}
                progress={scrollYProgress}
                industryName={industryNameById.get(caseStudy.industryId)}
              />
            ))}
          </div>
        </div>

        {/* Right column, imagery */}
        <div className="space-y-[40vh] lg:px-10">
          {caseStudies.map((caseStudy, i) => (
            <ShowcaseImage
              key={caseStudy.slug}
              caseStudy={caseStudy}
              index={i}
              total={total}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* Mobile fallback: a vertical stack so the sticky layout isn't lost on
          small screens. */}
      <div className="mt-10 space-y-10 lg:hidden">
        {caseStudies.map((caseStudy) => (
          <MobileStudyCard
            key={caseStudy.slug}
            caseStudy={caseStudy}
            industryName={industryNameById.get(caseStudy.industryId)}
          />
        ))}
      </div>
    </div>
  );
}

/** A text slide pinned in the left column, fades in/out across its segment. */
function ShowcaseSlide({
  caseStudy,
  index,
  total,
  progress,
  industryName,
}: {
  caseStudy: WithId<CaseStudyDoc>;
  index: number;
  total: number;
  progress: MotionValue<number>;
  industryName?: string;
}) {
  const opacity = useTransform(
    progress,
    [index / total, (index + 0.5) / total, (index + 1.5) / total],
    [0, 1, 0]
  );
  const y = useTransform(
    progress,
    [index / total, (index + 0.5) / total],
    [30, 0]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center gap-5 pr-12"
    >
      <span className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
        {String(index + 1).padStart(2, "0")}, {industryName ?? "Case study"}
      </span>
      <h2 className="text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.08] font-light tracking-[-0.02em] text-foreground">
        {caseStudy.title}
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {caseStudy.challenge}
      </p>

      {(caseStudy.results ?? []).length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {caseStudy.results!.map((r: CaseStudyResult) => (
            <li
              key={r.label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground"
            >
              {r.direction === "up" ? (
                <TrendingUp className="size-3.5 text-accent" aria-hidden="true" />
              ) : r.direction === "down" ? (
                <TrendingDown className="size-3.5 text-accent" aria-hidden="true" />
              ) : (
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              )}
              <span className="font-medium">{r.value}</span>
              <span className="text-muted-foreground">{r.label}</span>
            </li>
          ))}
        </ul>
      )}

      <div>
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="group inline-flex items-center gap-1.5 text-accent transition-colors hover:text-foreground"
        >
          <span className="text-xs font-medium">Read case study</span>
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.div>
  );
}

/** One image in the right column, eases in scale as its segment scrolls by. */
function ShowcaseImage({
  caseStudy,
  index,
  total,
  progress,
}: {
  caseStudy: WithId<CaseStudyDoc>;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const scale = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [0.92, 1]
  );

  return (
    <motion.div
      style={{ scale }}
      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_24px_60px_-24px_rgba(var(--color-shadow-rgb),0.6)]"
    >
      {caseStudy.afterImage && (
        <Image
          src={caseStudy.afterImage}
          alt={`${caseStudy.title}, finished result`}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        {caseStudy.specs?.material && (
          <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-white/85">
            {caseStudy.specs.material}
          </span>
        )}
        {caseStudy.specs?.process && (
          <span className="rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-white/85">
            {caseStudy.specs.process}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/** Simple stacked card for small screens. */
function MobileStudyCard({
  caseStudy,
  industryName,
}: {
  caseStudy: WithId<CaseStudyDoc>;
  industryName?: string;
}) {
  return (
    <article className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted">
        {caseStudy.afterImage && (
          <Image
            src={caseStudy.afterImage}
            alt={`${caseStudy.title}, finished result`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
          {industryName ?? "Case study"}
        </span>
        <h2 className="text-xl font-light text-foreground">{caseStudy.title}</h2>
        <p className="text-sm text-muted-foreground">{caseStudy.challenge}</p>
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="inline-flex items-center gap-1.5 text-accent"
        >
          <span className="text-xs font-medium">Read case study</span>
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}