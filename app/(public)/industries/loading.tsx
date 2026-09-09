import { Container } from "@/components/ui/container";

export default function IndustriesLoading() {
  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border/60 py-20 sm:py-28">
        <Container className="flex flex-col gap-4">
          <span className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-muted/40" />
        </Container>
      </section>
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`animate-pulse rounded-2xl border border-border bg-card p-7 ${
                  i === 0 ? "lg:col-span-2" : i === 3 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="mb-5 flex justify-between">
                  <div className="size-12 rounded-full border border-border bg-muted/30" />
                  <div className="h-3 w-5 rounded bg-muted/30" />
                </div>
                <div className="mb-2 h-6 w-40 rounded bg-muted/50" />
                <div className="h-4 w-full rounded bg-muted/30" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}