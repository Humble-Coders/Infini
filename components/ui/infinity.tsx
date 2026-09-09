/**
 * Brand-infinity geometry, a true Bernoulli lemniscate sampled into a dense
 * polyline, so the curve is perfectly smooth like the company logo mark
 * (hand-placed beziers always show lumps at this size). Computed once at
 * module scope; deterministic, SSR-safe.
 */
function lemniscatePath(segments = 96): string {
  const cx = 100;
  const cy = 50;
  const sx = 88;
  const sy = 132;
  const points: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const s = Math.sin(t);
    const c = Math.cos(t);
    const denominator = 1 + s * s;
    const x = cx + sx * (c / denominator);
    const y = cy - sy * ((s * c) / denominator);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `${points.join(" ")} Z`;
}

/** Shared brand-infinity geometry, one source for the curtain, the page transition and any future glyph use. */
export const INFINITY_PATH = lemniscatePath();

type InfinityGlyphProps = {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

/** Static presentational infinity mark. For animated versions see IntroCurtain / PageTransition. */
export function InfinityGlyph({ className, stroke = "var(--color-accent)", strokeWidth = 3 }: InfinityGlyphProps) {
  return (
    <svg viewBox="0 0 200 100" className={className} role="presentation" aria-hidden="true">
      <path d={INFINITY_PATH} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
