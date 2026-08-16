import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getActiveCertifications } from "@/lib/data/certifications";

const COPY = {
  eyebrow: "Certifications",
  heading: "Certified, documented, and available to verify.",
  body: "Every certificate INFINI holds, current and downloadable — for your supplier file or your own quality system.",
};

export const metadata: Metadata = {
  title: "Certifications",
  description: COPY.body,
  openGraph: {
    title: "Certifications — INFINI",
    description: COPY.body,
    type: "website",
  },
};

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function CertificationsPage() {
  const certifications = await getActiveCertifications();

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">{COPY.eyebrow}</span>
          <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-light tracking-[-0.02em] text-foreground">
            {COPY.heading}
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground sm:text-base">{COPY.body}</p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {certifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Certification details are being updated — check back shortly.</p>
          ) : (
            <div className="flex flex-col gap-8">
              {certifications.map((cert) => (
                <article
                  key={cert.id}
                  className="flex flex-col gap-6 rounded-xl border border-border p-6 sm:flex-row sm:items-start sm:p-8"
                >
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-border">
                    {cert.logoUrl ? (
                      <Image src={cert.logoUrl} alt={`${cert.name} logo`} width={40} height={40} className="object-contain" />
                    ) : (
                      <BadgeCheck className="size-8 text-accent" aria-hidden="true" />
                    )}
                  </span>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-xl font-normal text-foreground">{cert.name}</h2>
                      {cert.fileUrl && (
                        <a
                          href={cert.fileUrl}
                          download
                          aria-label={`Download ${cert.name} certificate (PDF)`}
                          className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                        >
                          <Download className="size-4" aria-hidden="true" />
                          Download PDF
                        </a>
                      )}
                    </div>

                    {cert.description && <p className="text-sm text-muted-foreground sm:text-base">{cert.description}</p>}

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-2 pt-2 sm:grid-cols-3">
                      {cert.certificateNumber && (
                        <div>
                          <dt className="text-xs tracking-wide text-muted-foreground uppercase">Certificate number</dt>
                          <dd className="text-sm text-foreground/90">{cert.certificateNumber}</dd>
                        </div>
                      )}
                      <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">Issued</dt>
                        <dd className="text-sm text-foreground/90">{formatDate(cert.issuedDate)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">Valid until</dt>
                        <dd className="text-sm text-foreground/90">{formatDate(cert.validUntil)}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}
