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
 * Runs on the light-surface tokens so every colour flips with the band. The
 * partner marks are the AXIS IND-SPHINX and BINC Industries logos, colour
 * artwork on transparency, which sits on this light band as delivered.
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
            {/* The two countries behind the joint venture, deck slide 3. Inline SVG
                flags, not emoji, so they render on Windows (which shows flag emoji
                as country-code letters). */}
            <div className="mt-1 flex items-center justify-center gap-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm" role="img" aria-label="Switzerland">
                <rect width="20" height="14" fill="#D52B1E" />
                <rect x="8.5" y="3.5" width="3" height="7" fill="#fff" />
                <rect x="6" y="5.5" width="8" height="3" fill="#fff" />
              </svg>
              <span>Switzerland</span>
              <span aria-hidden="true" className="text-accent">&times;</span>
              <span>India</span>
              <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm" role="img" aria-label="India">
                <rect width="20" height="14" fill="#fff" />
                <rect width="20" height="4.67" fill="#FF9933" />
                <rect y="9.33" width="20" height="4.67" fill="#138808" />
                <g stroke="#0A3A8B" strokeWidth="0.28">
                  <circle cx="10" cy="7" r="1.9" fill="none" />
                  <line x1="10" y1="5.1" x2="10" y2="8.9" />
                  <line x1="8.1" y1="7" x2="11.9" y2="7" />
                  <line x1="8.66" y1="5.66" x2="11.34" y2="8.34" />
                  <line x1="8.66" y1="8.34" x2="11.34" y2="5.66" />
                </g>
                <circle cx="10" cy="7" r="0.45" fill="#0A3A8B" />
              </svg>
            </div>
          </Reveal>

          <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
            <PartnerCard sweep="start" caption="Precision manufacturing & engineering excellence in India.">
              <Image
                src="/brand/ind-sphinx-axis.png"
                alt="AXIS IND-SPHINX, since 1987"
                data-mono="off"
                width={900}
                height={377}
                className="h-14 w-auto"
              />
            </PartnerCard>

            <div className="flex shrink-0 items-center justify-center rounded-full border border-border bg-background p-4 text-accent">
              <Plus className="size-6" strokeWidth={2.5} aria-hidden="true" />
            </div>

            {/* BINC Industries, inventors of MMP Technology. The caption keeps the MMP link. */}
            <PartnerCard sweep="opposite" caption="Inventors of MMP Technology, pioneering super precision finishing.">
              <Image
                src="/brand/binc-industries.png"
                alt="BINC Industries, super precision surface finishes"
                data-mono="off"
                width={900}
                height={375}
                className="h-14 w-auto"
              />
            </PartnerCard>
          </div>

          <Reveal className="mt-4">
            <Link
              href="/company"
              className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-6 py-3 font-mono text-[11px] tracking-[0.2em] text-foreground uppercase transition-colors hover:border-foreground/40 hover:bg-foreground/5"
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
