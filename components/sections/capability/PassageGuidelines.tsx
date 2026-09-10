import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/components/ui/utils";
import type { PassageGuidelinesCopy } from "@/lib/types";

/*
 * Internal passages, from the limitations page of INFINI's MMP brochure.
 *
 * Aggregates finish a channel by flowing through it, so three things decide
 * whether a passage can be treated: its shape, its diameter relative to the
 * roughness being removed, and its length. The brochure gives all three as
 * guidelines. Publishing them lets a designer check a part before sending it,
 * and keeps the rest of the site honest about what "reaches internal
 * features" actually means.
 */

export const FALLBACK_PASSAGES: PassageGuidelinesCopy = {
  eyebrow: "Design guidelines",
  heading: "Internal passages: what the aggregates can reach.",
  body: "Aggregates finish a channel by flowing through it, and they have to come out again afterwards. Three checks decide whether a passage can be treated. They are guidelines, and we confirm them on your drawing.",
  shape: {
    title: "Shape",
    ok: "Straight or gently curved. If a light at the exit can be seen from the entrance, the passage can be treated, and the more light you see, the better the result.",
    notOk: "Tight bends and serpentine paths. Every curve weakens the flow, and a passage where aggregates could be left behind cannot be treated.",
  },
  diameters: {
    title: "Minimum diameter",
    body: "Bigger irregularities need bigger aggregates, and bigger aggregates need a wider channel.",
    rows: [
      { irregularity: "Small", source: "Finish cutting, grinding", diameter: "2 mm" },
      { irregularity: "Medium", source: "Conventional cutting, wire EDM, fine AM", diameter: "5 mm" },
      { irregularity: "Large", source: "Die-sinking EDM, AM", diameter: "10 mm" },
      { irregularity: "Extra large", source: "Rough AM, electron-beam AM", diameter: "20 mm" },
    ],
  },
  lengths: {
    title: "Maximum length",
    body: "The longer the channel, the weaker the flow through it. As a guide:",
    rows: [
      { diameterMm: 2, lengthMm: 10 },
      { diameterMm: 10, lengthMm: 150 },
      { diameterMm: 30, lengthMm: 1000 },
    ],
  },
};

/** A passage cut through a block, drawn as a gap in the metal. */
function ChannelFigure({ variant }: { variant: "ok" | "notOk" }) {
  return (
    <svg viewBox="0 0 120 96" className="h-auto w-full" role="img" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="120" height="96" className="text-foreground/15" fill="currentColor" />
      {variant === "ok" ? (
        <>
          <path
            d="M34 -2 L34 44 Q34 70 62 70 L122 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-background"
          />
          {/* The light test: a lamp at the exit, visible from the entrance. */}
          <circle cx="110" cy="70" r="4.5" className="text-accent" fill="currentColor" />
          <g className="text-accent" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <line x1="110" y1="60" x2="110" y2="56" />
            <line x1="102" y1="63" x2="99" y2="60" />
            <line x1="102" y1="77" x2="99" y2="80" />
            <line x1="110" y1="80" x2="110" y2="84" />
          </g>
        </>
      ) : (
        <>
          <path
            d="M34 -2 L34 18 Q34 32 54 32 Q74 32 74 46 Q74 60 54 60 Q34 60 34 74 L34 98"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-background"
          />
          {/* Aggregates left behind at a bend. */}
          <g className="text-accent" fill="currentColor">
            <circle cx="52" cy="58" r="2" />
            <circle cx="57" cy="61" r="1.6" />
            <rect x="47" y="60" width="3" height="3" />
          </g>
        </>
      )}
    </svg>
  );
}

function Cell({ title, body, children }: { title: string; body?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-5 bg-background p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg leading-snug font-semibold tracking-[-0.02em] text-foreground">{title}</h3>
        {body && <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>}
      </div>
      {children}
    </div>
  );
}

export function PassageGuidelines({
  copy = FALLBACK_PASSAGES,
  surface = "light",
}: {
  copy?: PassageGuidelinesCopy;
  surface?: "light" | "dark";
}) {
  const longest = Math.max(...copy.lengths.rows.map((row) => row.lengthMm));

  return (
    <section
      id="passage-guidelines"
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="scroll-mt-24 bg-background py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-5">
          {copy.eyebrow && <Eyebrow>{copy.eyebrow}</Eyebrow>}
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance text-foreground">
            {copy.heading}
          </h2>
          {copy.body && (
            <p className="text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{copy.body}</p>
          )}
        </div>

        <div className="grid gap-px border border-border bg-border lg:grid-cols-3">
          <Cell title={copy.shape.title}>
            <div className="flex flex-col gap-5">
              {(["ok", "notOk"] as const).map((variant) => (
                <div key={variant} className="grid grid-cols-[5.5rem_1fr] items-start gap-4">
                  <div className="overflow-hidden rounded-md border border-border">
                    <ChannelFigure variant={variant} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p
                      className={cn(
                        "flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.18em] uppercase",
                        variant === "ok" ? "text-foreground" : "text-accent"
                      )}
                    >
                      {variant === "ok" ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        <X className="size-3.5" aria-hidden="true" />
                      )}
                      {variant === "ok" ? "Treatable" : "Not treatable"}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {variant === "ok" ? copy.shape.ok : copy.shape.notOk}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Cell>

          <Cell title={copy.diameters.title} body={copy.diameters.body}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-border py-2 pr-3 font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                    >
                      Irregularity
                    </th>
                    <th
                      scope="col"
                      className="border-b border-border py-2 pr-3 font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                    >
                      Typical source
                    </th>
                    <th
                      scope="col"
                      className="border-b border-border py-2 text-right font-mono text-[10px] font-normal tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase"
                    >
                      Min. Ø
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {copy.diameters.rows.map((row) => (
                    <tr key={row.irregularity} className="border-b border-border last:border-b-0">
                      <th scope="row" className="py-3 pr-3 align-top text-sm font-medium text-foreground">
                        {row.irregularity}
                      </th>
                      <td className="py-3 pr-3 align-top text-xs leading-snug text-muted-foreground">{row.source}</td>
                      <td className="py-3 text-right align-top font-mono text-sm whitespace-nowrap text-foreground tabular-nums">
                        {row.diameter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Cell>

          <Cell title={copy.lengths.title} body={copy.lengths.body}>
            <ul className="flex flex-col gap-5">
              {copy.lengths.rows.map((row) => (
                <li key={row.diameterMm} className="flex flex-col gap-2">
                  <p className="flex items-baseline justify-between gap-4 font-mono text-xs tabular-nums">
                    <span className="text-muted-foreground">Ø {row.diameterMm} mm</span>
                    <span className="text-foreground">up to {row.lengthMm} mm long</span>
                  </p>
                  <div aria-hidden="true" className="h-2 w-full bg-foreground/10">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${((Math.log10(row.lengthMm) / Math.log10(longest)) * 100).toFixed(1)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              Bar length on a log scale
            </p>
          </Cell>
        </div>
      </Container>
    </section>
  );
}
