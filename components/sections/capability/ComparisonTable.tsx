import { Container } from "@/components/ui/container";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import type { ComparisonCopy } from "@/lib/types";

/**
 * MMP set against a named alternative process, criterion by criterion, as a
 * hairline table.
 *
 * The same data is drawn as facing columns by SplitComparison on
 * /deburring-polishing. Two shapes for one data type is deliberate: on the
 * mechanism page the comparison is a supporting exhibit and reads best as a
 * compact table, while on the page where choosing between the two processes is
 * the whole point it needs the room a split gives it.
 *
 * Naming the alternative is what makes either version work. A claim made in a
 * vacuum carries nothing; the same claim positioned against the process the
 * reader buys today is the strongest argument on the page.
 */
export function ComparisonTable({ copy, surface = "light" }: { copy: ComparisonCopy; surface?: "light" | "dark" }) {
  if (copy.rows.length === 0) return null;

  return (
    <section
      {...(surface === "light" ? { "data-surface": "light" } : {})}
      className="bg-background py-20 sm:py-28"
    >
      <Container className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-5">
          {copy.eyebrow && <MonoLabel>{copy.eyebrow}</MonoLabel>}
          <h2 className="text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance text-foreground">
            {copy.heading}
          </h2>
          {copy.body && <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.body}</p>}
        </div>

        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-1/3 border-b border-border px-5 py-4 font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                >
                  Criterion
                </th>
                <th
                  scope="col"
                  className="w-1/3 border-b-2 border-b-accent px-5 py-4 font-mono text-[10px] font-medium tracking-[0.18em] text-accent uppercase"
                >
                  MMP treatment
                </th>
                <th
                  scope="col"
                  className="w-1/3 border-b border-border px-5 py-4 font-mono text-[10px] font-normal tracking-[0.18em] text-muted-foreground uppercase"
                >
                  {copy.alternativeLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {copy.rows.map((row) => (
                <tr key={row.criterion} className="border-b border-border last:border-b-0">
                  <th scope="row" className="px-5 py-4 text-sm font-medium text-foreground">
                    {row.criterion}
                  </th>
                  <td className="px-5 py-4 text-sm leading-relaxed text-foreground">{row.mmp}</td>
                  <td className="px-5 py-4 text-sm leading-relaxed text-muted-foreground">{row.alternative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
