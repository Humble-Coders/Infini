import { Container } from "@/components/ui/container";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { SpecTableCopy } from "@/lib/types";

/**
 * Capability figures as a hairline spec table, with the unit in its own
 * column. Every serious site in this category publishes its numbers this way
 * and the weak ones bury them in prose; the table is the page's evidence, so
 * it is styled as an instrument readout rather than as a card.
 *
 * Scrolls inside its own container: a spec table is the one block that will
 * outgrow a phone, and the page body must never scroll sideways.
 */
export function SpecTable({ copy, surface = "light" }: { copy: SpecTableCopy; surface?: "light" | "dark" }) {
  if (copy.rows.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-5">
          <MonoLabel>Capability</MonoLabel>
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance text-foreground">
            {copy.heading}
          </h2>
          {copy.intro && <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.intro}</p>}
        </div>

        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            {copy.caption && (
              <caption className="border-b border-border bg-background-elevated px-5 py-3 text-left font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                {copy.caption}
              </caption>
            )}
            <thead>
              <tr>
                <th
                  scope="col"
                  className="border-b border-border px-5 py-3 font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                >
                  Parameter
                </th>
                <th
                  scope="col"
                  className="border-b border-border px-5 py-3 font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                >
                  Unit
                </th>
                <th
                  scope="col"
                  className="border-b border-border px-5 py-3 text-right font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                >
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((row) => (
                <tr key={row.parameter} className="border-b border-border last:border-b-0">
                  <th scope="row" className="px-5 py-4 text-sm font-medium text-foreground">
                    {row.parameter}
                    {row.note && (
                      <span className="mt-1 block font-sans text-xs font-normal text-muted-foreground">{row.note}</span>
                    )}
                  </th>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{row.unit}</td>
                  <td className="px-5 py-4 text-right font-mono text-sm tabular-nums text-foreground">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
