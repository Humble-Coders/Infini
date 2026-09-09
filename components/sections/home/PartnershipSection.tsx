import { ThemeSection } from "@/components/sections/shared/ThemeSection";
import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmphasisHeading } from "./EmphasisHeading";
import { Reveal } from "@/components/ui/reveal";

export function PartnershipSection() {
  return (
    <ThemeSection theme="dark" className="relative overflow-hidden" ariaLabel="BINC Industries and IND-SPHINX Partnership">
      <div className="relative flex flex-col items-center gap-10 py-10 sm:gap-14 sm:py-12">
        <Reveal className="flex flex-col items-center gap-4 text-center">
          <p className="font-mono text-[11px] tracking-[0.24em] text-accent uppercase">Strategic Joint Venture</p>
          <h2 className="max-w-3xl font-sans text-[clamp(2.5rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-white">
            <EmphasisHeading text="Global Technology. Local Excellence." />
          </h2>
          <p className="max-w-2xl font-sans text-base leading-relaxed text-neutral-400 sm:text-lg">
            INFINI is the synergy of IND-SPHINX&apos;s precision manufacturing expertise and BINC Industries&apos; proprietary MMP Technology. A partnership built to deliver European surface-finishing standards directly from India.
          </p>
        </Reveal>

        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
          {/* IND-SPHINX */}
          <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-neutral-950 p-[1px] text-center sm:w-auto">
            <div className="absolute inset-0 z-0 h-full w-full animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#c81820_50%,transparent_100%)]" />
            <div className="relative z-10 flex h-full w-full flex-col items-center gap-4 rounded-[23px] bg-neutral-950 p-8 shadow-[inset_0_0_20px_rgba(200,24,32,0.1)]">
              <div className="flex h-16 items-center justify-center">
                <Image
                  src="/brand/ind-sphinx-light.png"
                  alt="IND-SPHINX"
                  data-mono="off"
                  width={1200}
                  height={227}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-sm text-neutral-400">Precision manufacturing & engineering excellence in India.</p>
            </div>
          </div>

          {/* Plus Icon */}
          <div className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-4 text-accent shadow-[0_0_15px_rgba(200,24,32,0.3)]">
            <Plus className="size-6" strokeWidth={2.5} />
          </div>

          {/* BINC Industries */}
          <div className="relative flex w-full flex-1 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl bg-neutral-950 p-[1px] text-center sm:w-auto">
            <div className="absolute inset-0 z-0 h-full w-full animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0%,#c81820_50%,transparent_100%)]" />
            <div className="relative z-10 flex h-full w-full flex-col items-center gap-4 rounded-[23px] bg-neutral-950 p-8 shadow-[inset_0_0_20px_rgba(200,24,32,0.1)]">
              {/* BINC is the company; MMP Technology is the mark it is known by and
                  the one the PDF supplies, so the card shows both. */}
              <div className="flex h-16 items-center justify-center gap-4">
                <span className="text-2xl font-bold tracking-tight text-white">BINC</span>
                <span aria-hidden="true" className="h-8 w-px bg-white/15" />
                <Image
                  src="/brand/mmp-technology-light.png"
                  alt="MMP Technology"
                  width={700}
                  height={538}
                  className="h-14 w-auto"
                />
              </div>
              <p className="text-sm text-neutral-400">Inventors of MMP Technology, pioneering super precision finishing.</p>
            </div>
          </div>
        </div>

        <Reveal className="mt-4">
          <Link
            href="/company"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 font-mono text-[11px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-white/10"
          >
            Our Heritage
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </ThemeSection>
  );
}
