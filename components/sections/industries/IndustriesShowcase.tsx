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
    <IndustriesSectionScroll className="mmp-industries relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28 lg:py-32">
      {/* Bespoke blueprint/precision backdrop — inert everywhere except the mmp-industrial preview. */}
      <div className="mmp-decor pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -bottom-28 -right-28 h-[380px] w-[380px] rounded-full border border-[color:var(--ind-decor)]" />
        <div className="absolute -bottom-28 -right-28 h-[260px] w-[260px] translate-x-[60px] translate-y-[-30px] rounded-full border border-[color:var(--ind-decor)]" />
        <div className="absolute -bottom-28 -right-28 h-[160px] w-[160px] translate-x-[120px] translate-y-[-60px] rounded-full border border-[color:var(--ind-decor)]" />
        <span className="absolute bottom-[112px] right-[112px] size-2 rounded-full bg-[color:var(--ind-accent)]" />

        <div
          className="absolute bottom-[30%] left-0 h-56 w-56 opacity-70 [mask-image:linear-gradient(to_right,black,transparent)]"
          style={{ backgroundImage: "radial-gradient(var(--ind-decor) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />

        <svg className="absolute bottom-[20%] left-[18%] h-24 w-24 text-[color:var(--ind-decor)]" viewBox="0 0 100 100" fill="none">
          <path d="M96 40 L40 96" stroke="currentColor" strokeWidth="1" />
          <path d="M40 96 L40 78 M40 96 L58 96" stroke="currentColor" strokeWidth="1" />
        </svg>

        <div className="absolute -top-32 -left-32 h-[380px] w-[380px] rounded-full border border-[color:var(--ind-decor)] opacity-60" />
        <div className="absolute -top-20 -left-20 h-[220px] w-[220px] rounded-full border border-[color:var(--ind-decor)] opacity-40" />
      </div>

      <Container className="mmp-intro relative flex flex-col gap-14 lg:flex-row lg:gap-16">
        <div className="flex shrink-0 flex-col gap-5 lg:sticky lg:top-28 lg:w-56 lg:self-start xl:w-64">
          <SectionEyebrow>Industries</SectionEyebrow>
          <h2 className="mmp-intro-heading text-[clamp(1.75rem,3vw,2.25rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            Engineered for
            <br />
            demanding industries
          </h2>
          <p className="mmp-intro-body max-w-[26ch] text-sm leading-relaxed text-muted-foreground">
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
