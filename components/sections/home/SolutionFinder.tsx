"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
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

/**
 * "Solution Finder" — a guided three-step tool on the homepage that helps
 * visitors identify the right MMP application for their use case.
 */
export function SolutionFinder({ industries }: { industries: IndustryOption[] }) {
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");

  const targetSlug = selectedIndustry ? `/industries/${selectedIndustry}` : "/industries";
  const isReady = selectedIndustry !== "";

  return (
    <section className="border-y border-border bg-background-elevated/50 py-20 sm:py-28">
      <Container className="flex flex-col gap-12 max-w-5xl">
        <Reveal className="flex flex-col gap-4 text-center items-center">
          <MonoLabel>Find your application</MonoLabel>
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
                <SelectContent>
                  <SelectItem value="">All industries</SelectItem>
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
                <SelectContent>
                  <SelectItem value="">All outcomes</SelectItem>
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
                className={`group inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                  isReady
                    ? "bg-accent text-white hover:bg-accent/90 border-transparent shadow-[0_0_1.5rem_-0.5rem_rgba(var(--color-accent-rgb),0.5)]"
                    : "bg-white/5 text-white hover:bg-white/10 border-white/20"
                }`}
              >
                {isReady ? "See solutions for this industry" : "Browse all industries"}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Stats bar */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-8 border-t border-border pt-8 sm:gap-14">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[2.25rem] leading-[1] font-mono font-medium text-accent sm:text-[3rem]">
                <CountUp value={8} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Industries</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[2.25rem] leading-[1] font-mono font-medium text-accent sm:text-[3rem]">
                <CountUp value={7} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Plants worldwide</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[2.25rem] leading-[1] font-mono font-medium text-accent sm:text-[3rem]">
                <CountUp value={2002} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Process since</span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[2.25rem] leading-[1] font-mono font-medium text-accent sm:text-[3rem]">
                <CountUp value={5} />
              </span>
              <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Certifications</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
