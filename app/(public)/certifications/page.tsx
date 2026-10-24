import type { Metadata } from "next";
import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { Marquee } from "@/components/ui/marquee";
import { getActiveCertifications } from "@/lib/data/certifications";


/*
 * ISR window. Without this the route re-renders and re-reads Firestore on
 * every request, so returning to a page costs the same round trips as
 * arriving the first time. Publishing should still revalidate the path for
 * an immediate update; this is the floor, not the mechanism.
 */
export const revalidate = 600;

const COPY = {
  eyebrow: "Certifications",
  heading: "Certified, documented, and available to verify.",
  body: "Every certificate INFINI holds, current and downloadable, for your supplier file or your own quality system.",
};

export const metadata: Metadata = {
  title: "Certifications",
  description: COPY.body,
  openGraph: {
    title: "Certifications | INFINI",
    description: COPY.body,
    type: "website",
  },
};

function formatDate(timestamp: { toDate(): Date }): string {
  return timestamp.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

const EXPIRING_SOON_DAYS = 60;

function isExpiringSoon(validUntil: { toDate(): Date }): boolean {
  const daysRemaining = Math.ceil((validUntil.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysRemaining <= EXPIRING_SOON_DAYS;
}

export default async function CertificationsPage() {
  const certifications = await getActiveCertifications();

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        image={HERO_IMAGERY.certifications.src}
        imageAlt={HERO_IMAGERY.certifications.alt}
        badges={[{ label: "ISO 9001:2015" }, { label: "ISO 13485" }, { label: "ISO 14001" }, { label: "ISO 45001" }]}
      />

      {/* Infinite cert-name marquee, pauses on hover */}
      {certifications.length > 0 && (
        <section className="bg-background border-b border-border py-10">
          <Container>
            <Marquee speed={38}>
              {[...certifications, ...certifications].map((cert, i) => (
                <span
                  key={`${cert.id}-${i}`}
                  className="mx-4 flex shrink-0 items-center gap-3 whitespace-nowrap font-mono text-sm tracking-[0.08em] uppercase"
                >
                  <ShieldCheck className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-foreground">{cert.name}</span>
                  <span aria-hidden="true" className="text-accent">/</span>
                </span>
              ))}
            </Marquee>
          </Container>
        </section>
      )}

      <section data-surface="light" className="bg-background py-20 sm:py-28">
        <Container>
          {certifications.length === 0 ? (
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                Certification details are being updated, check back shortly, or{" "}
                <Link href="/contact" className="text-accent underline-offset-4 hover:underline">
                  contact us
                </Link>{" "}
                for current documentation.
              </p>
            </div>
          ) : (
            <div className="border-t border-border">
              {certifications.map((cert, index) => (
                <article
                  key={cert.id}
                  className="group grid gap-4 border-b border-border py-7 transition-colors duration-300 hover:bg-foreground/[0.03] focus-within:bg-foreground/[0.03] sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex min-w-0 flex-col gap-2">
                    <h2 className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.01em] text-foreground transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                      <ShieldCheck className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                      {cert.name}
                    </h2>
                    {cert.description && (
                      <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
                    )}
                    <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
                      {cert.certificateNumber && <>Cert. no. {cert.certificateNumber} · </>}
                      Issued {formatDate(cert.issuedDate)} · valid to {formatDate(cert.validUntil)}
                      {isExpiringSoon(cert.validUntil) && (
                        <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-accent">
                          Renewing soon
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="sm:justify-self-end">
                    {cert.fileUrl ? (
                      <a
                        href={cert.fileUrl}
                        download
                        aria-label={`Download ${cert.name} certificate (PDF)`}
                        className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:border-accent focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
                      >
                        <Download className="size-4" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="text-xs whitespace-nowrap text-muted-foreground">PDF on request</p>
                    )}
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
