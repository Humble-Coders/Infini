import Image from "next/image";
import { Container } from "@/components/ui/container";
import type { HomeImage, TechnologyCopy } from "@/lib/types";
import { EmphasisHeading } from "./EmphasisHeading";
import { MonoLabel } from "./MonoLabel";
import { ProcessSteps } from "./ProcessSteps";
import { PROCESS_IMAGES_FALLBACK } from "./galleryPlaceholders";

const FALLBACK: TechnologyCopy = {
  eyebrow: "The MMP process",
  heading: "A treatment,\nnot a coating.",
  body: "MMP (Micro Machining Process) is a mechanical-physical-chemical treatment performed in dedicated tanks. It selectively removes frequencies of surface roughness from components our customers manufacture, no material added, no dimensional drift, just a controlled finish verified against measurable roughness targets.",
  steps: [
    { step: "01", title: "Validation", description: "Component geometry, material and target roughness are assessed before treatment begins." },
    { step: "02", title: "Treatment", description: "The MMP process runs in-house, in tanks tuned to the component and finish required." },
    { step: "03", title: "Verification", description: "Every batch is measured against the agreed roughness spec before it ships." },
  ],
};

function Photo({ image, className, sizes, priority = false }: { image: HomeImage; className: string; sizes: string; priority?: boolean }) {
  return (
    <figure className={`relative overflow-hidden rounded-2xl bg-secondary ${className}`}>
      <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      {image.caption && (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-gradient-to-t from-metal-900/85 to-transparent p-4 sm:p-5">
          <span className="font-mono text-[10px] tracking-[0.2em] text-metal-100 uppercase sm:text-[11px]">{image.caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

/**
 * How MMP works: one lead photograph of the process beside the three stages,
 * with an optional second photo under the steps. Copy and images come from
 * `pages/home`'s `technology` section; the in-code fallback keeps the page
 * whole until that document carries its own images.
 */
export function ProcessSection({ copy }: { copy: TechnologyCopy | null }) {
  const { eyebrow, heading, body, steps, images } = { ...FALLBACK, ...(copy ?? {}) };
  const [lead, secondary] = images && images.length > 0 ? images : PROCESS_IMAGES_FALLBACK;

  return (
    <section id="process" data-surface="light" className="scroll-mt-20 bg-background py-24 sm:py-32 lg:py-40">
      <Container className="flex flex-col gap-14 lg:gap-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-6">
            <MonoLabel>{eyebrow}</MonoLabel>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance text-foreground">
              <EmphasisHeading text={heading} />
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg lg:col-span-5 lg:col-start-8">
            {body}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {lead && (
            <div className="lg:col-span-7">
              <Photo
                image={lead}
                className="aspect-[4/3] w-full sm:aspect-[16/10] lg:sticky lg:top-28 lg:aspect-[4/5]"
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            </div>
          )}
          <div className="flex flex-col gap-12 lg:col-span-5">
            {steps.length > 0 && <ProcessSteps steps={steps} />}
            {secondary && (
              <Photo image={secondary} className="aspect-[16/10] w-full" sizes="(min-width: 1024px) 42vw, 100vw" />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
