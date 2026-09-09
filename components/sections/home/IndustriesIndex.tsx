import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Spotlight } from "@/components/ui/spotlight";
import { MarketInfographicLogo } from "@/components/ui/market-infographic-logo";
import type { IndustryDoc, TeaserCopy, WithId } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { IndustryHoverList } from "./IndustryHoverList";
import { MonoLabel } from "./MonoLabel";

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

const FALLBACK_BODY =
  "Working from its own treatment labs, INFINI is poised to provide manufacturers with custom finishes to meet their specifications.";

/**
 * Industries as an editorial index rather than a card grid: number, name
 * with its headline beneath, and a transparent infinity mark that floods red
 * on hover, plus a cursor-following photograph per row. Every row is a real
 * link to its industry page; imagery flows from each industry's own hero
 * image, never hardcoded here.
 */
export function IndustriesIndex({
  industries,
  copy,
}: {
  industries: WithId<IndustryDoc>[];
  copy: TeaserCopy | null;
}) {
  const count = industries.length;
  const countWord = NUMBER_WORDS[count] ?? String(count);
  const heading = `${countWord} industries.\nOne controlled process.`;

  return (
    <section id="industries" className="relative scroll-mt-20 bg-background py-24 sm:py-32 lg:py-40">
      <Spotlight x="85%" />
      <Container className="relative flex flex-col gap-14 lg:gap-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <div className="flex items-center gap-4">
              <MarketInfographicLogo className="size-12 sm:size-16" />
              <MonoLabel>{copy?.eyebrow ?? "Industries & Applications"}</MonoLabel>
            </div>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance text-foreground">
              <EmphasisHeading text={heading} />
            </h2>
          </div>
          <div className="flex flex-col gap-4 self-end lg:col-span-5 lg:col-start-8">
            <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
              {copy?.heading ?? FALLBACK_BODY}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-pretty text-foreground/80 sm:text-base border-l-2 border-primary pl-4">
              <strong className="text-foreground">MMP Technology Applications:</strong> Applied universally across sectors, our process is tailored for cutting edges, turbine components, medical implants, precision molds, sintered parts, and high-load transmission gears, delivering repeatable performance where traditional finishing falls short.
            </p>
          </div>
        </div>

        {count === 0 ? (
          <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-sm text-muted-foreground">
            Industry pages are being published. Contact us to discuss your application directly.
          </p>
        ) : (
          <IndustryHoverList
            industries={industries.map((industry) => ({
              id: industry.id,
              slug: industry.slug,
              name: industry.name,
              headline: industry.hero.headline,
              image: industry.hero.image,
            }))}
          />
        )}

        <Link
          href="/industries"
          className="group inline-flex w-fit items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-foreground uppercase transition-colors hover:text-accent"
        >
          All industries
          <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-300 group-hover:w-12" />
        </Link>
      </Container>
    </section>
  );
}
