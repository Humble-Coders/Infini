import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import type { HeroCopy } from "@/lib/types";

const FALLBACK: HeroCopy = {
  heading: "A finish\nthat performs.",
  body: "Precision surface-finishing for components precision manufacturers already trust, applied in-house, verified before it ships.",
  ctaNote: "No project too precise. Talk to our engineers.",
};

export function HeroContent({ copy }: { copy: HeroCopy | null }) {
  const { heading, body, ctaNote } = copy ?? FALLBACK;
  const headingLines = heading.split("\n");

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-light tracking-[-0.02em] text-foreground">
        {headingLines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 && <br />}
            {line}
          </Fragment>
        ))}
      </h1>
      <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">{body}</p>
      <div className="flex flex-col items-center gap-3">
        <Button asChild variant="inverse" size="lg" className="px-8">
          <Link href="/request-a-quote">Request a Quote</Link>
        </Button>
        <p className="text-xs text-muted-foreground">{ctaNote}</p>
      </div>
    </div>
  );
}
