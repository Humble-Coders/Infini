import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";
import { ApplicationExplorer } from "./ApplicationExplorer";
import { APPLICATIONS_BY_INDUSTRY, type IndustryApplications } from "./applicationsData";

export function ApplicationsSection({
  industries = APPLICATIONS_BY_INDUSTRY,
}: {
  industries?: IndustryApplications[];
}) {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28 lg:py-32">
      <Container className="relative flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <SectionEyebrow>Industry Applications</SectionEyebrow>
          <h2 className="text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] font-bold tracking-[-0.02em] text-foreground uppercase">
            Precision, applied.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            From aerospace airfoils to medical implants, our technology is engineered around the surfaces
            that define performance.
          </p>
        </div>

        <ApplicationExplorer industries={industries} />

        <Link
          href="/capabilities"
          className="group inline-flex w-fit items-center gap-2 self-center text-xs font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent"
        >
          View component types
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </Container>
    </section>
  );
}
