import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { industries, industriesSectionCopy } from "@/data/industries";
import { IndustryCard } from "./IndustryCard";

export function IndustriesSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <SectionBackground grid />
      <Container className="relative flex flex-col gap-14">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {industriesSectionCopy.eyebrow}
          </span>
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">
            {industriesSectionCopy.heading}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-7">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </Container>
    </section>
  );
}
