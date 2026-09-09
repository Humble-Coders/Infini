import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { MonoLabel } from "@/components/sections/home/MonoLabel";

/*
 * The treatment, drawn as a cross-section.
 *
 * Across the whole category nobody draws this. The parent site, REM, Extrude
 * Hone, OTEC and DLyte all describe a catalytic film forming on the peaks and
 * being wiped away, in prose, next to a stock photograph. It is a four-stage
 * mechanical story and it is trivially drawable, so here it is drawn.
 *
 * Pure SVG generated from one seeded profile, so the four panels show the same
 * surface at four moments rather than four unrelated squiggles. Server
 * rendered, no library, nothing to fail under reduced motion.
 */

const W = 260;
const H = 150;
const SURFACE_Y = 92;
const POINTS = 90;

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One rough profile, reused across all four panels so the story is continuous. */
function buildProfile() {
  const random = mulberry32(20260913);
  const peaks: number[] = [];
  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1);
    const wave = Math.sin(t * 26) * 4 + Math.sin(t * 41 + 1.2) * 2.5;
    peaks.push(wave + (random() - 0.5) * 9);
  }
  return peaks;
}

const PROFILE = buildProfile();
const x = (i: number) => (i / (POINTS - 1)) * W;

/** Solid body under the profile, so the part reads as metal rather than as a line. */
function bodyPath(heights: number[]) {
  let d = `M0 ${H}`;
  heights.forEach((h, i) => {
    d += ` L${x(i).toFixed(1)} ${(SURFACE_Y - h).toFixed(1)}`;
  });
  return d + ` L${W} ${H} Z`;
}

/** The catalytic film: follows the peaks, thicker in the valleys. */
function filmPath(heights: number[]) {
  let d = `M0 ${SURFACE_Y + 8}`;
  heights.forEach((h, i) => {
    d += ` L${x(i).toFixed(1)} ${(SURFACE_Y - h - 3).toFixed(1)}`;
  });
  d += ` L${W} ${SURFACE_Y + 8} Z`;
  return d;
}

/** Peaks truncated above a cut line, which is exactly what the media removes. */
const truncate = (heights: number[], cut: number) => heights.map((h) => Math.min(h, cut));
/** What is left once the peaks are gone: a plateau with the valleys retained. */
const plateau = (heights: number[]) => heights.map((h) => Math.min(h, 0.5) * 0.6);

const STAGES = [
  {
    step: "01",
    title: "As received",
    caption: "Machining leaves peaks and valleys. The peaks carry the load and start the cracks.",
    body: PROFILE,
    film: false,
    removed: null as number | null,
  },
  {
    step: "02",
    title: "Film forms",
    caption: "A catalytic film grows across the surface, softer than the metal beneath it.",
    body: PROFILE,
    film: true,
    removed: null,
  },
  {
    step: "03",
    title: "Peaks wiped",
    caption: "Media contacts only the high points and takes the film with it. Valleys are never touched.",
    body: PROFILE,
    film: true,
    removed: 2,
  },
  {
    step: "04",
    title: "Plateaued",
    caption: "The cycle repeats until the surface is a plateau. Form and dimension are unchanged.",
    body: plateau(PROFILE),
    film: false,
    removed: null,
  },
];

function Panel({ stage }: { stage: (typeof STAGES)[number] }) {
  const heights = stage.removed === null ? stage.body : truncate(stage.body, stage.removed);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-hidden="true" focusable="false">
      {/* Removed material, shown where the peaks used to be. */}
      {stage.removed !== null && (
        <path
          d={bodyPath(stage.body)}
          className="text-accent/25"
          fill="currentColor"
          stroke="none"
        />
      )}
      {stage.film && (
        <path d={filmPath(stage.body)} className="text-accent/35" fill="currentColor" stroke="none" />
      )}
      <path d={bodyPath(heights)} className="text-foreground/10" fill="currentColor" stroke="none" />
      <path
        d={bodyPath(heights).replace(/^M0 150 /, "M0 ").replace(/ L260 150 Z$/, "")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        className="text-foreground"
      />
      {stage.removed !== null && (
        <line
          x1="0"
          y1={SURFACE_Y - stage.removed}
          x2={W}
          y2={SURFACE_Y - stage.removed}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          className="text-accent"
        />
      )}
    </svg>
  );
}

export function TreatmentSchematic({
  heading = "What actually happens to the surface.",
  body = "Four moments in one cycle, drawn on the same profile. The treatment never touches the valleys, which is why the part keeps its dimensions while its roughness comes away.",
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
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-accent/35" />
            Catalytic film
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-sm bg-accent/25" />
            Material removed
          </span>
          <span>Cross-section, vertical scale exaggerated.</span>
        </p>
      </Container>
    </section>
  );
}
