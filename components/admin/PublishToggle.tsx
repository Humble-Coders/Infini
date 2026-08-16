"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/**
 * Shared publish/unpublish toggle for content CRUD screens. Optimistic UI
 * would risk showing "published" on a doc that failed to save, so this
 * waits for onChange to resolve before reflecting the new state, and reverts
 * with an error toast if the write fails.
 */
export function PublishToggle({
  id,
  published,
  onChange,
  disabled,
}: {
  id: string;
  published: boolean;
  onChange: (nextPublished: boolean) => Promise<void>;
  disabled?: boolean;
}) {
  const [pending, setPending] = useState(false);

  async function handleCheckedChange(checked: boolean) {
    setPending(true);
    try {
      await onChange(checked);
      toast.success(checked ? "Published." : "Unpublished.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update publish state.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={published} disabled={disabled || pending} onCheckedChange={handleCheckedChange} />
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {published ? "Published" : "Draft"}
      </Label>
    </div>
  );
}
