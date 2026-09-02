import Image from "next/image";
import { cn } from "@/components/ui/utils";

interface ShowcaseCardData {
  id: string;
  industry: string;
  headline: string;
  image?: string;
}

export function ShowcaseCard({
  card,
  index,
  className,
}: {
  card: ShowcaseCardData;
  index: number;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-secondary shadow-[0_20px_60px_-15px_rgba(var(--color-shadow-rgb),0.7)]",
        "aspect-[4/3] w-[clamp(280px,80vw,600px)]",
        className
      )}
    >
      <div className="relative flex h-full w-full flex-col justify-end" aria-hidden="true">
        {card.image && (
          <Image
            src={card.image}
            alt=""
            fill
            sizes="(min-width: 640px) 600px, 80vw"
            className="object-cover"
            priority={index === 0}
          />
        )}
        <div className="relative flex flex-col gap-2 bg-black/70 p-5 sm:p-6">
          <span className="w-fit rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] tracking-[0.15em] text-white/80 uppercase">
            {card.industry}
          </span>
          <p className="max-w-md text-base leading-snug text-white/95 sm:text-lg">{card.headline}</p>
        </div>
      </div>
      <span className="sr-only">{`${card.industry}: ${card.headline}`}</span>
    </figure>
  );
}
