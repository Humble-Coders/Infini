import { cn } from "@/components/ui/utils";

type SpotlightProps = {
  className?: string;
  /** Horizontal focal point of the cone (any CSS x-position). Defaults to top-centre. */
  x?: string;
};

/**
 * The signature top-light: a soft brand-red cone falling from the top of a
 * dark band. Centred everywhere by default; the homepage hero nudges it
 * right via `x`. One component, one light source. Pure CSS radial gradient,
 * server-safe, zero JS. Place as the first child of a `relative` dark
 * section.
 */
export function Spotlight({ className, x = "50%" }: SpotlightProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        background: `radial-gradient(ellipse 65% 50% at ${x} 0%, rgba(var(--color-primary-rgb),0.32), transparent 70%)`,
      }}
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}
