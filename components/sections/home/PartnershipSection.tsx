import type { ReactNode } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmphasisHeading } from "./EmphasisHeading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/components/ui/utils";

/**
 * The joint venture behind INFINI, in the white run directly after the hero.
 *
 * Runs on the light-surface tokens so every colour flips with the band, and
 * uses the logo files drawn for a light ground (the "-light" variants are the
 * white ones, for dark bands).
 */
function PartnerCard({
  sweep,
  caption,
  children,
}: {
  sweep: "start" | "opposite";
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex w-full flex-1 overflow-hidden rounded-3xl bg-border p-px text-center sm:w-auto">
      {/* A slow brand-red sweep around the edge, behind a 1px inset card. */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 animate-[spin_4s_linear_infinite] will-change-transform motion-reduce:animate-none",
          sweep === "start"
            ? "bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,var(--color-primary)_50%,transparent_100%)]"
            : "bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0%,var(--color-primary)_50%,transparent_100%)]"
        )}
      />
      <div className="relative z-10 flex h-full w-full flex-col items-center gap-4 rounded-[23px] bg-background-elevated p-8">
        <div className="flex h-16 items-center justify-center gap-4">{children}</div>
        <p className="text-sm text-muted-foreground">{caption}</p>
      </div>
    </div>
  );
}

export function PartnershipSection() {
  return (
    <section
      data-surface="light"
      aria-label="BINC Industries and IND-SPHINX partnership"
      className="relative overflow-hidden bg-background-elevated pt-12 pb-10 sm:pt-16 sm:pb-12"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="relative flex flex-col items-center gap-10 sm:gap-14">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-[11px] tracking-[0.24em] text-accent uppercase">Strategic Joint Venture</p>
            <h2 className="max-w-3xl font-sans text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-foreground">
              <EmphasisHeading text="Global Technology. Local Excellence." />
            </h2>
            <p className="max-w-2xl font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              INFINI is the synergy of IND-SPHINX&apos;s precision manufacturing expertise and BINC Industries&apos; proprietary MMP Technology. A partnership built to deliver European surface-finishing standards directly from India.
            </p>
          </Reveal>

          <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
            <PartnerCard sweep="start" caption="Precision manufacturing & engineering excellence in India.">
              <Image
                src="/brand/ind-sphinx.png"
                alt="IND-SPHINX"
                data-mono="off"
                width={1200}
                height={227}
                className="h-12 w-auto"
              />
            </PartnerCard>

            <div className="flex shrink-0 items-center justify-center rounded-full border border-border bg-background p-4 text-accent">
              <Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
            </div>

            {/* BINC is the company; MMP Technology is the mark it is known by, so the card shows both. */}
            <PartnerCard sweep="opposite" caption="Inventors of MMP Technology, pioneering super precision finishing.">
              <span className="text-2xl font-bold tracking-tight text-foreground">BINC</span>
              <span aria-hidden="true" className="h-8 w-px bg-border" />
              <Image src="/brand/mmp-technology.png" alt="MMP Technology" width={700} height={538} className="h-14 w-auto" />
            </PartnerCard>
          </div>

          <Reveal className="mt-4">
            <Link
              href="/company"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-6 py-3 font-mono text-[11px] tracking-[0.2em] text-foreground uppercase transition-colors hover:border-foreground/40 hover:bg-foreground/5"
            >
              Our Heritage
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
