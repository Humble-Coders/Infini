"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * Shared delete-confirmation pattern for every admin CRUD screen — nothing
 * destructive should ever be one click. Shows pending state during the
 * async delete and a toast on success/error; stays open on error so the
 * user can retry instead of losing their place.
 */
export function DeleteConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  successMessage = "Deleted.",
}: {
  trigger: ReactNode;
  title: string;
  description: ReactNode;
  onConfirm: () => Promise<void>;
  successMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDeleting(true);
    try {
      await onConfirm();
      toast.success(successMessage);
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={deleting} className="bg-destructive text-destructive-foreground hover:opacity-90">
            {deleting ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
