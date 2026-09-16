import { cn } from "@/components/ui/utils";

type AuroraProps = {
  className?: string;
};

/**
 * High-performance brand-red aurora:
 * Uses GPU-accelerated smooth radial gradients instead of CPU/GPU-taxing 120px CSS box blurs.
 */
export function Aurora({ className }: AuroraProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-[30%] left-[12%] size-[28rem] animate-aurora-a rounded-full bg-[radial-gradient(circle,rgba(var(--color-primary-rgb),0.32)_0%,transparent_70%)] transform-gpu will-change-transform sm:size-[40rem]" />
      <div className="absolute top-[10%] -right-[10%] size-[24rem] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgba(var(--color-primary-rgb),0.22)_0%,transparent_70%)] transform-gpu will-change-transform sm:size-[34rem]" />
      <div className="absolute -bottom-[35%] left-[45%] hidden size-[30rem] animate-aurora-c rounded-full bg-[radial-gradient(circle,rgba(var(--color-accent-rgb),0.18)_0%,transparent_70%)] transform-gpu will-change-transform sm:block" />
    </div>
  );
}
