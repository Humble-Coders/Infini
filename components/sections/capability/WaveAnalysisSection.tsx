import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";
import { BrochureSchematicFigure } from "./BrochureSchematicFigure";

interface WaveAnalysisSectionProps {
  surface?: "dark" | "light";
}

export function WaveAnalysisSection({ surface = "light" }: WaveAnalysisSectionProps) {
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
        {/* Section Header */}
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Wave Filtering Theory</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
              Surface roughness is a waveform: <span className="font-serif italic font-normal text-accent">filtering by wavelength.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Every industrial manufacturing method—milling, turning, EDM, casting, or 3D printing—leaves an overlay of different frequencies on the part surface. MMP acts as a wave filter, targeting and removing each frequency band without altering overall part geometry.
            </p>
          </div>
        </Reveal>

        {/* 2-Column Core Theory: Wave Superposition & Ball End Mill Overlay */}
        <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {/* Superposition Diagram */}
          <Reveal delay={0.05}>
            <BrochureSchematicFigure
              src="/images/brochure/diagrams/wave-superposition.png"
              alt="Wave analysis and surface roughness level superposition diagram"
              title="Superposition of Frequencies (Wavelengths)"
              caption="The total measured roughness is the superposition of high-frequency micro-roughness, medium waviness from machine tool vibration, and long-wavelength part form."
              tag="THEORY OF WAVE ANALYSIS"
              surface={surface}
              aspectRatio="aspect-[16/10]"
            />
          </Reveal>

          {/* Ball End Mill Overlay */}
          <Reveal delay={0.1}>
            <BrochureSchematicFigure
              src="/images/brochure/diagrams/ball-end-mill-overlay.png"
              alt="Ball end mill processing unevenness and waveform overlay"
              title="Milling Unevenness & Waveform Overlay"
              caption="Microscopic analysis of ball end mill cusps and feed-rate marks overlaid with their constituent harmonic frequencies."
              tag="EMPIRICAL METROLOGY"
              surface={surface}
              aspectRatio="aspect-[16/10]"
            />
          </Reveal>
        </div>

        {/* Mechanism Deep Dive: Velcro Analogy & Shear Flow */}
        <div className="mt-10">
          <Reveal delay={0.05}>
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-accent">
                Micro-Mechanical Mechanism
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Shear fracture mechanism: <span className="font-serif italic font-normal text-accent">the Velcro principle.</span>
              </h3>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                How does MMP remove microscopic peaks without abrading the valleys? The microtool aggregate surface conforms to the peaks like Velcro. In lateral fluid motion, a shear force is applied—fracturing peaks cleanly off at their root.
              </p>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Velcro Analogy */}
            <Reveal delay={0.08}>
              <BrochureSchematicFigure
                src="/images/brochure/diagrams/velcro-analogy.png"
                alt="Microtool aggregates fit surface contours like Velcro"
                title="Velcro Surface Mating"
                caption="Aggregates and surface asperities interlock seamlessly, concentrating shearing stress exclusively on high-frequency peaks."
                tag="VELCRO MECHANISM"
                surface={surface}
                aspectRatio="aspect-[4/3]"
              />
            </Reveal>

            {/* Shear Flow */}
            <Reveal delay={0.12}>
              <BrochureSchematicFigure
                src="/images/brochure/diagrams/shear-flow-mechanism.png"
                alt="Microtool aggregate flow removing unevenness through shear fracture"
                title="Lateral Shear Flow"
                caption="Device agitation pulls aggregates across the surface in the shear direction, cleaving peaks without digging into valleys."
                tag="SHEAR FRACTURE"
                surface={surface}
                aspectRatio="aspect-[4/3]"
              />
            </Reveal>

            {/* Targeted Aggregate Sizing */}
            <Reveal delay={0.16}>
              <BrochureSchematicFigure
                src="/images/brochure/diagrams/microtool-aggregates-filtering.png"
                alt="Selective wave filtering with Micro Tool 1 + Catalyst A vs Micro Tool 2 + Catalyst B"
                title="Targeted Aggregate Chemistry"
                caption="Micro Tool 1 + Catalyst A targets fine microscopic asperities; Micro Tool 2 + Catalyst B targets medium waviness."
                tag="WAVELENGTH TUNING"
                surface={surface}
                aspectRatio="aspect-[4/3]"
              />
            </Reveal>
          </div>
        </div>

        {/* Filtering Stages Strip */}
        <Reveal delay={0.1}>
          <div
            className={cn(
              "mt-10 rounded-2xl border p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8",
              isDark ? "bg-[#111317] border-white/10" : "bg-white border-border"
            )}
          >
            <div className="relative w-full lg:w-1/2 h-[220px] sm:h-[260px] rounded-xl overflow-hidden bg-white p-2">
              <Image
                src="/images/brochure/diagrams/wave-filtering-stages.png"
                alt="Filtering of irregularities by wavelength progression"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-3">
              <MonoLabel className="text-xs text-accent">SELECTIVE REMOVAL PROTOCOL</MonoLabel>
              <h4 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-foreground">
                Selective Removal by Wavelength
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Rather than blind polishing, MMP is tuned to systematically eliminate irregularities layer by layer:
              </p>
              <ul className="grid gap-2 text-sm text-foreground/90 font-mono mt-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span><strong>Untreated Surface:</strong> Raw as-machined cusps &amp; micro-peaks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span><strong>Removal of Minute Irregularities:</strong> Eliminates Ra micro-peaks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span><strong>Removal of Medium-Sized:</strong> Eliminates feed lines and waviness.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span><strong>Removal of Large Irregularities:</strong> Achieves mirror-level planarity.</span>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
