/**
 * Decorative technical-blueprint layer shared by the trust-logos and contact
 * sections — a dotted grid, partial concentric circles, a crosshair and short
 * measurement ticks, all under 12% opacity. Colors resolve from the active
 * theme's tokens (`currentColor`/CSS vars), not fixed hex, so it reads
 * correctly under every color scheme, not just one. Purely cosmetic, so it's
 * one aria-hidden block rather than semantic SVG content.
 */
export function BlueprintBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-foreground">
      {/* Cool secondary wash, off-center, so the base color isn't perfectly flat. */}
      <div
        className="absolute -top-1/3 right-[-10%] h-[140%] w-[70%] rounded-full bg-background-elevated opacity-70 blur-3xl"
      />

      {/* Small dotted grid. */}
      <div
        className="absolute inset-0 text-muted-foreground opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Large partial concentric circles, top-right, with a small center point. */}
      <svg
        className="absolute -top-24 -right-24 h-[420px] w-[420px] opacity-[0.09] sm:h-[560px] sm:w-[560px]"
        viewBox="0 0 560 560"
        fill="none"
      >
        <circle cx="560" cy="0" r="220" stroke="currentColor" strokeWidth="1" />
        <circle cx="560" cy="0" r="330" stroke="currentColor" strokeWidth="1" />
        <circle cx="560" cy="0" r="440" stroke="currentColor" strokeWidth="1" />
        <circle cx="560" cy="0" r="3.5" className="fill-accent" />
      </svg>

      {/* Large partial concentric circles, bottom-left. */}
      <svg
        className="absolute -bottom-32 -left-32 h-[360px] w-[360px] opacity-[0.08] sm:h-[480px] sm:w-[480px]"
        viewBox="0 0 480 480"
        fill="none"
      >
        <circle cx="0" cy="480" r="180" stroke="currentColor" strokeWidth="1" />
        <circle cx="0" cy="480" r="280" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Precision crosshair. */}
      <svg
        className="absolute top-10 left-6 h-14 w-14 text-accent opacity-[0.1] sm:top-16 sm:left-16"
        viewBox="0 0 56 56"
        fill="none"
      >
        <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="1" />
        <path d="M28 0 V12 M28 44 V56 M0 28 H12 M44 28 H56" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Short technical measurement ticks. */}
      <svg
        className="absolute right-8 bottom-10 h-10 w-32 opacity-[0.1] sm:right-20 sm:bottom-16"
        viewBox="0 0 128 32"
        fill="none"
      >
        <path
          d="M0 16 H128 M0 8 V24 M32 12 V20 M64 8 V24 M96 12 V20 M128 8 V24"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      {/* Thin corner bracket. */}
      <svg
        className="absolute top-8 right-8 h-8 w-8 text-accent opacity-[0.12] sm:top-10 sm:right-10"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path d="M0 12 V0 H12" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </div>
  );
}
