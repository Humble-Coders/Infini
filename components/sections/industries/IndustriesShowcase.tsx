import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";
import { IndustriesExplorer, IndustriesExplorerCta } from "./IndustriesExplorer";
import { IndustriesSectionScroll } from "./IndustriesSectionScroll";
import { INDUSTRIES_SHOWCASE, type IndustryShowcaseItem } from "./industriesShowcaseData";

export function IndustriesShowcase({
  industries = INDUSTRIES_SHOWCASE,
}: {
  industries?: IndustryShowcaseItem[];
}) {
  return (
    <IndustriesSectionScroll className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28 lg:py-32">
      <Container className="relative flex flex-col gap-14 lg:flex-row lg:gap-16">
        <div className="flex shrink-0 flex-col gap-5 lg:sticky lg:top-28 lg:w-56 lg:self-start xl:w-64">
          <SectionEyebrow>Industries</SectionEyebrow>
          <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            Engineered for
            <br />
            demanding industries
          </h2>
          <p className="max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
            Our precision surface finishing technology delivers repeatable performance across some of
            the world&apos;s most demanding engineering applications.
          </p>
          <IndustriesExplorerCta />
        </div>

        <div className="min-w-0 flex-1">
          <IndustriesExplorer industries={industries} />
        </div>
      </Container>
    </IndustriesSectionScroll>
  );
}
