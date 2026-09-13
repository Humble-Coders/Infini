"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/components/ui/utils";
import { MonoLabel } from "./MonoLabel";

type IndustryOption = {
  name: string;
  slug: string;
};

const OUTCOMES = [
  "Decrease friction",
  "Increase tool life",
  "Reduce surface roughness",
  "Remove EDM recast layer",
  "Improve fatigue resistance",
  "Better flow efficiency",
  "Contamination-free finish",
  "Post-hardening refinement",
] as const;

/** Radix Select reserves the empty string for "no value", so the "All" choices need a value of their own. */
const ALL = "all";

/**
 * "Solution Finder": a guided step on the homepage that helps visitors
 * identify the right MMP application for their use case, with the headline
 * counters underneath.
 *
 * First band of the white run straight after the hero, so it runs on the
 * light-surface tokens. The dropdowns portal out of the section, so they carry
 * the light surface themselves or they would open dark over a white band.
 */
export function SolutionFinder({
  industries,
  certificationsCount,
}: {
  industries: IndustryOption[];
  certificationsCount: number;
}) {
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");

  const isReady = selectedIndustry !== "" && selectedIndustry !== ALL;
  const targetSlug = isReady ? `/industries/${selectedIndustry}` : "/industries";

  const counters = [
    { value: industries.length, label: "Industries" },
    { value: 7, label: "Plants worldwide" },
    { value: 2002, label: "Process since" },
    { value: certificationsCount, label: "Certifications" },
  ];

  return (
    <section data-surface="light" className="bg-background-elevated pt-20 pb-12 sm:pt-28 sm:pb-16">
      <Container className="flex flex-col gap-12 max-w-5xl">
        <Reveal className="flex flex-col gap-4 text-center items-center">
          <MonoLabel>Find your industry</MonoLabel>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em] text-foreground">
            What does MMP Technology do for your parts?
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Select your industry and desired outcome. We will show you exactly how MMP treatment applies to your components.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-end">
            {/* Industry Dropdown */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="sf-industry"
                className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
              >
                Your industry
              </label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger id="sf-industry" className="h-12 rounded-xl border-border bg-background px-4 text-sm focus-visible:ring-accent">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent data-surface="light">
                  <SelectItem value={ALL}>All industries</SelectItem>
                  {industries.map((ind) => (
                    <SelectItem key={ind.slug} value={ind.slug}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Outcome Dropdown */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="sf-outcome"
                className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase"
              >
                Desired outcome
              </label>
              <Select value={selectedOutcome} onValueChange={setSelectedOutcome}>
                <SelectTrigger id="sf-outcome" className="h-12 rounded-xl border-border bg-background px-4 text-sm focus-visible:ring-accent">
                  <SelectValue placeholder="All outcomes" />
                </SelectTrigger>
                <SelectContent data-surface="light">
                  <SelectItem value={ALL}>All outcomes</SelectItem>
                  {OUTCOMES.map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>
                      {outcome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-transparent uppercase select-none sm:block hidden">
                Action
              </span>
              <Link
                href={targetSlug}
                className={cn(
                  "group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border px-5 font-mono text-[11px] tracking-[0.16em] whitespace-nowrap uppercase transition-colors",
                  isReady
                    ? "border-transparent bg-accent text-accent-foreground shadow-[0_0_1.5rem_-0.5rem_rgba(var(--color-accent-rgb),0.5)] hover:bg-accent/90"
                    : "border-border bg-background text-foreground hover:border-foreground/40 hover:bg-foreground/5"
                )}
              >
                {isReady ? "See industry solutions" : "Browse all industries"}
                <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Counters */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-8 border-t border-border pt-8 sm:gap-14">
            {counters.map((counter, index) => (
              <Fragment key={counter.label}>
                {index > 0 && <div aria-hidden="true" className="h-8 w-px bg-border" />}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[2.25rem] leading-[1] font-mono font-medium text-accent sm:text-[3rem]">
                    <CountUp value={counter.value} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                    {counter.label}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
