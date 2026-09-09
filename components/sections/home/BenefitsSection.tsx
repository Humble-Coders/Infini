import { Container } from "@/components/ui/container";
import { ThemeSection } from "@/components/sections/shared/ThemeSection";
import { Activity, Wind, Sparkles, Shield } from "lucide-react";
import { MonoLabel } from "./MonoLabel";
import { Reveal } from "@/components/ui/reveal";
import { EmphasisHeading } from "./EmphasisHeading";

const BENEFITS = [
  {
    icon: Activity,
    title: "Friction Reduction",
    description: "Dramatically lower friction coefficients on transmission and engine components, minimizing energy loss and heat generation.",
  },
  {
    icon: Shield,
    title: "Extended Lifespan",
    description: "By eliminating micro-defects and stress concentrators, components exhibit superior fatigue resistance and durability.",
  },
  {
    icon: Wind,
    title: "Aerodynamics & Hydrodynamics",
    description: "Optimized surface profiles for turbine blades and fluid-handling parts to maximize flow efficiency.",
  },
  {
    icon: Sparkles,
    title: "Premium Aesthetics",
    description: "Mirror-like finishes that not only perform exceptionally but provide the visual perfection required by luxury and medical sectors.",
  },
];

export function BenefitsSection() {
  return (
    <ThemeSection theme="dark" ariaLabel="MMP Technology Added Values" className="relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
      
      <Container className="relative z-10 flex flex-col gap-12 lg:gap-16">
        <Reveal className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto">
          <MonoLabel>Added Values</MonoLabel>
          <h2 className="text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-white">
            <EmphasisHeading text="The engineering impact of MMP Technology" />
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed mt-2 max-w-2xl">
            Super precision finishing is not just about smoothness. It&apos;s about fundamentally enhancing the mechanical and physical properties of your most critical parts.
          </p>
        </Reveal>

        <div className="flex flex-col lg:flex-row w-full gap-4 lg:h-[450px]">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Reveal 
                key={benefit.title} 
                className="group relative flex-1 flex flex-col justify-end overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/10 p-6 sm:p-8 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] lg:hover:flex-[1.5] hover:bg-neutral-950 hover:border-accent/50 cursor-pointer shadow-lg backdrop-blur-sm"
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                
                {/* Large Background Icon */}
                <div className="absolute -right-8 -top-8 z-0 text-white/5 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-x-4 group-hover:translate-y-4 group-hover:scale-110 group-hover:text-accent/10">
                  <Icon className="size-64" strokeWidth={1} />
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col gap-5 mt-auto">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-white backdrop-blur-md transition-colors duration-700 group-hover:bg-accent shadow-lg border border-white/10 group-hover:border-accent/50">
                    <Icon className="size-6" strokeWidth={2} />
                  </span>
                  
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-white text-xl tracking-tight transition-transform duration-700 lg:group-hover:-translate-y-1">{benefit.title}</h3>
                    
                    {/* Expandable text */}
                    <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 max-lg:grid-rows-[1fr] max-lg:opacity-100 max-lg:mt-3">
                      <div className="overflow-hidden">
                        <p className="text-sm sm:text-base leading-relaxed text-neutral-400 mt-2 pb-2">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </ThemeSection>
  );
}
