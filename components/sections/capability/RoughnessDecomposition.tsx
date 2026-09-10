import { Container } from "@/components/ui/container";
import { MonoLabel } from "@/components/sections/home/MonoLabel";

/*
 * The mechanism, drawn.
 *
 * MMP's claim is that it removes roughness selectively, wavelength band by
 * wavelength band, while leaving the part's form untouched. That is a spectral
 * idea, and across the whole category nobody draws it: the parent site, REM,
 * Extrude Hone, OTEC and DLyte all explain it in prose beside a stock photo.
 *
 * So this figure decomposes one measured trace the way a metrology primer
 * would: the primary profile as measured, then the three components it is made
 * of, then the result. Form survives. Waviness and roughness do not.
 *
 * Server-rendered static SVG from a seeded generator, so the geometry is
 * identical on every render and there is no hydration mismatch, no animation
 * to fail under reduced motion, and no library. Line art, not photography.
 */

const WIDTH = 560;
const HEIGHT = 96;
const POINTS = 240;
const MID = HEIGHT / 2;

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The three components a surface texture decomposes into, per ISO 4287. */
function buildComponents() {
  const random = mulberry32(20260909);
  const form: number[] = [];
  const waviness: number[] = [];
  const roughness: number[] = [];

  for (let i = 0; i < POINTS; i++) {
    const t = i / (POINTS - 1);
    form.push(Math.sin(t * Math.PI * 1.8 + 0.5) * 15);
    waviness.push(Math.sin(t * 34 + 1.1) * 8 + Math.sin(t * 19 + 2.4) * 4);
    roughness.push((random() - 0.5) * 22);
  }
  return { form, waviness, roughness };
}

const { form, waviness, roughness } = buildComponents();

function toPath(values: number[], amplitudeScale = 1) {
  let d = "";
  for (let i = 0; i < values.length; i++) {
    const x = (i / (values.length - 1)) * WIDTH;
    const y = MID + values[i] * amplitudeScale;
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const sum = (...arrays: number[][]) =>
  arrays[0].map((_, i) => arrays.reduce((total, array) => total + array[i], 0));

const TRACES = [
  {
    id: "primary",
    step: "01",
    title: "Primary profile, as measured",
    caption: "The raw trace off the stylus. Form, waviness and roughness are all present and indistinguishable to the eye.",
    values: sum(form, waviness, roughness),
    kept: true,
  },
  {
    id: "form",
    step: "02",
    title: "Form",
    caption: "The component's intended geometry. MMP does not touch this, which is why treated parts hold their tolerances.",
    values: form,
    kept: true,
  },
  {
    id: "waviness",
    step: "03",
    title: "Waviness",
    caption: "Longer-wavelength undulation left by the machine tool. Removed by a coarser aggregate.",
    values: waviness,
    kept: false,
  },
  {
    id: "roughness",
    step: "04",
    title: "Roughness",
    caption: "The short-wavelength peaks that carry stress risers and hold contaminant. Removed first, by a fine aggregate.",
    values: roughness,
    kept: false,
  },
  {
    id: "result",
    step: "05",
    title: "After MMP treatment",
    caption: "Form preserved, the other two bands filtered out. Same geometry, a surface that performs.",
    values: form,
    kept: true,
  },
] as const;

function Trace({ values, kept }: { values: readonly number[]; kept: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-20 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="0" y1={MID} x2={WIDTH} y2={MID} stroke="currentColor" strokeWidth="1" className="text-border" />
      <path
        d={toPath([...values])}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={kept ? "text-foreground" : "text-accent"}
      />
    </svg>
  );
}

/**
 * @param heading  Section heading, admin-editable upstream.
 * @param body     Lead paragraph explaining the decomposition.
 */
export function RoughnessDecomposition({
  heading,
  body,
  surface = "light",
}: {
  heading: string;
  body: string;
  surface?: "light" | "dark";
}) {
  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background pt-12 pb-20 sm:pt-16 sm:pb-28"
    >
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-5">
          <MonoLabel>How MMP works</MonoLabel>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance text-foreground">
            {heading}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{body}</p>
        </div>

        <ol className="flex flex-col border-t border-border">
          {TRACES.map((trace) => (
            <li
              key={trace.id}
              className="grid items-center gap-x-8 gap-y-4 border-b border-border py-7 lg:grid-cols-12"
            >
              <div className="flex flex-col gap-2 lg:col-span-4">
                <span className="font-mono text-[11px] tracking-[0.2em] text-accent tabular-nums">{trace.step}</span>
                <h3 className="text-lg leading-[1.2] font-semibold tracking-[-0.02em] text-foreground">
                  {trace.title}
                </h3>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{trace.caption}</p>
              </div>
              <div className="lg:col-span-8">
                <Trace values={trace.values} kept={trace.kept} />
              </div>
            </li>
          ))}
        </ol>

        <p className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-6 bg-foreground" />
            Preserved by MMP
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
            Filtered out
          </span>
          <span className="text-muted-foreground/70">Components per ISO 4287. Trace illustrative.</span>
        </p>
      </Container>
    </section>
  );
}
