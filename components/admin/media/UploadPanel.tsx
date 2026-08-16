"use client";

import { useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/admin/FieldError";
import { Progress } from "@/components/ui/progress";
import { uploadMediaFile, MediaValidationError } from "@/lib/storage/uploadMediaFile";
import { createMedia } from "@/lib/data/media";
import type { WithId, MediaDoc } from "@/lib/types";
import { requireAuth } from "@/lib/firebase/requireAuth";

interface PendingFile {
  key: string;
  file: File;
  alt: string;
  touched: boolean;
  progress: number;
  status: "idle" | "uploading" | "error";
  error?: string;
}

/**
 * Drag-and-drop / multi-file upload. Save is blocked per-file without alt
 * text — the T8 acceptance criterion — enforced here before uploadMediaFile
 * is even called, and again in lib/data/media.ts's createMedia as a backstop.
 */
export function UploadPanel({ onUploaded }: { onUploaded: (item: WithId<MediaDoc>) => void }) {
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | File[]) {
    const next: PendingFile[] = Array.from(files).map((file) => ({
      key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      alt: "",
      touched: false,
      progress: 0,
      status: "idle",
    }));
    setPending((prev) => [...prev, ...next]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  }

  function updateFile(key: string, patch: Partial<PendingFile>) {
    setPending((prev) => prev.map((f) => (f.key === key ? { ...f, ...patch } : f)));
  }

  function removeFile(key: string) {
    setPending((prev) => prev.filter((f) => f.key !== key));
  }

  async function handleUpload(pendingFile: PendingFile) {
    if (!pendingFile.alt.trim()) {
      updateFile(pendingFile.key, { touched: true });
      return;
    }
    updateFile(pendingFile.key, { status: "uploading", progress: 0, error: undefined });
    try {
      const uploaded = await uploadMediaFile(pendingFile.file, (percent) => updateFile(pendingFile.key, { progress: percent }));
      const user = requireAuth().currentUser;
      const created = await createMedia({ ...uploaded, alt: pendingFile.alt, uploadedBy: user?.uid ?? "" });
      toast.success(`"${created.filename}" uploaded.`);
      onUploaded(created);
      removeFile(pendingFile.key);
    } catch (err) {
      const message = err instanceof MediaValidationError ? err.message : err instanceof Error ? err.message : "Upload failed.";
      updateFile(pendingFile.key, { status: "error", error: message });
      toast.error(message);
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-primary bg-accent/10" : "border-border"
        }`}
      >
        <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-foreground">Drag files here, or click to browse</p>
        <p className="text-xs text-muted-foreground">Images up to 10MB, PDFs up to 20MB. Large photos are compressed automatically.</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {pending.length > 0 && (
        <ul className="space-y-3">
          {pending.map((pendingFile) => (
            <li key={pendingFile.key} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-medium text-foreground">{pendingFile.file.name}</p>
                <Label htmlFor={`alt-${pendingFile.key}`} className="sr-only">
                  Alt text for {pendingFile.file.name}
                </Label>
                <Input
                  id={`alt-${pendingFile.key}`}
                  placeholder="Alt text (required)"
                  value={pendingFile.alt}
                  disabled={pendingFile.status === "uploading"}
                  onChange={(e) => updateFile(pendingFile.key, { alt: e.target.value, touched: true })}
                />
                {pendingFile.touched && !pendingFile.alt.trim() && <FieldError message="Alt text is required." />}
                {pendingFile.status === "uploading" && <Progress value={pendingFile.progress} />}
                {pendingFile.status === "error" && <FieldError message={pendingFile.error} />}
              </div>
              <div className="flex shrink-0 gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleUpload(pendingFile)}
                  disabled={pendingFile.status === "uploading"}
                >
                  {pendingFile.status === "uploading" ? "Uploading…" : "Upload"}
                </Button>
                <Button type="button" size="icon" variant="ghost" onClick={() => removeFile(pendingFile.key)} disabled={pendingFile.status === "uploading"}>
                  <X className="size-4" aria-hidden="true" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
