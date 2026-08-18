import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Download, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionBackground } from "@/components/sections/shared/SectionBackground";
import { getActiveCertifications } from "@/lib/data/certifications";

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
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <SectionBackground grid />
        <ShieldCheck
          strokeWidth={0.6}
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-20 size-72 text-foreground/[0.05] sm:size-96"
        />
        <Container className="relative flex flex-col gap-4">
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
            <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-border px-6 py-10 sm:px-10">
              <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                Certification details are being updated, check back shortly, or{" "}
                <Link href="/#contact" className="text-accent underline-offset-4 hover:underline">
                  contact us
                </Link>{" "}
                for current documentation.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {certifications.map((cert) => (
                <article
                  key={cert.id}
                  className="group flex flex-col gap-5 rounded-xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:border-primary hover:shadow-[0_20px_60px_-15px_rgba(var(--color-shadow-rgb),0.5)] sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                      {cert.logoUrl ? (
                        <Image src={cert.logoUrl} alt={`${cert.name} logo`} width={36} height={36} className="object-contain" />
                      ) : (
                        <BadgeCheck className="size-7 text-accent" aria-hidden="true" />
                      )}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-1">
                      <h2 className="text-xl leading-tight font-normal text-foreground">{cert.name}</h2>
                      {cert.certificateNumber && (
                        <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs tracking-wide text-muted-foreground">
                          Cert. no. {cert.certificateNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {cert.description && <p className="text-sm text-muted-foreground sm:text-base">{cert.description}</p>}

                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border/60 pt-5">
                    <div>
                      <dt className="text-xs tracking-wide text-muted-foreground uppercase">Issued</dt>
                      <dd className="text-sm text-foreground/90">{formatDate(cert.issuedDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs tracking-wide text-muted-foreground uppercase">Valid until</dt>
                      <dd className="flex items-center gap-2 text-sm text-foreground/90">
                        {formatDate(cert.validUntil)}
                        {isExpiringSoon(cert.validUntil) && (
                          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium tracking-wide text-accent uppercase">
                            Renewing soon
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-1">
                    {cert.fileUrl ? (
                      <Button asChild variant="outline" className="w-fit gap-2">
                        <a href={cert.fileUrl} download aria-label={`Download ${cert.name} certificate (PDF)`}>
                          <Download className="size-4" aria-hidden="true" />
                          Download PDF
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">Certificate PDF available on request.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      <section className="border-t border-border/60 py-16 sm:py-20">
        <Container className="flex flex-col items-center gap-6 text-center">
          <h2 className="max-w-xl text-2xl font-light text-foreground sm:text-3xl">
            Need a certificate for your supplier file?
          </h2>
          <Button asChild size="lg" className="px-8">
            <Link href="/#contact">Contact Us</Link>
          </Button>
        </Container>
      </section>
    </main>
  );
}
