import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MonoLabel } from "@/components/sections/home/MonoLabel";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";

interface MmpProcessStepsProps {
  surface?: "dark" | "light";
}

const STEPS = [
  {
    step: "01",
    title: "Rigid Part Clamping",
    badge: "TANK FIXTURE",
    description:
      "The component is firmly mounted inside the MMP processing tank using a custom-engineered fixture. Parts must have an adequate grip to withstand multi-directional hydrodynamic forces during treatment.",
    image: "/images/brochure/diagrams/step-1-clamping.png",
    aspect: "aspect-[16/10]",
    keyDetail: "Custom-designed fixture ensures zero contact damage.",
  },
  {
    step: "02",
    title: "Microtool Introduction",
    badge: "PROPRIETARY MEDIA",
    description:
      "The tank is charged with proprietary microtools—tiny engineered particles developed specifically in-house by BinC Industries in Switzerland. Media geometry and sizing are chosen based on the incoming roughness wavelength.",
    image: "/images/brochure/diagrams/step-2-microtools.png",
    aspect: "aspect-[16/10]",
    keyDetail: "Particles calibrated to the targeted roughness scale.",
  },
  {
    step: "03",
    title: "Catalytic Aggregation",
    badge: "CHEMICAL ACTIVATION",
    description:
      "A specialized catalyst is added to the tank. The catalytic interaction causes individual microtools to bond into coherent 'microtool aggregates' engineered to conform to the component's microscopic surface contours.",
    image: "/images/brochure/diagrams/step-3-catalyst.png",
    aspect: "aspect-[16/10]",
    keyDetail: "Microtools + Catalyst = Active Microtool Aggregates.",
  },
  {
    step: "04",
    title: "Multi-Directional Excitation",
    badge: "ISOTROPIC FINISH",
    description:
      "The MMP device excites the tank, causing microtool aggregates to move randomly in many directions over the component surface. Irregularities are sheared away without creating directional streaks or machining grain.",
    image: "/images/brochure/diagrams/step-4-device-run.png",
    aspect: "aspect-[16/10]",
    keyDetail: "Non-directional isotropic surface with zero polishing lines.",
  },
];

export function MmpProcessSteps({ surface = "dark" }: MmpProcessStepsProps) {
  const isDark = surface === "dark";

  return (
    <section
      data-surface={surface}
      className={cn(
        "relative py-12 sm:py-16 overflow-hidden border-t",
        isDark ? "bg-[#0b0c0e] border-white/10" : "bg-muted/20 border-border"
      )}
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl">
            <Eyebrow>Process Overview</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground">
              Inside the MMP tank: <span className="font-serif italic font-normal text-accent">the four-step sequence.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Every INFINI treatment runs in dedicated tanks under controlled physical and chemical parameters. From rigid clamping to isotropic excitation, each stage is repeatable and parameter-driven.
            </p>
          </div>
        </Reveal>

        {/* 4 Steps Grid */}
        <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {STEPS.map((item, idx) => (
            <Reveal key={item.step} delay={idx * 0.08}>
              <div
                className={cn(
                  "group relative flex flex-col h-full rounded-2xl border overflow-hidden transition-all duration-300",
                  isDark
                    ? "bg-[#101216] border-white/10 hover:border-white/20 shadow-xl shadow-black/40"
                    : "bg-white border-border hover:border-border/80 shadow-md shadow-black/5"
                )}
              >
                {/* Header with Step Number */}
                <div
                  className={cn(
                    "flex items-center justify-between border-b px-5 py-3.5",
                    isDark ? "border-white/10 bg-white/[0.02]" : "border-border/60 bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-accent">
                      STEP {item.step}
                    </span>
                    <span className="h-3 w-px bg-border" />
                    <MonoLabel className="text-[11px]">{item.badge}</MonoLabel>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    MMP SEQUENCE
                  </span>
                </div>

                {/* Visual Image */}
                <div
                  className={cn(
                    "relative w-full overflow-hidden p-4 sm:p-6 flex items-center justify-center min-h-[220px]",
                    isDark ? "bg-[#14161b]" : "bg-muted/10"
                  )}
                >
                  <div className="relative w-full h-[200px] sm:h-[220px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow p-6 sm:p-7">
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted-foreground flex-grow">
                    {item.description}
                  </p>
                  <div
                    className={cn(
                      "mt-5 pt-4 border-t flex items-center gap-2 text-xs font-mono",
                      isDark ? "border-white/10 text-accent/90" : "border-border text-accent"
                    )}
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                    {item.keyDetail}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Complete Tank Schematic Callout */}
        <Reveal delay={0.15}>
          <div
            className={cn(
              "mt-8 rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6",
              isDark ? "bg-[#121418] border-white/10" : "bg-white border-border"
            )}
          >
            <div className="max-w-xl">
              <span className="font-mono text-xs tracking-wider uppercase text-accent">
                Result Architecture
              </span>
              <h4 className="mt-1 text-lg sm:text-xl font-semibold text-foreground">
                Truly Isotropic: Zero Directional Streaks
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Unlike abrasive wheels or brushing tools that scratch the part along a fixed rotation path, MMP microtool aggregates move omnidirectionally in 3D fluid motion. This leaves an isotropic, non-directional surface ideal for fluid dynamics, seal mating, and friction reduction.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <div
                className={cn(
                  "rounded-lg px-4 py-2.5 font-mono text-xs border text-center",
                  isDark ? "border-white/10 bg-white/[0.04] text-foreground" : "border-border bg-muted/30 text-foreground"
                )}
              >
                <div className="text-accent font-semibold text-sm">Ra &lt; 0.02 µm</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Surface roughness</div>
              </div>
              <div
                className={cn(
                  "rounded-lg px-4 py-2.5 font-mono text-xs border text-center",
                  isDark ? "border-white/10 bg-white/[0.04] text-foreground" : "border-border bg-muted/30 text-foreground"
                )}
              >
                <div className="text-accent font-semibold text-sm">100% Isotropic</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Non-directional lay</div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
