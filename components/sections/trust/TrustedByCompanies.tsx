"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/sections/shared/SectionEyebrow";
import { MarqueeRow } from "./MarqueeRow";
import { TRUSTED_COMPANIES } from "./trustedCompanies";

const STAGGER_DELAY = 0.12;

export function TrustedByCompanies({ companies = TRUSTED_COMPANIES }: { companies?: readonly string[] }) {
  const prefersReducedMotion = useReducedMotion();
  const reveal = (index: number) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: prefersReducedMotion ? 0.01 : 0.5, delay: prefersReducedMotion ? 0 : index * STAGGER_DELAY },
  });

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-background py-20 sm:py-28">
      <Container className="flex flex-col items-center gap-4 text-center">
        <motion.div {...reveal(0)}>
          <SectionEyebrow>Trusted by industry leaders</SectionEyebrow>
        </motion.div>
        <motion.h2
          {...reveal(1)}
          className="max-w-2xl text-2xl font-light tracking-tight text-foreground sm:text-3xl"
        >
          Precision trusted by the world&apos;s most demanding companies.
        </motion.h2>
        <motion.p {...reveal(2)} className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          From aerospace and motorsports to energy, manufacturing and advanced engineering, our technology
          supports organizations where precision matters.
        </motion.p>
      </Container>

      <motion.div {...reveal(3)} className="mt-14 flex flex-col gap-6 sm:mt-16 sm:gap-8">
        <MarqueeRow companies={companies} direction="ltr" />
        <MarqueeRow companies={companies} direction="rtl" />
      </motion.div>

      {/* Single, authoritative, non-duplicated list for assistive tech — the two rows above are aria-hidden. */}
      <p className="sr-only">Example companies shown in this section: {companies.join(", ")}.</p>
    </section>
  );
}
