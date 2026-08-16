"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Shared save/cancel row for every admin form. Disables both buttons and
 * shows progress during the async save, and always resolves to a toast —
 * per the ticket, no async action here fails silently.
 */
export function FormActions({
  onSave,
  onCancel,
  successMessage = "Saved.",
  saveLabel = "Save",
}: {
  onSave: () => Promise<void>;
  onCancel: () => void;
  successMessage?: string;
  saveLabel?: string;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave();
      toast.success(successMessage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
        Cancel
      </Button>
      <Button type="button" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : saveLabel}
      </Button>
    </div>
  );
}
