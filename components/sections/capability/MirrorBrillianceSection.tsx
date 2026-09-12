import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";
import { BrochureSchematicFigure } from "./BrochureSchematicFigure";

interface MirrorBrillianceSectionProps {
  surface?: "dark" | "light";
}

export function MirrorBrillianceSection({ surface = "dark" }: MirrorBrillianceSectionProps) {
  const isDark = surface === "dark";

  return (
    <section
      data-surface={surface}
      className={cn(
        "relative py-12 sm:py-16 overflow-hidden border-t",
        isDark ? "bg-[#0b0c0e] border-white/10" : "bg-muted/15 border-border"
      )}
    >
      <Container>
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Form Integrity & Optical Brilliance</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
              From controlled roughness to <span className="font-serif italic font-normal text-accent">mirror-like brilliance.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              A true mirror finish is not achieved by stripping away stock until irregularities disappear. MMP achieves numerical improvement down to Ra 0.02 µm with minimal material removal, keeping profiles intact and tolerances locked.
            </p>
          </div>
        </Reveal>

        {/* Form Integrity & Material Removal Diagram from Page 3 */}
        <div className="mt-8">
          <Reveal delay={0.06}>
            <BrochureSchematicFigure
              src="/images/brochure/diagrams/form-integrity-removal.png"
              alt="MMP processing numerical improvement of roughness with small material removal and form integrity"
              title="Form Integrity vs. Numerical Roughness Improvement"
              caption="Achieving optical brilliance without rounding sharp functional profiles or causing dimensional drift."
              tag="STOCK REMOVAL PHYSICS"
              surface={surface}
              aspectRatio="aspect-[16/9]"
            />
          </Reveal>
        </div>

        {/* Internal Flow Rules for Mirror Polishing from Page 7 */}
        <div className="mt-10">
          <Reveal delay={0.08}>
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Internal Passage Physics
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Polishing internal channels: <span className="font-serif italic font-normal text-accent">the flow rules.</span>
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                MMP is capable of polishing internal flow passages, bores, and cooling channels to mirror quality, provided hydrodynamic flow can be sustained. Two engineering rules govern whether a passage qualifies:
              </p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Rule 1: Light Test / Line of Sight */}
            <Reveal delay={0.1}>
              <BrochureSchematicFigure
                src="/images/brochure/diagrams/internal-flow-guidelines.png"
                alt="Internal flow path shape OK vs Not OK guidelines and light test"
                title="The Line-of-Sight Light Test"
                caption="Place a light source at the exit. If it is visible from the entrance, MMP treatment is possible. Straight or gently curved channels are OK; tight serpentine bends weaken flow."
                tag="PASSAGE SHAPE RULE"
                surface={surface}
                aspectRatio="aspect-[16/10]"
              />
            </Reveal>

            {/* Rule 2: Passage Depth vs Diameter */}
            <Reveal delay={0.14}>
              <BrochureSchematicFigure
                src="/images/brochure/diagrams/internal-passage-depth-table.png"
                alt="Depth of internal passage guidelines and necessary flow path diameter table"
                title="Diameter vs. Maximum Channel Depth"
                caption="Channel diameter dictates the maximum treatable depth: 2mm diameter up to 10mm depth, 10mm up to 150mm, and 30mm up to 1000mm length."
                tag="ASPECT RATIO LIMITS"
                surface={surface}
                aspectRatio="aspect-[16/10]"
              />
            </Reveal>
          </div>
        </div>

        {/* Engineering Summary Cards */}
        <Reveal delay={0.12}>
          <div
            className={cn(
              "mt-8 rounded-2xl border p-6 sm:p-8 grid gap-6 sm:grid-cols-3",
              isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
            )}
          >
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-accent">0.02 µm</div>
              <div className="mt-1 text-sm font-semibold text-foreground">Achievable Ra</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Mirror brilliance verified by profilometry before batch dispatch.
              </p>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-accent">Zero</div>
              <div className="mt-1 text-sm font-semibold text-foreground">Directional Lay</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Isotropic light reflection without abrasive streak shadows.
              </p>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-semibold text-accent">&ge; 2 mm</div>
              <div className="mt-1 text-sm font-semibold text-foreground">Min Internal Flow Path</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Straight or gently swept channels polished to sealing-grade luster.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
