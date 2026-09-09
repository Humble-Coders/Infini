import { Container } from "@/components/ui/container";

export default function CaseStudiesLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-12 w-2/3 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted/40" />
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container className="flex flex-col gap-10">
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-full border border-border bg-muted/20" />
            ))}
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
                <div className="aspect-[4/3] bg-muted/40" />
                <div className="space-y-2 p-5">
                  <div className="h-5 w-3/4 rounded bg-muted/50" />
                  <div className="h-3 w-full rounded bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}