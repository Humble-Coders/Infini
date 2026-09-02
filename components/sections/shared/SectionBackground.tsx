import { PrecisionMark } from "./PrecisionMark";

/** Corner line-art accent behind a section's content — flat stroked SVG, no gradients. */
export function SectionBackground({ grid = false }: { grid?: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-foreground/70">
      <PrecisionMark
        className="absolute -top-10 -right-10 h-[340px] w-[340px] opacity-[0.12] sm:h-[420px] sm:w-[420px]"
      />
      {grid && (
        <PrecisionMark
          corner="bottom-left"
          className="absolute -bottom-16 -left-16 h-[280px] w-[280px] opacity-[0.08] sm:h-[340px] sm:w-[340px]"
        />
      )}
    </div>
  );
}
