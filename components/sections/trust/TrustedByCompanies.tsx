"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { BlueprintBackdrop } from "@/components/sections/shared/BlueprintBackdrop";
import { LogoShowcase } from "./LogoShowcase";
import { TRUSTED_COMPANIES, type TrustedCompany } from "./trustedCompanies";

const STAGGER_DELAY = 0.12;

export function TrustedByCompanies({ companies = TRUSTED_COMPANIES }: { companies?: TrustedCompany[] }) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (index: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.55, delay: prefersReducedMotion ? 0 : index * STAGGER_DELAY },
  });

  return (
    <section className="mmp-trust relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <BlueprintBackdrop />

      <Container className="relative flex flex-col items-center gap-4 text-center">
        <motion.div {...reveal(0)} className="flex items-center gap-2">
          <span aria-hidden="true" className="h-px w-6 bg-accent" />
          <span className="text-[13px] font-medium tracking-[2px] text-accent uppercase">
            Trusted by industry leaders
          </span>
        </motion.div>

        <motion.h2
          {...reveal(1)}
          className="max-w-[850px] text-[34px] leading-[1.05] font-normal tracking-tight text-foreground sm:text-[48px] lg:text-[58px]"
        >
          Precision trusted by the world&apos;s most demanding companies.
        </motion.h2>

        <motion.p
          {...reveal(2)}
          className="max-w-[760px] text-base leading-[1.6] text-muted-foreground sm:text-lg"
        >
          From aerospace and motorsports to energy, manufacturing and advanced engineering, our technology
          supports organizations where precision matters.
        </motion.p>
      </Container>

      <motion.div {...reveal(3)} className="relative mt-8 sm:mt-10">
        <Container>
          <LogoShowcase companies={companies} />
        </Container>
      </motion.div>

      {/* Single, authoritative list for assistive tech — the carousel pages duplicate names visually only. */}
      <p className="sr-only">
        Example companies shown in this section: {companies.map((company) => company.name).join(", ")}.
      </p>
    </section>
  );
}
