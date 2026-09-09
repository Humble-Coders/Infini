import { Container } from "@/components/ui/container";

export default function ContactLoading() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Brand panel skeleton */}
            <div className="animate-pulse rounded-3xl bg-primary-muted p-8 sm:p-10 lg:col-span-5 lg:p-12">
              <div className="mb-6 h-3 w-20 rounded bg-white/10" />
              <div className="mb-4 h-10 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
            {/* Form skeleton */}
            <div className="animate-pulse rounded-[20px] border border-border bg-card p-6 sm:rounded-[24px] sm:p-10 lg:col-span-7 lg:p-12">
              <div className="mb-6 flex gap-4">
                <div className="size-11 shrink-0 rounded-full bg-muted/40" />
                <div className="space-y-2 pt-1">
                  <div className="h-5 w-48 rounded bg-muted/50" />
                  <div className="h-3 w-36 rounded bg-muted/30" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-16 rounded bg-muted/30" />
                    <div className="h-10 rounded-[10px] bg-muted/20" />
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="h-3 w-16 rounded bg-muted/30" />
                <div className="h-10 rounded-[10px] bg-muted/20" />
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="h-3 w-16 rounded bg-muted/30" />
                <div className="h-24 rounded-[10px] bg-muted/20" />
              </div>
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="h-11 w-full rounded-[10px] bg-primary/20" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}