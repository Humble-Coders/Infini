"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/admin/EmptyState";
import { MediaCard } from "@/components/admin/media/MediaCard";
import { EditMediaDialog } from "@/components/admin/media/EditMediaDialog";
import { useMediaLibrary } from "@/components/admin/media/useMediaLibrary";
import { UploadPanel } from "@/components/admin/media/UploadPanel";
import type { WithId, MediaDoc } from "@/lib/types";

export function MediaLibraryManager() {
  const { items, state, refresh } = useMediaLibrary();
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<WithId<MediaDoc> | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.filename.toLowerCase().includes(term) || item.alt.toLowerCase().includes(term));
  }, [items, search]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-foreground">Upload</h2>
        <UploadPanel onUploaded={refresh} />
      </section>

      <div>
        <Input
          placeholder="Search by filename or alt text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {state === "loading" && <p className="text-sm text-muted-foreground">Loading…</p>}
      {state === "error" && <p className="text-sm text-destructive">Couldn&apos;t load the media library. Refresh to try again.</p>}
      {state === "loaded" && filtered.length === 0 && (
        <EmptyState title={search ? "No matches" : "No media yet"} description={search ? "Try a different search term." : "Uploads appear here, newest first."} />
      )}
      {state === "loaded" && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} onEdit={setEditingItem} onDeleted={refresh} />
          ))}
        </div>
      )}

      <EditMediaDialog
        key={editingItem?.id}
        item={editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onSaved={refresh}
      />
    </div>
  );
}
