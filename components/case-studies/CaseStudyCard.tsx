import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CaseStudyDoc, WithId } from "@/lib/types";

export function CaseStudyCard({
  caseStudy,
  industryName,
}: {
  caseStudy: WithId<CaseStudyDoc>;
  industryName?: string;
}) {
  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_10px_30px_-18px_rgba(var(--color-shadow-rgb),0.6)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_60px_-16px_rgba(var(--color-shadow-rgb),0.55)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {caseStudy.afterImage && (
          <Image
            src={caseStudy.afterImage}
            alt={`${caseStudy.title}, finished result`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        )}

        {industryName && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-medium tracking-wide text-primary-foreground uppercase">
            {industryName}
          </span>
        )}

        {caseStudy.specs?.material && (
          <span className="absolute right-3 bottom-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[10px] tracking-wide text-white/85">
            {caseStudy.specs.material}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-base font-normal text-foreground transition-colors duration-300 group-hover:text-primary">
          {caseStudy.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{caseStudy.challenge}</p>
        <span className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium text-accent">
          View case study
          <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
