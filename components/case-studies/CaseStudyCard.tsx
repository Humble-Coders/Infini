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
      className="group flex flex-col overflow-hidden rounded-xl border border-border transition-colors hover:border-primary"
    >
      {caseStudy.afterImage && (
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={caseStudy.afterImage}
            alt={`${caseStudy.title} — finished result`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {industryName && <span className="text-xs tracking-wide text-muted-foreground uppercase">{industryName}</span>}
        <h3 className="text-lg font-normal text-foreground">{caseStudy.title}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{caseStudy.challenge}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-accent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
          View case study
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
