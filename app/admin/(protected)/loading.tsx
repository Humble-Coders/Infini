export default function AdminLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Top subtle progress line */}
      <div className="fixed top-0 inset-x-0 h-[2px] z-[100] bg-muted overflow-hidden">
        <div className="h-full w-1/3 bg-accent animate-[marquee_1s_ease-in-out_infinite]" />
      </div>

      {/* Header skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card/40 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-7 w-48 sm:w-64 rounded-lg bg-muted/60" />
            <div className="h-4 w-72 sm:w-96 rounded-md bg-muted/40" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 rounded-xl bg-muted/50" />
            <div className="h-9 w-28 rounded-xl bg-muted/50" />
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-border/80 bg-card/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-muted/60" />
              <div className="h-7 w-48 rounded-full bg-muted/40" />
            </div>
            <div className="space-y-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 p-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-44 rounded bg-muted/60" />
                    <div className="h-3 w-64 rounded bg-muted/30" />
                  </div>
                  <div className="h-6 w-16 rounded-md bg-muted/40" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-border/80 bg-card/40 p-6 space-y-3">
            <div className="h-4 w-32 rounded bg-muted/60" />
            <div className="h-16 rounded-xl bg-muted/30" />
            <div className="h-16 rounded-xl bg-muted/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
