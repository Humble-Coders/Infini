import * as React from "react";
import { cn } from "./utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border">
      <table data-slot="table" className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("bg-muted text-left text-muted-foreground", className)} {...props} />;
}

export function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={className} {...props} />;
}

export function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return <tr data-slot="table-row" className={cn("border-t border-border", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return <th data-slot="table-head" className={cn("px-4 py-2 font-medium", className)} {...props} />;
}

export function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return <td data-slot="table-cell" className={cn("px-4 py-2 text-foreground", className)} {...props} />;
}
