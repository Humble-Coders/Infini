import Image from "next/image";
import { FileText } from "lucide-react";
import type { WithId, MediaDoc } from "@/lib/types";

export function MediaThumbnail({ item }: { item: WithId<MediaDoc> }) {
  const isPdf = item.contentType === "application/pdf";

  if (isPdf) {
    return (
      <div className="flex aspect-square items-center justify-center bg-muted">
        <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-muted">
      <Image src={item.url} alt={item.alt} fill sizes="200px" className="object-cover" />
    </div>
  );
}
