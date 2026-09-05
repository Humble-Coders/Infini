import type { CSSProperties } from "react";

/**
 * The brand's infinity loop (from the "Finish Unlimited" logo) as a large,
 * faint backdrop figure, with a red tracer running the loop: a glowing dot
 * travels the lemniscate, and the whole figure flares as it completes a lap.
 *
 * All motion is CSS driven off `stroke-dashoffset` (see globals.css), so there
 * is no JS and no hydration boundary. The animation needs the path's own
 * length, which is measured here at module load and handed to CSS as
 * `--infinity-length` so the dash maths stays in sync with the geometry.
 */
function lemniscate(a = 100, steps = 180, cx = 120, cy = 60) {
  const points: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const denominator = 1 + Math.sin(t) ** 2;
    points.push([(a * Math.cos(t)) / denominator + cx, (a * Math.sin(t) * Math.cos(t)) / denominator + cy]);
  }

  let d = "";
  let length = 0;
  points.forEach(([x, y], index) => {
    d += `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    if (index > 0) {
      const [px, py] = points[index - 1];
      length += Math.hypot(x - px, y - py);
    }
  });

  return { d: `${d}Z`, length };
}

const { d: PATH, length: LENGTH } = lemniscate();

export function InfinityMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ "--infinity-length": LENGTH.toFixed(1) } as CSSProperties}
    >
      <defs>
        <filter id="infinity-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
      </defs>

      {/* The figure itself: always visible, deliberately quiet. */}
      <path d={PATH} stroke="currentColor" strokeWidth="1.25" strokeOpacity="0.11" />

      {/* Flares as the tracer closes a lap. */}
      <path className="infinity-shine" d={PATH} stroke="var(--color-accent)" strokeWidth="1.5" />

      {/* Blurred halo behind the travelling dot, then the dot itself. */}
      <path
        className="infinity-halo"
        d={PATH}
        stroke="var(--color-accent)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#infinity-glow)"
      />
      <path className="infinity-dot" d={PATH} stroke="var(--color-accent)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
