import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";
import { BrochureSchematicFigure } from "./BrochureSchematicFigure";

interface MicroEdgeHoningSectionProps {
  surface?: "dark" | "light";
}

export function MicroEdgeHoningSection({ surface = "light" }: MicroEdgeHoningSectionProps) {
  const isDark = surface === "dark";

  return (
    <section
      data-surface={surface}
      className={cn(
        "relative py-12 sm:py-16 overflow-hidden border-t",
        isDark ? "bg-[#090a0c] border-white/10" : "bg-background border-border"
      )}
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Controlled Edge Rounding</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
              Micro edge honing: <span className="font-serif italic font-normal text-accent">rounding at the wavelength.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              When MMP aggregates remove high-frequency irregularities from a surface, the exact same phenomenon occurs at the edges. The edge radius is controlled mathematically by the aggregate wavelength.
            </p>
          </div>
        </Reveal>

        {/* Brochure Edge Honing Diagram */}
        <div className="mt-8">
          <Reveal delay={0.06}>
            <BrochureSchematicFigure
              src="/images/brochure/diagrams/micro-edge-honing.png"
              alt="Micro edge honing by MMP Technology showing small and medium edge honing with cutting tool micro-photography"
              title="Official Micro Edge Honing Specification"
              caption="Small edge honing versus medium edge honing with microscopic before-and-after imagery of precision tool edges."
              tag="EDGE PREPARATION METROLOGY"
              surface={surface}
              aspectRatio="aspect-[16/9]"
            />
          </Reveal>
        </div>

        {/* Advantages & Limitations Matrix from Page 3 */}
        <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Advantages */}
          <Reveal delay={0.08}>
            <div
              className={cn(
                "rounded-2xl border p-6 sm:p-8 h-full flex flex-col justify-between",
                isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <MonoLabel className="text-xs text-emerald-500">PROVEN ADVANTAGES</MonoLabel>
                </div>
                <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-foreground">
                  Why MMP Replaces Conventional Finishing
                </h3>
                <ul className="mt-6 grid gap-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-accent font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Uniform Batch Quality:</strong> Automatically finishes large batches with identical, reproducible quality.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-accent font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Form Integrity:</strong> Complex shapes are finished perfectly while maintaining tight profile tolerances.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-accent font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Substrate Agnostic:</strong> Effective across hardened steels, titanium, nickel superalloys, carbides, and ceramics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-accent font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Zero Metallurgical Change:</strong> No heat-affected zone, no alteration of base material composition or bulk hardness.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-accent font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Total Cost Reduction:</strong> Drastically reduces manual benchwork, scrap rates, and post-coating failures.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Boundaries & Limitations */}
          <Reveal delay={0.12}>
            <div
              className={cn(
                "rounded-2xl border p-6 sm:p-8 h-full flex flex-col justify-between",
                isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
              )}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <MonoLabel className="text-xs text-amber-500">OPERATING BOUNDARIES</MonoLabel>
                </div>
                <h3 className="mt-3 text-xl sm:text-2xl font-semibold text-foreground">
                  Where Conventional Deburring Must Precede MMP
                </h3>
                <ul className="mt-6 grid gap-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-amber-500 font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Deep Scratches &amp; Gouges:</strong> Macro form defects cannot be eliminated without removing substantial stock; pre-machine parts to drawing specs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-amber-500 font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Complex Internal Labyrinths:</strong> Internal channels with sharp serpentine turns cannot sustain hydrodynamic microtool flow.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-amber-500 font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Custom Fixtures Mandatory:</strong> Every part profile requires custom clamping fixtures for treatment.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-mono text-amber-500 font-semibold mt-0.5">•</span>
                    <span><strong className="text-foreground">Service Exclusivity:</strong> Machines and consumables are not sold; all processing is executed in INFINI facilities.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
