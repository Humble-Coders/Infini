import { Container } from "@/components/ui/container";

export default function CapabilitiesLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-5">
          <span className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted/40" />
        </Container>
      </section>

      {/* Process list skeleton */}
      <section className="border-b border-border/60 py-16 sm:py-24">
        <Container>
          <div className="h-8 w-48 animate-pulse rounded bg-muted/60 mb-12" />
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-8 border-t border-border py-7">
                <div className="h-4 w-12 shrink-0 animate-pulse rounded bg-muted/40" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 animate-pulse rounded bg-muted/50" />
                  <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}