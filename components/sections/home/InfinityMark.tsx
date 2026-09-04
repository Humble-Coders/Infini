/**
 * The brand's infinity loop (from the "Finish Unlimited" logo) as a single
 * stroked lemniscate — a large, faint backdrop element rather than an icon.
 * Path is generated once at module load; pure stroke so it tracks currentColor.
 */
function lemniscatePath(a = 100, steps = 180, cx = 120, cy = 60): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const denominator = 1 + Math.sin(t) ** 2;
    const x = (a * Math.cos(t)) / denominator + cx;
    const y = (a * Math.sin(t) * Math.cos(t)) / denominator + cy;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return `${d}Z`;
}

const PATH = lemniscatePath();

export function InfinityMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 120" className={className} fill="none" aria-hidden="true">
      <path d={PATH} stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
