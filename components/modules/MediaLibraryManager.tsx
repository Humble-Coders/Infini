"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Copy,
  Check,
  Trash2,
  FileText,
  HardDrive,
  Layers,
  CheckCircle2,
  X,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export interface MediaAsset {
  id: string;
  filename: string;
  alt: string;
  url: string;
  category: "parts" | "drawings" | "documents";
  contentType: string;
  dimensions: string;
  sizeKb: number;
  uploadedAt: string;
}

const FALLBACK_ASSETS: MediaAsset[] = [
  {
    id: "med-1",
    filename: "gallery-01-turbine-ring.jpg",
    alt: "Aerospace turbine blisk ring after MMP superfinishing",
    url: "/images/placeholders/gallery-01-turbine-ring.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 284,
    uploadedAt: "12 Oct 2026",
  },
  {
    id: "med-2",
    filename: "gallery-02-spur-gear.jpg",
    alt: "Automotive transmission spur gear flank finish",
    url: "/images/placeholders/gallery-02-spur-gear.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 310,
    uploadedAt: "10 Oct 2026",
  },
  {
    id: "med-3",
    filename: "gallery-03-knee-implant.jpg",
    alt: "Medical CoCr knee femoral component mirror polish",
    url: "/images/placeholders/gallery-03-knee-implant.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 245,
    uploadedAt: "08 Oct 2026",
  },
  {
    id: "med-4",
    filename: "gallery-04-die-halves.jpg",
    alt: "Plastic injection mold cavity halves with polished ribs",
    url: "/images/placeholders/gallery-04-die-halves.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 298,
    uploadedAt: "05 Oct 2026",
  },
  {
    id: "med-5",
    filename: "gallery-05-carbide-drills.jpg",
    alt: "Solid carbide drills and endmill micro-honed cutting edges",
    url: "/images/placeholders/gallery-05-carbide-drills.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 270,
    uploadedAt: "03 Oct 2026",
  },
  {
    id: "med-6",
    filename: "gallery-06-additive-ring.jpg",
    alt: "Laser powder bed 3D printed additive lattice ring",
    url: "/images/placeholders/gallery-06-additive-ring.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1600 x 1067",
    sizeKb: 340,
    uploadedAt: "01 Oct 2026",
  },
  {
    id: "med-7",
    filename: "process-01-bevel-pinion.jpg",
    alt: "Bevel pinion gear tooth roughness before and after MMP",
    url: "/images/placeholders/process-01-bevel-pinion.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1200 x 800",
    sizeKb: 195,
    uploadedAt: "28 Sep 2026",
  },
  {
    id: "med-8",
    filename: "process-02-turbo-wheels.jpg",
    alt: "Dual turbo compressor wheels comparison",
    url: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    category: "parts",
    contentType: "image/jpeg",
    dimensions: "1200 x 800",
    sizeKb: 215,
    uploadedAt: "25 Sep 2026",
  },
  {
    id: "med-9",
    filename: "iso-9001-2015-certificate.pdf",
    alt: "TUV SUD ISO 9001:2015 official accredited certificate",
    url: "/docs/iso-9001-2015-infini.pdf",
    category: "documents",
    contentType: "application/pdf",
    dimensions: "PDF Document",
    sizeKb: 1420,
    uploadedAt: "15 Jan 2026",
  },
  {
    id: "med-10",
    filename: "as9100d-aerospace-certificate.pdf",
    alt: "Bureau Veritas AS9100D aerospace quality document",
    url: "/docs/as9100d-aerospace-infini.pdf",
    category: "documents",
    contentType: "application/pdf",
    dimensions: "PDF Document",
    sizeKb: 1890,
    uploadedAt: "10 Mar 2026",
  },
];

export function MediaLibraryManager({ initialAssets }: { initialAssets?: MediaAsset[] } = {}) {
  const [assets, setAssets] = useState<MediaAsset[]>(() => initialAssets && initialAssets.length > 0 ? initialAssets : FALLBACK_ASSETS);
  const [loading, setLoading] = useState(!initialAssets || initialAssets.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "parts" | "drawings" | "documents">("all");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media from API route
  const fetchAssets = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.assets) && data.assets.length > 0) {
          setAssets(data.assets);
        }
      }
    } catch (err) {
      console.warn("[MediaLibraryManager] Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (initialAssets) return;
    fetchAssets(true);
  }, [fetchAssets, initialAssets]);

  // Read file as Base64 Data URL and measure dimensions
  const processFile = async (file: File): Promise<{
    url: string;
    dimensions: string;
    category: "parts" | "drawings" | "documents";
  }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const isDrawing = /cad|drawing|schematic|blueprint|dwg|dxf/i.test(file.name);
      const category: "parts" | "drawings" | "documents" = isPdf
        ? "documents"
        : isDrawing
        ? "drawings"
        : "parts";

      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (isPdf) {
          resolve({
            url: dataUrl,
            dimensions: "PDF Document",
            category: "documents",
          });
        } else {
          const img = new Image();
          img.onload = () => {
            resolve({
              url: dataUrl,
              dimensions: `${img.naturalWidth} x ${img.naturalHeight}`,
              category,
            });
          };
          img.onerror = () => {
            resolve({
              url: dataUrl,
              dimensions: "Uploaded Graphic",
              category,
            });
          };
          img.src = dataUrl;
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Upload handler
  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadStatus(`Encoding and synchronizing ${files.length} file${files.length > 1 ? "s" : ""}...`);

    const fileList = Array.from(files);
    let successCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Size check (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 25MB limit.`);
        continue;
      }

      try {
        setUploadStatus(`Uploading ${file.name} (${i + 1}/${fileList.length})...`);
        const { url, dimensions, category } = await processFile(file);

        const payload = {
          filename: file.name,
          alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          url,
          category,
          contentType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
          dimensions,
          sizeKb: Math.max(1, Math.round(file.size / 1024)),
        };

        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.asset) {
            setAssets((prev) => [data.asset, ...prev.filter((a) => a.id !== data.asset.id)]);
            successCount++;
          }
        } else {
          toast.error(`Server error uploading ${file.name}`);
        }
      } catch (err) {
        console.error("Upload error for file:", file.name, err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      setUploadStatus(`Synchronized ${successCount} asset${successCount > 1 ? "s" : ""} across cloud database.`);
      toast.success(`Successfully uploaded and synced ${successCount} file${successCount > 1 ? "s" : ""}!`);
      setTimeout(() => setUploadStatus(null), 4000);
    } else {
      setUploadStatus(null);
    }
  }

  // Deletion handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this media asset?")) return;

    try {
      const res = await fetch(`/api/admin/media?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        if (selectedAsset?.id === id) setSelectedAsset(null);
        toast.success("Media asset permanently removed.");
      } else {
        toast.error("Failed to delete asset from server.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Network error deleting asset.");
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("Asset URL copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredAssets = assets.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" ? true : item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalBytes = assets.reduce((sum, item) => sum + (item.sizeKb || 0), 0);
  const totalMb = (totalBytes / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Website Content</span>
            <span>/</span>
            <span className="text-foreground">Asset Repository</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Media & Engineering Files
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Synced
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized cloud repository for high-resolution component micrographs, part photographs, engineering drawings, and ISO compliance PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchAssets(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 text-xs font-medium text-foreground hover:border-accent/60 transition-colors backdrop-blur-sm disabled:opacity-50"
            title="Reload from Cloud Database"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin text-accent" : "text-muted-foreground"}`} />
            <span>{refreshing ? "Syncing..." : "Sync Cloud"}</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-md hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="size-3.5 animate-spin" /> : <UploadCloud className="size-3.5" />}
            <span>{isUploading ? "Uploading..." : "Upload Asset"}</span>
          </button>
        </div>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Assets
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <ImageIcon className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {assets.length}
            </span>
            <span className="text-xs text-muted-foreground">files cataloged</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Storage Used
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <HardDrive className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {totalMb} MB
            </span>
            <span className="text-xs text-muted-foreground">cloud assets</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Micrographs & Photos
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Layers className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {assets.filter((a) => a.category === "parts" || a.category === "drawings").length}
            </span>
            <span className="text-xs text-muted-foreground">photos & CAD</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              PDF Documents
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <FileText className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {assets.filter((a) => a.category === "documents").length}
            </span>
            <span className="text-xs text-muted-foreground">ISO & specs</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
          isDragOver
            ? "border-accent bg-accent/10 scale-[1.005]"
            : "border-border/70 bg-card/30 hover:border-accent/50 hover:bg-card/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 transition-transform">
          {isUploading ? <Loader2 className="size-7 animate-spin" /> : <UploadCloud className="size-7" />}
        </div>
        <div className="mt-3 text-sm font-semibold text-foreground">
          Drop component micrographs, CAD drawings, or ISO certificates here
        </div>
        <p className="mt-1 text-xs text-muted-foreground max-w-md">
          Supports JPEG, PNG, WebP, SVG micrographs up to 25MB, and PDF compliance documents. Synchronized globally across all client portals.
        </p>

        {uploadStatus ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-mono text-emerald-400 animate-in fade-in">
            {isUploading ? <Loader2 className="size-4 animate-spin text-accent" /> : <CheckCircle2 className="size-4" />}
            <span>{uploadStatus}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="mt-4 rounded-xl border border-border/80 bg-card/80 px-4 py-2 text-xs font-medium text-foreground hover:border-accent transition-colors shadow-sm disabled:opacity-50"
          >
            Select Files from Disk
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/40 p-3 backdrop-blur-md">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by filename or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background/50 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {(["all", "parts", "drawings", "documents"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                categoryFilter === cat
                  ? "bg-accent/15 text-accent border border-accent/30 font-semibold"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {cat === "parts"
                ? "Micrographs & Parts"
                : cat === "drawings"
                ? "CAD & Schematics"
                : cat === "documents"
                ? "PDF Docs"
                : "All Media"}
            </button>
          ))}
        </div>
      </div>

      {/* Media Bento Grid */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <Loader2 className="size-8 text-accent animate-spin mb-3" />
          <p className="text-xs font-mono text-muted-foreground">Loading asset library from cloud...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isPdf = asset.contentType === "application/pdf" || asset.filename.endsWith(".pdf");
            return (
              <div
                key={asset.id}
                onClick={() => setSelectedAsset(asset)}
                className="group relative cursor-pointer flex flex-col rounded-2xl border border-border/70 bg-card/40 p-2.5 backdrop-blur-md transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Media Preview Box */}
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-background/60 flex items-center justify-center border border-border/30">
                  {isPdf ? (
                    <div className="flex flex-col items-center gap-2 text-accent p-4 text-center">
                      <FileText className="size-10" />
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                        PDF DOC
                      </span>
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.alt}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}

                  {/* Category Pill */}
                  <span className="absolute top-2 left-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/40 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground uppercase">
                    {asset.category}
                  </span>

                  {/* Hover overlay with copy and delete */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUrl(asset.url, asset.id);
                      }}
                      className="rounded-lg bg-card/90 p-2 text-foreground hover:text-accent shadow-sm transition-transform active:scale-95"
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(asset.id);
                      }}
                      className="rounded-lg bg-card/90 p-2 text-foreground hover:text-destructive shadow-sm transition-transform active:scale-95"
                      title="Delete Asset"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filename and details */}
                <div className="mt-2.5 px-1 pb-1">
                  <div className="truncate text-xs font-semibold text-foreground" title={asset.filename}>
                    {asset.filename}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mt-1">
                    <span>{asset.sizeKb} KB</span>
                    <span>{asset.dimensions}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAssets.length === 0 && (
            <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
              <ImageIcon className="mx-auto size-10 text-muted-foreground/50 mb-2" />
              <div className="text-sm font-semibold text-foreground">
                No matching media found
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Try refining your search query or switch categories.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden animate-in fade-in">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  {selectedAsset.contentType === "application/pdf" ? (
                    <FileText className="size-4" />
                  ) : (
                    <ImageIcon className="size-4" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground truncate max-w-xs">
                  {selectedAsset.filename}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Preview Box */}
              <div className="aspect-video w-full rounded-xl bg-card/40 border border-border/60 flex items-center justify-center overflow-hidden relative group">
                {selectedAsset.contentType === "application/pdf" ? (
                  <div className="flex flex-col items-center gap-2 text-accent p-6">
                    <FileText className="size-16" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider">PDF Compliance Document</span>
                    <a
                      href={selectedAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-accent/15 border border-accent/30 px-3 py-1.5 text-xs font-mono text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <ExternalLink className="size-3.5" />
                      <span>Open Document in Browser</span>
                    </a>
                  </div>
                ) : (
                  <>
                    <img
                      src={selectedAsset.url}
                      alt={selectedAsset.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                    <a
                      href={selectedAsset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-3 rounded-lg bg-background/80 backdrop-blur-md border border-border/70 p-2 text-foreground hover:text-accent shadow-md transition-all"
                      title="View Full Image in New Tab"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                  </>
                )}
              </div>

              {/* Details table */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-3 space-y-2 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">Alt Description:</span>
                  <span className="text-foreground text-right max-w-xs font-medium">{selectedAsset.alt}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="capitalize font-mono text-accent">{selectedAsset.category}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">MIME Type:</span>
                  <span className="font-mono text-foreground">{selectedAsset.contentType}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-mono text-foreground">{selectedAsset.sizeKb} KB</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="font-mono text-foreground">{selectedAsset.dimensions}</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span className="font-mono text-foreground">{selectedAsset.uploadedAt}</span>
                </div>
              </div>

              {/* URL and copy */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                  Asset URL / Base64 Resource
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs font-mono text-foreground focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-md hover:bg-accent/90 shrink-0 transition-colors"
                  >
                    {copiedId === selectedAsset.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{copiedId === selectedAsset.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-border/60 shrink-0 bg-background/95">
              <button
                type="button"
                onClick={() => handleDelete(selectedAsset.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Asset</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="rounded-xl border border-border px-4 py-1.5 text-xs font-medium text-foreground hover:bg-card transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
