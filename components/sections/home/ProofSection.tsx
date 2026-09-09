import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import type { CertificationDoc, StatsCopy, WithId } from "@/lib/types";
import { MonoLabel } from "./MonoLabel";

type ParsedStat = { value: number; decimals: number; prefix: string; suffix: string };

/**
 * Splits a stat like "40+" or "99.9%" into a countable number plus its
 * affixes. Non-numeric stats ("ISO 9001", ", ") return null and render as
 * plain text, so CMS authors are never constrained to numbers.
 */
function parseStat(raw: string): ParsedStat | null {
  const match = raw.match(/(\d[\d,]*(?:\.\d+)?)/);
  if (!match || match.index === undefined) return null;
  const numeric = match[1].replace(/,/g, "");
  const value = Number(numeric);
  if (!Number.isFinite(value)) return null;
  const decimals = numeric.includes(".") ? (numeric.split(".")[1]?.length ?? 0) : 0;
  return {
    value,
    decimals,
    prefix: raw.slice(0, match.index),
    suffix: raw.slice(match.index + match[1].length),
  };
}

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
            {items.map((item) => {
              const parsed = parseStat(item.value);
              return (
                <div key={item.label} className="flex flex-col-reverse gap-3 bg-background p-7 sm:p-8">
                  <dt className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">{item.label}</dt>
                  <dd className="text-[clamp(1.75rem,2.9vw,3rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-balance text-foreground tabular-nums">
                    {parsed ? (
                      <CountUp value={parsed.value} decimals={parsed.decimals} prefix={parsed.prefix} suffix={parsed.suffix} />
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              );
            })}
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certifications.map((cert) => (
                <Link
                  key={cert.id}
                  href="/certifications"
                  aria-label={`${cert.name}, full certificate details`}
                  className="group flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-accent/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                      <ShieldCheck className="size-6" strokeWidth={1.75} />
                    </span>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold tracking-tight text-foreground">{cert.name}</h4>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {cert.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-4 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    <span>{cert.certificateNumber}</span>
                    <span>valid to {cert.validUntil.toDate().getFullYear()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
