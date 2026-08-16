import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Download } from "lucide-react";
import type { CertificationDoc, WithId } from "@/lib/types";

/**
 * Reusable compact certifications teaser — used on industry pages
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
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-light text-foreground sm:text-3xl">{heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex items-center gap-4 rounded-xl border border-border p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border">
              {cert.logoUrl ? (
                <Image src={cert.logoUrl} alt={`${cert.name} logo`} width={32} height={32} className="object-contain" />
              ) : (
                <BadgeCheck className="size-6 text-accent" aria-hidden="true" />
              )}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <p className="truncate text-sm font-medium text-foreground">{cert.name}</p>
              {cert.certificateNumber && <p className="truncate text-xs text-muted-foreground">{cert.certificateNumber}</p>}
            </div>
            {cert.fileUrl && (
              <a
                href={cert.fileUrl}
                download
                aria-label={`Download ${cert.name} certificate (PDF)`}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Download className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>
        ))}
      </div>
      <Link
        href="/certifications"
        className="flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors duration-300 ease-out hover:border-primary hover:text-primary"
      >
        <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
        View certificate details
      </Link>
    </div>
  );
}
