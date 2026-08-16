import Image from "next/image";

/**
 * Side-by-side on tablet/desktop, stacked on mobile — deliberately not a
 * drag-slider. A slider needs client JS and enough width for both images
 * to register as "different" under a thumb drag; at 375px that's exactly
 * the layout the ticket warns falls apart. Two clearly labeled, always-
 * visible images are legible at any width and need no interaction to work.
 */
export function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
}: {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
}) {
  if (!beforeImage && !afterImage) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {beforeImage && (
        <figure className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={beforeImage} alt={beforeAlt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="text-center text-xs tracking-[0.2em] text-muted-foreground uppercase">Before</figcaption>
        </figure>
      )}
      {afterImage && (
        <figure className="flex flex-col gap-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={afterImage} alt={afterAlt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="text-center text-xs tracking-[0.2em] text-accent uppercase">After</figcaption>
        </figure>
      )}
    </div>
  );
}
