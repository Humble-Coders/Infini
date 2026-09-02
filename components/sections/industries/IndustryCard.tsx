import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { IndustryDoc, WithId } from "@/lib/types";

export function IndustryCard({ industry }: { industry: WithId<IndustryDoc> }) {
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group flex flex-col items-center gap-4 rounded-xl px-4 py-8 text-center transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <span className="flex size-16 items-center justify-center rounded-full border border-border bg-primary-muted text-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
        <IndustryIcon slug={industry.slug} className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <span className="text-sm font-normal tracking-wide text-foreground sm:text-base">{industry.name}</span>

      <span className="flex items-center gap-1.5 pt-1 text-xs text-accent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
        Know More
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
