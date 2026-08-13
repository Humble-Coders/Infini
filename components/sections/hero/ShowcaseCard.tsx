import type { ShowcaseCard as ShowcaseCardData } from "@/data/home-hero";
import { cn } from "@/components/ui/utils";

export function ShowcaseCard({
  card,
  index,
  className,
}: {
  card: ShowcaseCardData;
  index: number;
  className?: string;
}) {
  const gradientAngle = 60 + index * 35;

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-secondary shadow-[0_20px_60px_-15px_rgba(var(--color-shadow-rgb),0.7)]",
        "aspect-[4/3] w-[clamp(280px,80vw,600px)]",
        className
      )}
    >
      <div
        className="relative flex h-full w-full flex-col justify-end p-5 sm:p-6"
        style={{
          background: `conic-gradient(from ${gradientAngle}deg at 50% 50%, var(--color-popover), var(--color-muted) 20%, var(--color-background) 45%, var(--color-primary-muted) 60%, var(--color-popover) 80%, var(--color-muted))`,
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 6px, rgba(var(--color-foreground-rgb),0.05) 7px)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
        <span className="relative w-fit rounded-full border border-border/70 bg-background/50 px-3 py-1 text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
          {card.industry}
        </span>
        <p className="relative mt-2 max-w-md text-base leading-snug text-foreground/90 sm:text-lg">
          {card.headline}
        </p>
      </div>
      <span className="sr-only">{`${card.industry}: ${card.headline}`}</span>
    </figure>
  );
}
