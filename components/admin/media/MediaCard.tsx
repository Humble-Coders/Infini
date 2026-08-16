"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { WithId, MediaDoc } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { MediaThumbnail } from "@/components/admin/media/MediaThumbnail";
import { findMediaReferences } from "@/lib/data/mediaReferences";
import { deleteMediaDoc } from "@/lib/data/media";
import { deleteMediaFile } from "@/lib/storage/uploadMediaFile";

interface MediaCardProps {
  item: WithId<MediaDoc>;
  onEdit?: (item: WithId<MediaDoc>) => void;
  onDeleted?: (id: string) => void;
  onSelect?: (item: WithId<MediaDoc>) => void;
}

/** variant is implied by which callbacks are passed: onSelect -> MediaPicker's "choose existing"; onEdit/onDeleted -> the manage screen. */
export function MediaCard({ item, onEdit, onDeleted, onSelect }: MediaCardProps) {
  const [checkingReferences, setCheckingReferences] = useState(false);
  const [referenceWarning, setReferenceWarning] = useState<string | null>(null);

  async function checkReferencesThenDelete() {
    await deleteMediaDoc(item.id);
    await deleteMediaFile(item.path);
    onDeleted?.(item.id);
  }

  async function handleDeleteTriggerOpen() {
    setCheckingReferences(true);
    try {
      const references = await findMediaReferences(item.url);
      setReferenceWarning(
        references.length > 0
          ? `In use by ${references.length} item${references.length > 1 ? "s" : ""}: ${references.map((r) => r.title).join(", ")}. Deleting will leave those references broken.`
          : null
      );
    } catch {
      // Reference check failing shouldn't block delete entirely — just skip the warning.
      setReferenceWarning(null);
    } finally {
      setCheckingReferences(false);
    }
  }

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="group flex flex-col overflow-hidden rounded-lg border border-border text-left transition-colors hover:border-primary"
      >
        <MediaThumbnail item={item} />
        <div className="p-2">
          <p className="truncate text-xs font-medium text-foreground">{item.filename}</p>
        </div>
      </button>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border">
      <MediaThumbnail item={item} />
      <div className="flex flex-col gap-1 p-2">
        <p className="truncate text-xs font-medium text-foreground">{item.filename}</p>
        <p className="truncate text-xs text-muted-foreground">{item.alt}</p>
        <div className="mt-1 flex gap-1">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit?.(item)}>
            <Pencil className="size-3.5" aria-hidden="true" />
            Edit
          </Button>
          <DeleteConfirmDialog
            trigger={
              <Button type="button" variant="outline" size="sm" onClick={handleDeleteTriggerOpen} disabled={checkingReferences}>
                <Trash2 className="size-3.5" aria-hidden="true" />
                Delete
              </Button>
            }
            title={`Delete "${item.filename}"?`}
            description={referenceWarning ?? "This can't be undone."}
            onConfirm={checkReferencesThenDelete}
            successMessage="Media deleted."
          />
        </div>
      </div>
    </div>
  );
}
