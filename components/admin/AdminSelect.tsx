"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/components/ui/utils";

export interface AdminSelectOption {
  value: string;
  label: string;
  badge?: string;
}

interface AdminSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | AdminSelectOption)[];
  placeholder?: string;
  variant?: "pill" | "form";
  align?: "left" | "right";
  placement?: "top" | "bottom";
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Select option...",
  variant = "form",
  align = "left",
  placement = "bottom",
  className,
  menuClassName,
  disabled = false,
}: AdminSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: AdminSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const triggerStyles =
    variant === "pill"
      ? cn(
          "inline-flex items-center justify-between gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs font-medium text-foreground transition-all whitespace-nowrap",
          "hover:border-accent/40 hover:bg-card focus:outline-none focus:ring-1 focus:ring-accent",
          isOpen && "border-accent ring-1 ring-accent/30 bg-card",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )
      : cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-xs text-foreground transition-all",
          "hover:border-accent/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20",
          isOpen && "border-accent ring-1 ring-accent/30 bg-card/90",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        );

  return (
    <div
      ref={containerRef}
      className={cn("relative", variant === "pill" ? "inline-block" : "w-full")}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={triggerStyles}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && (placement === "top" ? "-rotate-180 text-accent" : "rotate-180 text-accent")
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={cn(
            "absolute z-[100] max-h-60 min-w-[170px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-border/80 bg-neutral-900/98 p-1.5 shadow-2xl shadow-black/90 backdrop-blur-2xl",
            // No visible scrollbars across any browser
            "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            placement === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            align === "right" ? "right-0" : "left-0",
            variant === "form" && "w-full",
            menuClassName
          )}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors",
                  isSelected
                    ? "bg-accent/15 text-accent font-semibold"
                    : "text-foreground/90 hover:bg-neutral-800/80 hover:text-foreground"
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="size-3.5 shrink-0 text-accent" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
