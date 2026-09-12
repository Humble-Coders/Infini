import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";
import { BrochureSchematicFigure } from "./BrochureSchematicFigure";

interface ValidationProcessVisualProps {
  surface?: "dark" | "light";
}

export function ValidationProcessVisual({ surface = "dark" }: ValidationProcessVisualProps) {
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
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Validation Protocol</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
              Steps to mass production: <span className="font-serif italic font-normal text-accent">from trial to series release.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              By conducting technical verification and mass production verification in advance, MMP processing operates under locked, reproducible conditions. Nothing runs on assumption.
            </p>
          </div>
        </Reveal>

        {/* Large Visual Diagram of Mass Production Progression */}
        <Reveal delay={0.06}>
          <div className="mt-8">
            <BrochureSchematicFigure
              src="/images/brochure/diagrams/steps-to-mass-production.png"
              alt="Steps to mass production for MMP Technology: Technical verification, Mass production verification, Mass production"
              title="Official 3-Stage Qualification Sequence"
              caption="From single-fixture test trials up to full-tank serial production batches under ISO 9001 certified controls."
              tag="SWISS QUALIFICATION STANDARD"
              surface={surface}
              aspectRatio="aspect-[16/9]"
            />
          </div>
        </Reveal>

        {/* 3 Qualification Stages Detailed Grid */}
        <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {/* Stage 1 */}
          <Reveal delay={0.08}>
            <div
              className={cn(
                "flex flex-col h-full rounded-2xl border p-6 sm:p-7",
                isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
              )}
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <span className="font-mono text-sm font-semibold text-accent">STAGE 01</span>
                <MonoLabel className="text-[11px]">FEASIBILITY</MonoLabel>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                Technical Verification
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-grow">
                Process a few test pieces across several calibrated MMP conditions. Metrology evaluates whether MMP is effective for the target substrate and determines the recipe needed to reach your drawing specification.
              </p>
              <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">Input required:</span> 2–5 sample parts, 2D/3D drawings, target Ra/Rz.
              </div>
            </div>
          </Reveal>

          {/* Stage 2 */}
          <Reveal delay={0.12}>
            <div
              className={cn(
                "flex flex-col h-full rounded-2xl border p-6 sm:p-7",
                isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
              )}
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <span className="font-mono text-sm font-semibold text-accent">STAGE 02</span>
                <MonoLabel className="text-[11px]">FIXTURING & TUNING</MonoLabel>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                Mass Production Verification
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-grow">
                Test multiple parts (unusable or scrap parts are welcomed at this stage). INFINI engineers design and machine a dedicated mass production jig, fine-tuning agitation time and media ratios for repeatability.
              </p>
              <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">Input required:</span> Representative batch (scrap OK) + inspection criteria.
              </div>
            </div>
          </Reveal>

          {/* Stage 3 */}
          <Reveal delay={0.16}>
            <div
              className={cn(
                "flex flex-col h-full rounded-2xl border p-6 sm:p-7",
                isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
              )}
            >
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <span className="font-mono text-sm font-semibold text-accent">STAGE 03</span>
                <MonoLabel className="text-[11px]">SERIAL RUNS</MonoLabel>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                Stable Mass Production
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-grow">
                Process production quantities that fill the MMP tank. All treatment runs strictly under fixed, frozen parameters. 100% of batches receive surface roughness verification and a Certificate of Conformity.
              </p>
              <div className="mt-6 pt-4 border-t border-border/40 text-xs font-mono text-muted-foreground">
                <span className="text-foreground font-semibold">Input required:</span> Production batches + release schedule.
              </div>
            </div>
          </Reveal>
        </div>

        {/* Operational Ground Rules from Page 3 */}
        <Reveal delay={0.12}>
          <div
            className={cn(
              "mt-8 rounded-2xl border p-6 sm:p-8 grid gap-6 md:grid-cols-2",
              isDark ? "bg-[#121418] border-white/10" : "bg-white border-border"
            )}
          >
            <div>
              <MonoLabel className="text-xs text-accent">DEDICATED TOOLING</MonoLabel>
              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Custom Fixture Engineering
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Each component requires a custom-designed fixture to ensure rigid grip and protect critical non-treatment interfaces while allowing microtools to flow freely over target surfaces.
              </p>
            </div>
            <div>
              <MonoLabel className="text-xs text-accent">SERVICE-ONLY PARTNERSHIP</MonoLabel>
              <h4 className="mt-2 text-lg font-semibold text-foreground">
                Zero Machine Sales — Specialized Treatment Service
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We offer MMP strictly as an end-to-end surface engineering service. Machines and proprietary chemical consumables are operated exclusively in our certified facilities.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
