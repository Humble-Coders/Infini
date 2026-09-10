import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { BeforeAfterSlider } from "@/components/ui/before-after-slider";

export interface EvidenceReading {
  label: string;
  value: string;
}

/**
 * One photograph given a full band, captioned as evidence rather than as
 * decoration.
 *
 * The research on this category was blunt about it: a finishing company's most
 * persuasive asset is a before and after with the measured numbers attached,
 * and almost nobody attaches the numbers. The readings run underneath in mono
 * so the image works as proof even to someone who only scans the figures, and
 * so the caption still carries meaning if the photograph fails to load.
 */
export function EvidenceImage({
  label,
  heading,
  body,
  src,
  alt,
  readings = [],
  surface = "dark",
}: {
  label: string;
  heading: string;
  body?: string;
  src: string;
  alt: string;
  readings?: EvidenceReading[];
  surface?: "light" | "dark";
}) {
  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-24 sm:py-32"
    >
      <Container className="flex flex-col gap-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <MonoLabel>{label}</MonoLabel>
            <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-foreground">
              {heading}
            </h2>
            {body && (
              <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{body}</p>
            )}
          </div>

          {readings.length > 0 && (
            <dl className="flex flex-col self-end lg:col-span-5 lg:col-start-8">
              {readings.map((reading) => (
                <div
                  key={reading.label}
                  className="flex items-baseline justify-between gap-6 border-b border-border py-3.5"
                >
                  <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                    {reading.label}
                  </dt>
                  <dd className="font-mono text-sm tabular-nums text-foreground">{reading.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Reveal>
          <figure className="flex flex-col gap-4">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border bg-background-elevated">
              <BeforeAfterSlider 
                beforeImage={src}
                afterImage={src}
                alt={alt}
              />
            </div>
            <figcaption className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase flex items-center justify-between">
              <span>{alt}</span>
              <span className="text-accent flex items-center gap-2"><ArrowLeftRight className="size-3" /> Drag to compare</span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
