import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroContent() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="max-w-4xl text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-light tracking-[-0.02em] text-foreground">
        A finish
        <br />
        that performs.
      </h1>
      <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
        Precision surface-finishing for components precision manufacturers already trust —
        applied in-house, verified before it ships.
      </p>
      <div className="flex flex-col items-center gap-3">
        <Button asChild variant="inverse" size="lg" className="px-8">
          <Link href="/request-a-quote">Request a Quote</Link>
        </Button>
        <p className="text-xs text-muted-foreground">No project too precise. Talk to our engineers.</p>
      </div>
    </div>
  );
}
