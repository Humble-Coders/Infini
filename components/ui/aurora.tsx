import { cn } from "@/components/ui/utils";

type AuroraProps = {
  className?: string;
};

/**
 * Slow-drifting brand-red aurora blobs (React Bits Aurora-style, CSS-only).
 * GPU-friendly: transform-only keyframes on blurred radial blobs, so it
 * stays cheap on mobile. Server-safe, no client JS. The global
 * prefers-reduced-motion rule freezes it to a static glow. Colours come from
 * the brand tokens, so it re-skins itself if the theme ever changes.
 */
export function Aurora({ className }: AuroraProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-[30%] left-[12%] size-[26rem] animate-aurora-a rounded-full bg-primary/35 blur-[80px] sm:size-[36rem] sm:blur-[120px]" />
      <div className="absolute top-[10%] -right-[10%] size-[22rem] animate-aurora-b rounded-full bg-primary/22 blur-[80px] sm:size-[30rem] sm:blur-[120px]" />
      <div className="absolute -bottom-[35%] left-[45%] hidden size-[28rem] animate-aurora-c rounded-full bg-accent/15 blur-[120px] sm:block" />
    </div>
  );
}
