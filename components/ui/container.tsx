import * as React from "react";
import { cn } from "./utils";

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-[1440px] px-6 md:px-10 lg:px-16", className)}
      {...props}
    />
  );
}
