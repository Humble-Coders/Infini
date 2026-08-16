"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/admin/FieldError";
import { FormActions } from "@/components/admin/FormActions";
import { updateMedia } from "@/lib/data/media";
import type { WithId, MediaDoc } from "@/lib/types";

// Caller must remount this with `key={item?.id}` when the target item
// changes — that's what seeds fresh local state per item, rather than an
// effect racing a user's in-progress edit.
export function EditMediaDialog({
  item,
  onOpenChange,
  onSaved,
}: {
  item: WithId<MediaDoc> | null;
  onOpenChange: (open: boolean) => void;
  onSaved: (item: WithId<MediaDoc>) => void;
}) {
  const [alt, setAlt] = useState(item?.alt ?? "");
  const [filename, setFilename] = useState(item?.filename ?? "");
  const [altError, setAltError] = useState<string | null>(null);

  async function handleSave() {
    if (!item) return;
    if (!alt.trim()) {
      setAltError("Alt text is required.");
      throw new Error("Alt text is required.");
    }
    setAltError(null);
    await updateMedia(item.id, { alt, filename });
    onSaved({ ...item, alt, filename });
    onOpenChange(false);
  }

  return (
    <Dialog open={item !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit media</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="media-filename">Filename</Label>
            <Input id="media-filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="media-alt">Alt text</Label>
            <Input id="media-alt" value={alt} onChange={(e) => setAlt(e.target.value)} required />
            <FieldError message={altError ?? undefined} />
          </div>
        </div>
        <FormActions onSave={handleSave} onCancel={() => onOpenChange(false)} successMessage="Media updated." />
      </DialogContent>
    </Dialog>
  );
}
