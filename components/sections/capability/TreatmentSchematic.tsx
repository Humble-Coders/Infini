import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";

/*
 * The treatment, drawn as a cross-section.
 *
 * The mechanism is the one in INFINI's own MMP brochure (INF_V2-09/2025).
 * Microtools and a catalyst bond into aggregates. The device keeps those
 * aggregates moving over the part, their surface grips the part's
 * irregularities the way Velcro grips, and the flow shears off irregularities
 * of the wavelength the aggregate is sized for. The long wavelengths, which
 * are the part's form, are left alone.
 *
 * Pure SVG generated from one seeded profile, so the four panels show the same
 * surface at four moments rather than four unrelated squiggles. Server
 * rendered, no library, nothing to fail under reduced motion.
 */

const W = 260;
const H = 150;
const SURFACE_Y = 100;
const POINTS = 90;

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The part's form and its roughness, built separately so the filter can take one and keep the other. */
function buildProfile() {
  const random = mulberry32(20260913);
  const form: number[] = [];
  const profile: number[] = [];
  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1);
    const shape = Math.sin(t * Math.PI * 1.3 + 0.3) * 6;
    const roughness = Math.sin(t * 41 + 1.2) * 2.5 + (random() - 0.5) * 9;
    form.push(shape);
    profile.push(shape + roughness);
  }
  return { form, profile };
}

const { form: FORM, profile: PROFILE } = buildProfile();

/*
 * The finished surface: the form, lowered just far enough to sit under the
 * deepest valley. Material only ever comes off, so the result has to lie at or
 * below the original everywhere. The offset is the small, controlled layer the
 * brochure says MMP removes.
 */
const DEPTH = Math.max(...FORM.map((shape, i) => shape - PROFILE[i]));
const FINISHED = FORM.map((shape) => shape - DEPTH);

const px = (i: number) => (i / (POINTS - 1)) * W;
const py = (height: number) => SURFACE_Y - height;

/** Solid body under a profile, so the part reads as metal rather than as a line. */
function bodyPath(heights: number[]) {
  let d = `M0 ${H}`;
  heights.forEach((h, i) => {
    d += ` L${px(i).toFixed(1)} ${py(h).toFixed(1)}`;
  });
  return `${d} L${W} ${H} Z`;
}

function linePath(heights: number[]) {
  return heights.map((h, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)} ${py(h).toFixed(1)}`).join(" ");
}

/** The band between the surface as received and the finished one: the material that came off. */
function removedPath(top: number[], bottom: number[]) {
  const back = bottom
    .map((h, i) => `L${px(i).toFixed(1)} ${py(h).toFixed(1)}`)
    .reverse()
    .join(" ");
  return `${linePath(top)} ${back} Z`;
}

interface Particle {
  shape: 0 | 1 | 2;
  cx: number;
  cy: number;
  size: number;
  turn: number;
}

/** One microtool aggregate: a tight cluster of mixed particles, bonded by the catalyst. */
function buildAggregate(cx: number, cy: number, seed: number): Particle[] {
  const random = mulberry32(seed);
  return Array.from({ length: 7 }, () => ({
    shape: Math.floor(random() * 3) as 0 | 1 | 2,
    cx: cx + (random() - 0.5) * 11,
    cy: cy + (random() - 0.5) * 8,
    size: 1.7 + random() * 1.1,
    turn: random() * Math.PI,
  }));
}

const CENTRES = [30, 95, 165, 232];
const indexAt = (x: number) => Math.min(POINTS - 1, Math.max(0, Math.round((x / W) * (POINTS - 1))));
/** Aggregates as they form, suspended above the part. */
const SUSPENDED = CENTRES.map((cx, index) => buildAggregate(cx, 36 + (index % 2) * 12, 101 + index));
/** The same aggregates in the flow, meshed with the surface they are cutting. */
const IN_CONTACT = CENTRES.map((cx, index) => buildAggregate(cx + 6, py(PROFILE[indexAt(cx + 6)]) - 8, 101 + index));

function ParticleMark({ particle }: { particle: Particle }) {
  const { shape, cx, cy, size, turn } = particle;
  if (shape === 0) return <circle cx={cx} cy={cy} r={size} />;
  if (shape === 1) {
    return (
      <rect
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        transform={`rotate(${((turn * 180) / Math.PI).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})`}
      />
    );
  }
  const points = [0, 1, 2]
    .map((k) => {
      const angle = turn + (k * 2 * Math.PI) / 3;
      return `${(cx + Math.cos(angle) * size * 1.3).toFixed(1)},${(cy + Math.sin(angle) * size * 1.3).toFixed(1)}`;
    })
    .join(" ");
  return <polygon points={points} />;
}

/** Direction of the aggregate flow the device drives. */
function FlowArrows() {
  return (
    <g className="text-accent" fill="currentColor" stroke="currentColor" strokeWidth="1">
      {[18, 100, 182].map((x0) => (
        <g key={x0}>
          <line x1={x0} y1="16" x2={x0 + 52} y2="16" />
          <path d={`M${x0 + 56} 16 l-6 -3.5 v7 z`} stroke="none" />
        </g>
      ))}
    </g>
  );
}

interface Stage {
  step: string;
  title: string;
  caption: string;
  surface: number[];
  aggregates: Particle[][] | null;
  removed: boolean;
  flow: boolean;
  /** Show the surface as received as a dashed line, for comparison with the finish. */
  ghost: boolean;
}

const STAGES: Stage[] = [
  {
    step: "01",
    title: "As received",
    caption: "Machining leaves irregularities at several wavelengths at once, laid over the part's form.",
    surface: PROFILE,
    aggregates: null,
    removed: false,
    flow: false,
    ghost: false,
  },
  {
    step: "02",
    title: "Aggregates form",
    caption: "Microtools and a catalyst bond into aggregates, each sized to the irregularity it is meant to remove.",
    surface: PROFILE,
    aggregates: SUSPENDED,
    removed: false,
    flow: false,
    ghost: false,
  },
  {
    step: "03",
    title: "Irregularities sheared",
    caption:
      "The device keeps the aggregates moving. They grip the surface like Velcro and shear off irregularities of the matching wavelength.",
    surface: FINISHED,
    aggregates: IN_CONTACT,
    removed: true,
    flow: true,
    ghost: false,
  },
  {
    step: "04",
    title: "Isotropic finish",
    caption: "Random motion leaves no streaks or lay. A small, controlled layer comes off, and the form stays.",
    surface: FINISHED,
    aggregates: null,
    removed: false,
    flow: false,
    ghost: true,
  },
];

function Panel({ stage }: { stage: Stage }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden="true" focusable="false">
      {stage.removed && (
        <path d={removedPath(PROFILE, FINISHED)} className="text-accent/25" fill="currentColor" stroke="none" />
      )}
      <path d={bodyPath(stage.surface)} className="text-foreground/10" fill="currentColor" stroke="none" />
      <path
        d={linePath(stage.surface)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className="text-foreground"
      />
      {stage.ghost && (
        <path
          d={linePath(PROFILE)}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 3"
          vectorEffect="non-scaling-stroke"
          className="text-foreground/40"
        />
      )}
      {stage.flow && <FlowArrows />}
      {stage.aggregates && (
        <g className="text-accent" fill="currentColor">
          {stage.aggregates.flat().map((particle, index) => (
            <ParticleMark key={index} particle={particle} />
          ))}
        </g>
      )}
    </svg>
  );
}

export function TreatmentSchematic({
  heading = "What actually happens to the surface.",
  body = "The part is fixtured in the tank, the tank is charged with microtools, and a catalyst bonds them into aggregates. Then the device runs. Four moments in that cycle, drawn on the same profile.",
  surface = "light",
}: {
  heading?: string;
  body?: string;
  surface?: "light" | "dark";
}) {
  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-24 sm:py-28"
    >
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-5">
          <MonoLabel>The mechanism</MonoLabel>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance text-foreground">
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{body}</p>
        </div>

        <ol className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, index) => (
            <li key={stage.step} className="flex flex-col gap-4 bg-background p-5 sm:p-6">
              <Reveal delay={index * 0.08} className="flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent tabular-nums">{stage.step}</span>
                <div className="overflow-hidden rounded-lg border border-border bg-background-elevated">
                  <Panel stage={stage} />
                </div>
                <h3 className="text-base leading-snug font-semibold tracking-[-0.02em] text-foreground">
                  {stage.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{stage.caption}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <p className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />
            Microtool aggregate
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-accent/25" />
            Material removed
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="w-5 border-t border-dashed border-foreground/40" />
            Surface as received
          </span>
          <span>Cross-section, vertical scale exaggerated.</span>
        </p>
      </Container>
    </section>
  );
}
