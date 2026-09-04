"use client";

import { Fragment, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Container } from "@/components/ui/container";
import type { StatementCopy } from "@/lib/types";
import { MonoLabel } from "./MonoLabel";

const FALLBACK: StatementCopy = {
  label: "INFINI does not manufacture parts",
  heading: "We take the components you already make and give them a surface that performs.",
  body: "MMP treatment removes surface roughness frequency by frequency, in-house, in our own tanks. The part keeps its form. Every batch is measured against your spec before it ships.",
};

function Word({
  word,
  progress,
  start,
  end,
}: {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="statement-word inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

/**
 * The "what INFINI actually is" paragraph, revealed one word at a time as the
 * reader scrolls it into the middle of the viewport — the one line the client
 * most needs a first-time visitor to absorb, paced so it can't be skimmed past.
 */
export function Statement({ copy }: { copy: StatementCopy | null }) {
  const { label, heading, body } = { ...FALLBACK, ...(copy ?? {}) };
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  const lines = heading.split("\n").map((line) => line.trim()).filter(Boolean);
  const words = lines.flatMap((line, lineIndex) =>
    line.split(/\s+/).map((word, wordIndex, all) => ({
      word,
      breakAfter: wordIndex === all.length - 1 && lineIndex < lines.length - 1,
    }))
  );
  const total = words.length;

  return (
    <section className="relative bg-background py-28 sm:py-36 lg:py-44">
      <Container>
        <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {label && <MonoLabel className="lg:col-span-3 lg:pt-3">{label}</MonoLabel>}
          <div className="flex flex-col gap-10 lg:col-span-9">
            <h2 className="text-[clamp(1.85rem,4.4vw,4rem)] leading-[1.06] font-medium tracking-[-0.035em] text-foreground">
              {words.map((item, index) => (
                <Fragment key={`${item.word}-${index}`}>
                  <Word
                    word={item.word}
                    progress={scrollYProgress}
                    start={index / total}
                    end={Math.min(1, (index + 1) / total + 0.06)}
                  />
                  {item.breakAfter && <br />}
                </Fragment>
              ))}
            </h2>
            {body && (
              <p className="max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{body}</p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
