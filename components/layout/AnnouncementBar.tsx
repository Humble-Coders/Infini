"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className={`overflow-hidden bg-background transition-[max-height,opacity] duration-300 ease-out ${
        visible ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="relative flex items-center justify-center px-10 py-2 text-center">
        <p className="text-[11px] tracking-wide text-muted-foreground">
          ISO 9001-certified MMP surface finishing, in-house from validation through mirror-like finish.
        </p>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss announcement"
          className="absolute right-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
