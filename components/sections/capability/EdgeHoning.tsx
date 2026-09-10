import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { EdgeHoningCopy } from "@/lib/types";

/*
 * Micro edge honing, from INFINI's MMP brochure.
 *
 * The aggregates that take fine irregularities off a face do the same at an
 * edge, rounding it at the wavelength they are sized for. That is a property of
 * the process rather than a side effect to apologise for: choose the aggregate
 * and you choose the radius. Drawn as the same corner twice, at the two sizes
 * the brochure shows, with the aggregate that produced each.
 */

export const FALLBACK_EDGE_HONING: EdgeHoningCopy = {
  eyebrow: "Micro edge honing",
  heading: "Edges round to the size of what comes off, so the radius can be specified.",
  body: "The aggregates that remove fine irregularities from a face do the same at an edge, rounding it at the wavelength they are sized for. Choose the aggregate and you choose the radius.",
  small: {
    title: "Small edge hone",
    caption: "Fine aggregates leave a small, even radius along the whole edge.",
  },
  medium: {
    title: "Medium edge hone",
    caption: "Larger aggregates leave a wider radius, the same on every part in the batch.",
  },
  note: "On cutting tools, a controlled edge radius is the edge preparation behind longer tool life and higher cutting speeds and feeds. If an edge has to stay as sharp as possible, say so, and the treatment is sized for the smallest radius.",
};

const W = 220;
const H = 140;
const CORNER_X = 58;
const CORNER_Y = 58;

/** Offsets for one aggregate's particles, in particle-size units. Fixed, so both panels draw the same cluster. */
const CLUSTER = [
  [0, 0],
  [1.1, -0.6],
  [-1, 0.7],
  [0.4, 1.2],
  [-0.8, -1],
  [1.3, 0.9],
  [-1.4, -0.2],
] as const;

function Corner({ radius, particle }: { radius: number; particle: number }) {
  const top = `${CORNER_X + radius} ${CORNER_Y}`;
  const left = `${CORNER_X} ${CORNER_Y + radius}`;
  const body = `M${CORNER_X} ${H} L${left} A${radius} ${radius} 0 0 1 ${top} L${W} ${CORNER_Y} L${W} ${H} Z`;
  const removed = `M${CORNER_X} ${CORNER_Y} L${top} A${radius} ${radius} 0 0 0 ${left} Z`;
  // The aggregate sits just off the corner, scaled to the radius it produces.
  const centre = CORNER_X - particle * 2.4;
  const spacing = particle * 2.1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden="true" focusable="false">
      <path d={removed} className="text-accent/30" fill="currentColor" />
      <path d={body} className="text-foreground/10" fill="currentColor" />
      <path
        d={`M${CORNER_X} ${H} L${left} A${radius} ${radius} 0 0 1 ${top} L${W} ${CORNER_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className="text-foreground"
      />
      {/* The edge as it was: sharp. */}
      <path
        d={`M${CORNER_X} ${CORNER_Y + radius + 6} L${CORNER_X} ${CORNER_Y} L${CORNER_X + radius + 6} ${CORNER_Y}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
        vectorEffect="non-scaling-stroke"
        className="text-foreground/40"
      />
      <g className="text-accent" fill="currentColor">
        {CLUSTER.map(([dx, dy], index) => {
          const cx = centre + dx * spacing;
          const cy = centre + dy * spacing;
          if (index % 3 === 0) return <circle key={index} cx={cx} cy={cy} r={particle} />;
          if (index % 3 === 1) {
            return (
              <rect
                key={index}
                x={cx - particle}
                y={cy - particle}
                width={particle * 2}
                height={particle * 2}
                transform={`rotate(${index * 23} ${cx} ${cy})`}
              />
            );
          }
          return (
            <polygon
              key={index}
              points={`${cx},${cy - particle * 1.3} ${cx + particle * 1.15},${cy + particle * 0.7} ${cx - particle * 1.15},${cy + particle * 0.7}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function EdgeHoning({
  copy = FALLBACK_EDGE_HONING,
  surface = "light",
}: {
  copy?: EdgeHoningCopy;
  surface?: "light" | "dark";
}) {
  const panels = [
    { ...copy.small, radius: 8, particle: 2 },
    { ...copy.medium, radius: 22, particle: 4.2 },
  ];

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-20 sm:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-5 lg:col-span-5">
          {copy.eyebrow && <MonoLabel>{copy.eyebrow}</MonoLabel>}
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-foreground">
            {copy.heading}
          </h2>
          {copy.body && (
            <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{copy.body}</p>
          )}
          {copy.note && (
            <p className="border-l-2 border-accent pl-4 text-sm leading-relaxed text-pretty text-foreground/80">
              {copy.note}
            </p>
          )}
        </div>

        <ol className="grid gap-px self-start border border-border bg-border sm:grid-cols-2 lg:col-span-7">
          {panels.map((panel, index) => (
            <li key={panel.title} className="flex flex-col gap-4 bg-background p-5 sm:p-6">
              <Reveal delay={index * 0.08} className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-lg border border-border bg-background-elevated">
                  <Corner radius={panel.radius} particle={panel.particle} />
                </div>
                <h3 className="text-base leading-snug font-semibold tracking-[-0.02em] text-foreground">
                  {panel.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{panel.caption}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
