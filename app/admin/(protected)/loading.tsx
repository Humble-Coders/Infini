/**
 * Shown the moment an admin nav link is clicked, while the next screen's data
 * loads on the server. Links prefetch this boundary, so switching sections
 * responds instantly instead of freezing on the old screen.
 */
export default function AdminLoading() {
  return (
    <div className="w-full animate-pulse space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-card" />
        <div className="h-7 w-72 rounded bg-card" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-2xl border border-border/60 bg-card/40" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="aspect-square rounded-2xl border border-border/60 bg-card/40" />
        ))}
      </div>
    </div>
  );
}
