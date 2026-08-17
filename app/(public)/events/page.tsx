import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/components/ui/utils";
import { getPublishedEvents } from "@/lib/data/events";
import type { EventDoc, WithId } from "@/lib/types";

const COPY = {
  eyebrow: "Events",
  heading: "Where to find INFINI.",
  body: "Trade shows and announcements — upcoming appearances and a record of where we've been.",
};

// Unlike other public pages, this one's upcoming/past split depends on
// wall-clock time passing, not just a content edit — a statically-built
// page with no revalidate window would keep an ended event under
// "Upcoming" until the next unrelated publish action revalidates it.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description: COPY.body,
  openGraph: { title: "Events — INFINI", description: COPY.body, type: "website" },
};

function formatDateRange(start: Date, end: Date): string {
  const sameDay = start.toDateString() === end.toDateString();
  const dateOpts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  if (sameDay) return start.toLocaleDateString("en-IN", dateOpts);

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString("en-IN", sameMonth ? { month: "long", day: "numeric" } : dateOpts);
  const endLabel = end.toLocaleDateString("en-IN", dateOpts);
  return `${startLabel} – ${endLabel}`;
}

function EventRow({ event, past = false, first = false }: { event: WithId<EventDoc>; past?: boolean; first?: boolean }) {
  const start = event.startDate.toDate();
  const end = event.endDate.toDate();

  return (
    <div className="group relative flex gap-6 pb-12 last:pb-0 sm:gap-10">
      {/* Timeline rail */}
      <div className="relative flex w-10 shrink-0 flex-col items-center sm:w-14">
        <span
          aria-hidden="true"
          className={cn(
            "z-10 mt-1.5 flex size-3 shrink-0 items-center justify-center rounded-full ring-4 ring-background transition-colors duration-300",
            past ? "bg-muted-foreground/40" : first ? "bg-accent" : "bg-foreground/40"
          )}
        />
        <span className="mt-2 h-full w-px flex-1 bg-border group-last:hidden" />
      </div>

      <div className={cn("flex flex-1 flex-col gap-4 pt-0", past && "opacity-70")}>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs tracking-wide text-accent uppercase">{formatDateRange(start, end)}</span>
          <h3 className="text-xl font-normal text-foreground sm:text-2xl">{event.title}</h3>
          {event.location && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5" aria-hidden="true" />
              {event.location}
            </span>
          )}
        </div>

        {event.description && <p className="max-w-2xl text-sm text-foreground/90 sm:text-base">{event.description}</p>}

        {event.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {event.images.map((image, index) => (
              <div
                key={image}
                className="relative aspect-[4/3] w-40 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:w-48"
              >
                <Image src={image} alt={`${event.title} photo ${index + 1}`} fill sizes="200px" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {event.link && (
          <Link
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
          >
            More details
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}

// A plain (non-component) helper — the React Compiler's purity rule flags
// Date.now() called directly inside a component body, even a server
// component that legitimately needs the real current time per request.
function nowMs(): number {
  return Date.now();
}

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const now = nowMs();

  const upcomingAndCurrent = events
    .filter((event) => event.endDate.toDate().getTime() >= now)
    .sort((a, b) => a.startDate.toDate().getTime() - b.startDate.toDate().getTime());

  const past = events
    .filter((event) => event.endDate.toDate().getTime() < now)
    .sort((a, b) => b.startDate.toDate().getTime() - a.startDate.toDate().getTime());

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/60 py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 60% at 50% 0%, rgba(var(--color-accent-rgb),0.14), transparent 70%)",
          }}
        />
        <CalendarDays
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

      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container className="flex flex-col gap-10">
          <h2 className="text-2xl font-light text-foreground sm:text-3xl">Upcoming</h2>
          {upcomingAndCurrent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming events scheduled right now — check back soon.</p>
          ) : (
            <div className="flex flex-col">
              {upcomingAndCurrent.map((event, index) => (
                <EventRow key={event.id} event={event} first={index === 0} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {past.length > 0 && (
        <section className="py-16 sm:py-24">
          <Container className="flex flex-col gap-10">
            <h2 className="text-2xl font-light text-foreground sm:text-3xl">Past</h2>
            <div className="flex flex-col">
              {past.map((event) => (
                <EventRow key={event.id} event={event} past />
              ))}
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
