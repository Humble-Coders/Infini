import { EmptyState } from "@/components/admin/EmptyState";

/** Placeholder for a nav section whose real CRUD screen ships with its own ticket — keeps the T7 nav functional without 404s. */
export function ComingSoonSection({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <EmptyState title="Coming soon" description="This section ships in a later ticket." />
    </div>
  );
}
