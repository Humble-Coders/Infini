export function SectionBackground({ grid = false }: { grid?: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 0%, rgba(var(--color-accent-rgb),0.10), transparent 70%)",
        }}
      />
      {grid && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(var(--color-foreground-rgb),0.6) 0px, rgba(var(--color-foreground-rgb),0.6) 1px, transparent 1px, transparent 64px)",
          }}
        />
      )}
    </>
  );
}
