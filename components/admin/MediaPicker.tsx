"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/admin/EmptyState";
import { MediaCard } from "@/components/admin/media/MediaCard";
import { UploadPanel } from "@/components/admin/media/UploadPanel";
import { useMediaLibrary } from "@/components/admin/media/useMediaLibrary";
import type { WithId, MediaDoc } from "@/lib/types";

type Accept = "image" | "pdf" | "all";

/**
 * Reusable "choose existing or upload new" picker — the piece every future
 * content-CRUD ticket (T10–T16) drops in wherever it needs an image or
 * certificate PDF field. Standalone: owns its own open state, its own data
 * fetch, and doesn't assume anything about the calling form beyond onSelect.
 */
export function MediaPicker({
  trigger,
  accept = "image",
  onSelect,
}: {
  trigger: React.ReactNode;
  accept?: Accept;
  onSelect: (item: WithId<MediaDoc>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"browse" | "upload">("browse");
  const [search, setSearch] = useState("");
  const { items, state, refresh } = useMediaLibrary();

  const filtered = useMemo(() => {
    const byType = items.filter((item) => {
      if (accept === "all") return true;
      if (accept === "pdf") return item.contentType === "application/pdf";
      return item.contentType.startsWith("image/");
    });
    const term = search.trim().toLowerCase();
    if (!term) return byType;
    return byType.filter((item) => item.filename.toLowerCase().includes(term) || item.alt.toLowerCase().includes(term));
  }, [items, accept, search]);

  function handleSelect(item: WithId<MediaDoc>) {
    onSelect(item);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose media</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 border-b border-border pb-2">
          <Button type="button" variant={tab === "browse" ? "default" : "ghost"} size="sm" onClick={() => setTab("browse")}>
            Choose existing
          </Button>
          <Button type="button" variant={tab === "upload" ? "default" : "ghost"} size="sm" onClick={() => setTab("upload")}>
            Upload new
          </Button>
        </div>

        {tab === "browse" && (
          <div className="space-y-4">
            <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {state === "loading" && <p className="text-sm text-muted-foreground">Loading…</p>}
            {state === "error" && <p className="text-sm text-destructive">Couldn&apos;t load media.</p>}
            {state === "loaded" && filtered.length === 0 && <EmptyState title="Nothing here yet" description="Switch to Upload new to add one." />}
            {state === "loaded" && filtered.length > 0 && (
              <div className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
                {filtered.map((item) => (
                  <MediaCard key={item.id} item={item} onSelect={handleSelect} />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "upload" && (
          <UploadPanel
            onUploaded={(item) => {
              refresh();
              handleSelect(item);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
