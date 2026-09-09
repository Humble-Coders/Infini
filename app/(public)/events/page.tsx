import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/ui/reveal";
import { PhotoHero } from "@/components/sections/shared/PhotoHero";
import { ProcessStrip } from "@/components/sections/shared/ProcessStrip";
import { MarqueeBand } from "@/components/sections/shared/MarqueeBand";
import { DetailRows } from "@/components/sections/shared/DetailRows";
import { HERO_IMAGERY } from "@/lib/constants/heroImagery";
import { cn } from "@/components/ui/utils";
import { getPublishedEvents } from "@/lib/data/events";
import type { EventDoc, WithId } from "@/lib/types";

const COPY = {
  eyebrow: "Events",
  heading: "Where to find INFINI.",
  body: "Trade shows and announcements, upcoming appearances and a record of where we have been.",
};

/**
 * What a visit to the stand actually consists of.
 *
 * This is the substance of the page. A calendar of dates tells an engineer
 * nothing about why the trip is worth their morning; four stages with real
 * timings tell them exactly what they walk away holding.
 */
const STAND_STAGES = [
  {
    timing: "5 minutes",
    step: "01",
    title: "Bring the part",
    points: [
      "One component, as machined or as printed",
      "No drawing or NDA needed to talk geometry",
      "Internal passages and blind pockets welcome",
    ],
  },
  {
    timing: "10 minutes",
    step: "02",
    title: "Read the surface",
    points: [
      "Roughness measured on the stand",
      "Ra, Rz and Rsk from the same trace",
      "Baseline recorded against your drawing",
    ],
  },
  {
    timing: "Same day",
    step: "03",
    title: "Scope the cycle",
    points: [
      "Media and chemistry proposed for the alloy",
      "Expected finish stated as a range",
      "Fixturing and batch size discussed",
    ],
  },
  {
    timing: "2 weeks",
    step: "04",
    title: "Trial and report",
    points: [
      "Sample treated at the Parwanoo plant",
      "Before and after traces returned",
      "Dimensional check against tolerance",
    ],
  },
];

/** The circuit INFINI and the wider MMP network work. Static because it is a standing plan, not a content feed. */
const CIRCUIT = [
  {
    label: "Aerospace and defence",
    detail: "Airframe, engine and MRO shows where internal passage finishing is the discussion.",
  },
  {
    label: "Medical technology",
    detail: "Implant and instrument forums, where mirror finish and ISO 13485 alignment lead.",
  },
  {
    label: "Motorsport and drivetrain",
    detail: "Gear, transmission and racing expos, where friction and contact fatigue are the metric.",
  },
  {
    label: "Additive manufacturing",
    detail: "Printing shows, where as-built roughness is the last barrier to a production part.",
  },
];

// Unlike other public pages, this one's upcoming/past split depends on
// wall-clock time passing, not just a content edit, so a statically-built
// page with no revalidate window would keep an ended event under
// "Upcoming" until the next unrelated publish action revalidates it.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description: COPY.body,
  openGraph: { title: "Events | INFINI", description: COPY.body, type: "website" },
};

/** Range without a dash: "12 to 15 March 2026", or a single date when it is one day. */
function formatDateRange(start: Date, end: Date): string {
  const sameDay = start.toDateString() === end.toDateString();
  const dateOpts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  if (sameDay) return start.toLocaleDateString("en-IN", dateOpts);

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString("en-IN", sameMonth ? { day: "numeric" } : dateOpts);
  return `${startLabel} to ${end.toLocaleDateString("en-IN", dateOpts)}`;
}

/**
 * One event as a wide hairline row: an oversized date block on the left, the
 * detail in the middle, photography on the right.
 *
 * The date block is what makes a list of shows scannable. A reader looking for
 * "is there one this quarter" reads the left column only and stops.
 */
function EventRow({ event, past = false, next = false }: { event: WithId<EventDoc>; past?: boolean; next?: boolean }) {
  const start = event.startDate.toDate();
  const end = event.endDate.toDate();
  const day = start.toLocaleDateString("en-IN", { day: "2-digit" });
  const month = start.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();

  return (
    <li className={cn("border-b border-border", past && "opacity-70")}>
      <Reveal>
        <article className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
          <div className="flex items-start gap-5 lg:col-span-3">
            <div
              className={cn(
                "flex w-20 shrink-0 flex-col items-center justify-center border px-3 py-3",
                next ? "border-foreground bg-foreground text-background" : "border-border text-foreground"
              )}
            >
              <span className="text-2xl leading-none font-semibold tabular-nums">{day}</span>
              <span className="mt-1 font-mono text-[10px] tracking-[0.16em]">{month}</span>
            </div>
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-mono text-[10px] tracking-[0.14em] tabular-nums text-muted-foreground uppercase">
                {formatDateRange(start, end)}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  {event.location}
                </span>
              )}
              {next && (
                <span className="mt-1 w-fit font-mono text-[10px] tracking-[0.16em] text-accent uppercase">
                  Next appearance
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-6">
            <h3 className="text-[clamp(1.2rem,2.2vw,1.6rem)] leading-snug font-semibold tracking-[-0.03em] text-foreground">
              {event.title}
            </h3>
            {event.description && (
              <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
                {event.description}
              </p>
            )}
            {event.link && (
              <Link
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-fit items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-accent uppercase"
              >
                Show details
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            )}
          </div>

          {event.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto lg:col-span-3 lg:justify-end">
              {event.images.slice(0, 2).map((image, index) => (
                <div
                  key={image}
                  className="relative aspect-[4/3] w-36 shrink-0 overflow-hidden border border-border bg-background-elevated"
                >
                  <Image
                    src={image}
                    alt={`${event.title} photo ${index + 1}`}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </article>
      </Reveal>
    </li>
  );
}

// A plain (non-component) helper, because the React Compiler's purity rule flags
// Date.now() called directly inside a component body, even a server
// component that legitimately needs the real current time per request.
function nowMs(): number {
  return Date.now();
}

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const now = nowMs();

  const upcoming = events
    .filter((event) => event.endDate.toDate().getTime() >= now)
    .sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime());

  const past = events
    .filter((event) => event.endDate.toDate().getTime() < now)
    .sort((a, b) => b.startDate.toDate().getTime() - a.startDate.toDate().getTime());

  return (
    <main className="min-h-screen bg-background">
      <PhotoHero
        eyebrow={COPY.eyebrow}
        heading={COPY.heading}
        body={COPY.body}
        image={HERO_IMAGERY.events.src}
        imageAlt={HERO_IMAGERY.events.alt}
        priority
        badges={[{ label: "Trade shows" }, { label: "Live measurement" }, { label: "Sample trials" }]}
        spec={{
          title: upcoming.length > 0 ? `${upcoming.length} appearance${upcoming.length === 1 ? "" : "s"} scheduled` : "Bring a part",
          body: "We measure roughness on the stand and scope a trial cycle before you leave.",
        }}
      />

      <ProcessStrip
        eyebrow="At the stand"
        heading="Twenty minutes, one component, a measured answer."
        body="A visit is not a brochure exchange. Bring a part and leave with its surface read and a treatment cycle scoped."
        stages={STAND_STAGES}
        surface="light"
      />

      <section className="bg-background py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex max-w-xl flex-col gap-5">
              <Eyebrow index={2}>Calendar</Eyebrow>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground">
                Upcoming appearances.
              </h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.16em] tabular-nums text-muted-foreground uppercase">
              {upcoming.length} confirmed
            </span>
          </div>

          {upcoming.length === 0 ? (
            <div className="flex max-w-2xl flex-col gap-4">
              <p className="text-lg leading-relaxed text-foreground">
                Nothing is on the calendar right now. The next season of shows is being confirmed.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The circuit below is where we appear when dates are set. A plant visit at Parwanoo is available in the
                meantime, and it covers the same four stages as a stand visit with the full line behind it.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col border-t border-border">
              {upcoming.map((event, index) => (
                <EventRow key={event.id} event={event} next={index === 0} />
              ))}
            </ul>
          )}
        </Container>
      </section>

      <MarqueeBand text={["Bring a part", "Read the surface", "Scope the cycle", "Leave with a number"]} />

      <DetailRows
        eyebrow="Circuit"
        heading="The shows we work."
        body="Four sectors, chosen because they are where surface finish decides whether a component passes."
        rows={CIRCUIT}
        surface="light"
        image={HERO_IMAGERY.components.src}
        imageAlt={HERO_IMAGERY.components.alt}
        imageLabel="On the stand"
      />

      {past.length > 0 && (
        <section className="bg-background py-16 sm:py-24">
          <Container className="flex flex-col gap-10">
            <div className="flex max-w-xl flex-col gap-5 border-b border-border pb-8">
              <Eyebrow index={4}>Record</Eyebrow>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-foreground">
                Where we have been.
              </h2>
            </div>
            <ul className="flex flex-col border-t border-border">
              {past.map((event) => (
                <EventRow key={event.id} event={event} past />
              ))}
            </ul>
          </Container>
        </section>
      )}
    </main>
  );
}
