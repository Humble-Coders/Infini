"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IndustryIcon } from "@/lib/constants/industryIcons";
import type { IndustryDoc, WithId } from "@/lib/types";

const TiltCard = dynamic(
  () => import("@/components/ui/tilt-card").then((m) => m.TiltCard),
  { ssr: false }
);

/**
 * Bento grid of industry cards with 3D tilt + glow.
 * Extracted and dynamically imported so framer-motion is lazy-loaded.
 */
export function IndustriesBentoGrid({
  industries,
}: {
  industries: WithId<IndustryDoc>[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {industries.map((industry, index) => {
        const span =
          index === 0 ? "lg:col-span-2 lg:row-span-1" : index === 3 ? "lg:col-span-2" : "";
        return (
          <div key={industry.slug} className={span}>
            <TiltCard className="h-full">
              <Link
                href={`/industries/${industry.slug}`}
                className="group flex h-full flex-col gap-5 p-6 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 ease-out group-hover:border-primary group-hover:bg-primary-muted group-hover:text-accent">
                    <IndustryIcon slug={industry.slug} className="size-6" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground/60 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-normal text-foreground transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                    {industry.name}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {industry.hero.subheadline}
                  </p>
                </div>

                <span className="mt-auto flex items-center gap-1.5 border-t border-border/60 pt-4 text-xs font-medium text-accent opacity-70 transition-all duration-300 ease-out group-hover:gap-2.5 group-hover:opacity-100">
                  View industry
                  <ArrowRight className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </TiltCard>
          </div>
        );
      })}
    </div>
  );
}
