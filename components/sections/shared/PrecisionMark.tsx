/**
 * Flat line-art motif — concentric rings, crosshair ticks and viewfinder
 * corner brackets — standing in for the measurement/inspection imagery core
 * to INFINI's surface-finishing story. Pure stroked SVG (`currentColor`), no
 * gradients or raster assets, so it tracks whatever theme is active.
 */
export function PrecisionMark({
  className,
  corner = "top-right",
}: {
  className?: string;
  corner?: "top-right" | "bottom-left";
}) {
  const flip = corner === "bottom-left";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className={className}
      style={flip ? { transform: "rotate(180deg)" } : undefined}
    >
      <circle cx="320" cy="80" r="150" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <circle cx="320" cy="80" r="100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <circle cx="320" cy="80" r="50" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="320" cy="80" r="3" fill="currentColor" />
      <path d="M320 8v28M320 124v28M248 80h28M364 80h28" stroke="currentColor" strokeWidth="1" />
      <path d="M20 20v50M20 20h50" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M100 340l60-60M100 340v-32M100 340h32" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}
