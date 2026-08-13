import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { stats, statsIntro } from "@/data/home-hero";
import { StatItem } from "./StatItem";

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <SectionBackground />
      <Container className="relative flex flex-col items-center gap-16">
        <p className="max-w-2xl text-balance text-center text-lg text-foreground/90 sm:text-xl">
          {statsIntro}
        </p>
        <div className="grid w-full max-w-4xl grid-cols-1 gap-12 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
