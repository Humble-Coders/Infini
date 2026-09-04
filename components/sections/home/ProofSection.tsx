import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { CertificationDoc, StatsCopy, WithId } from "@/lib/types";
import { MonoLabel } from "./MonoLabel";

/**
 * The credibility band. Headline figures come from `pages/home`'s `stats`
 * section; certifications are the live, non-expired documents from Firestore,
 * shown with their certificate numbers so they read as evidence rather than
 * badges. Nothing here is a claim the admin panel can't change.
 */
export function ProofSection({
  stats,
  certifications,
  industriesCount,
}: {
  stats: StatsCopy | null;
  certifications: WithId<CertificationDoc>[];
  industriesCount: number;
}) {
  const intro =
    stats?.intro ??
    "Every component that leaves our tanks carries a finish engineers can measure and verify, not just a claim on a spec sheet.";
  const items =
    stats?.items && stats.items.length > 0
      ? stats.items
      : [
          { value: String(industriesCount), label: "Industries served" },
          { value: String(certifications.length), label: "Active certifications" },
          { value: "1", label: "Controlled process" },
        ];

  return (
    <section data-surface="light" className="bg-background-elevated py-24 sm:py-32">
      <Container className="flex flex-col gap-16 lg:gap-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-6 lg:col-span-5">
            <MonoLabel as="h2">Evidence, not claims</MonoLabel>
            <p className="text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] font-medium tracking-[-0.025em] text-balance text-foreground">
              {intro}
            </p>
          </div>

          <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:col-span-7">
            {items.map((item) => (
              <div key={item.label} className="flex flex-col-reverse gap-3 bg-background p-7 sm:p-8">
                <dt className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{item.label}</dt>
                <dd className="text-[clamp(1.75rem,2.9vw,3rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-foreground tabular-nums">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {certifications.length > 0 && (
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
              <h3 className="text-lg font-semibold tracking-[-0.01em] text-foreground">Certifications</h3>
              <Link
                href="/certifications"
                className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-accent"
              >
                View all
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </div>
            <ol className="divide-y divide-border border-b border-border">
              {certifications.map((cert, index) => (
                <li
                  key={cert.id}
                  className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,15rem)_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:py-6"
                >
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                  <p className="flex items-center gap-2.5 font-semibold text-foreground">
                    <ShieldCheck className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                    {cert.name}
                  </p>
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
                  <p className="font-mono text-[11px] tracking-[0.12em] whitespace-nowrap text-muted-foreground uppercase sm:text-right">
                    {cert.certificateNumber} · valid to {cert.validUntil.toDate().getFullYear()}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Container>
    </section>
  );
}
