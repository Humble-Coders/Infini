import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Download } from "lucide-react";
import type { CertificationDoc, WithId } from "@/lib/types";

/**
 * Reusable compact certifications teaser, used on industry pages
 * (filtered to that industry's relatedCertIds) and Company/Capabilities
 * (the full active list). The full per-certificate content page is
 * app/(public)/certifications/page.tsx, not this component.
 */
export function CertificationsBlock({
  certifications,
  heading = "Certifications",
}: {
  certifications: WithId<CertificationDoc>[];
  heading?: string;
}) {
  if (certifications.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-semibold tracking-[-0.03em] text-foreground">
          {heading}
        </h2>
        <p className="text-base text-muted-foreground max-w-xl">
          Our processes are rigorously verified and certified to meet the highest global standards for quality and precision.
        </p>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <div key={cert.id} className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background-elevated to-background p-6 transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--color-accent-rgb),0.1)]">
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 shadow-inner">
                {cert.logoUrl ? (
                  <Image src={cert.logoUrl} alt={`${cert.name} logo`} width={36} height={36} className="object-contain" />
                ) : (
                  <BadgeCheck className="size-7 text-accent" aria-hidden="true" />
                )}
              </span>
              
              {cert.fileUrl && (
                <a
                  href={cert.fileUrl}
                  download
                  aria-label={`Download ${cert.name} certificate (PDF)`}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background border border-border text-foreground transition-all duration-300 hover:scale-110 hover:border-accent hover:text-accent hover:shadow-lg"
                >
                  <Download className="size-4" aria-hidden="true" />
                </a>
              )}
            </div>
            
            <div className="flex flex-col gap-1.5 mt-auto pt-4 border-t border-border/50">
              <p className="text-lg font-medium text-foreground tracking-[-0.01em] group-hover:text-accent transition-colors">{cert.name}</p>
              {cert.certificateNumber && (
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/50"></span>
                  <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest">{cert.certificateNumber}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
