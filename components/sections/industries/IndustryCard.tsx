import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Industry } from "@/data/industries";

export function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = industry.icon;

  return (
    <Link
      href={`/industries/${industry.slug}`}
      className="group flex flex-col items-center gap-4 rounded-xl px-4 py-8 text-center transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <span className="flex size-16 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-primary group-hover:text-primary group-hover:shadow-[0_0_0_6px_rgba(var(--color-accent-rgb),0.08)]">
        <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
      </span>

      <span className="text-sm font-normal tracking-wide text-foreground sm:text-base">
        {industry.name}
      </span>

      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <span className="flex items-center gap-1.5 pt-1 text-xs text-accent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
            Know More
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
