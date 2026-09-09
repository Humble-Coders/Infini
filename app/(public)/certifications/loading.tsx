import { Container } from "@/components/ui/container";

export default function CertificationsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="h-3 w-28 animate-pulse rounded bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted/40" />
        </Container>
      </section>
      {/* Marquee skeleton */}
      <section className="border-b border-border/60 py-10">
        <Container>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-5 w-32 shrink-0 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <div className="border-t border-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid gap-4 border-b border-border py-7 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8">
                <div className="h-3 w-5 animate-pulse rounded bg-muted/30" />
                <div className="space-y-2">
                  <div className="h-6 w-48 animate-pulse rounded bg-muted/50" />
                  <div className="h-3 w-64 animate-pulse rounded bg-muted/30" />
                  <div className="h-3 w-80 animate-pulse rounded bg-muted/20" />
                </div>
                <div className="size-12 animate-pulse rounded-full border border-border bg-muted/20 sm:justify-self-end" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}