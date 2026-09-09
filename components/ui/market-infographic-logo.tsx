export function MarketInfographicLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center p-4 rounded-full border border-border bg-card/40 backdrop-blur-sm ${className || ''}`} aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-primary/50" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="32" cy="32" r="20" stroke="currentColor" className="text-accent" strokeWidth="1.5" />
        <path d="M32 18V24M32 40V46M18 32H24M40 32H46M22 22L26 26M38 38L42 42M22 42L26 38M38 22L42 26" stroke="currentColor" className="text-foreground" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="32" r="6" className="fill-primary" />
      </svg>
      <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse pointer-events-none" />
    </div>
  );
}
