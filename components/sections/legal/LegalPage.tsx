import { Container } from "@/components/ui/container";
import { NewsBody } from "@/components/news/NewsBody";
import type { LegalPageDoc } from "@/lib/data/legal";

/** Plain, readable long-form page for the Privacy Policy and Terms of Use. */
export function LegalPage({ page }: { page: LegalPageDoc }) {
  const updated = page.updatedAt?.toDate?.();
  return (
    <main className="min-h-screen bg-background pt-32 pb-24 sm:pt-40">
      <Container className="max-w-3xl">
        <article className="flex flex-col gap-8">
          <header className="flex flex-col gap-3 border-b border-border pb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{page.title}</h1>
            {updated && (
              <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                Last updated {updated.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </header>
          <NewsBody markdown={page.body} />
        </article>
      </Container>
    </main>
  );
}
