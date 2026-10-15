"use client";

import { useState, useRef } from "react";
import {
  Image as ImageIcon,
  UploadCloud,
  Search,
  Filter,
  Copy,
  Check,
  Trash2,
  Eye,
  FileText,
  HardDrive,
  Layers,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";

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

const DEFAULT_ASSETS: MediaAsset[] = [
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

export function MediaLibraryManager() {
  const [assets, setAssets] = useState<MediaAsset[]>(DEFAULT_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "parts" | "drawings" | "documents">("all");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newAssets: MediaAsset[] = [];
    Array.from(files).forEach((file, index) => {
      const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
      const category: MediaAsset["category"] = isPdf ? "documents" : "parts";
      const newAsset: MediaAsset = {
        id: `upload-${Date.now()}-${index}`,
        filename: file.name,
        alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        url: URL.createObjectURL(file),
        category,
        contentType: file.type || (isPdf ? "application/pdf" : "image/jpeg"),
        dimensions: isPdf ? "PDF Document" : "Uploaded Web Asset",
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
        uploadedAt: "Just now",
      };
      newAssets.push(newAsset);
    });
    setAssets((prev) => [...newAssets, ...prev]);
    setUploadStatus(`Added ${newAssets.length} file${newAssets.length > 1 ? "s" : ""} to asset repository.`);
    setTimeout(() => setUploadStatus(null), 3500);
  }

  const filteredAssets = assets.filter((item) => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" ? true : item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this media asset?")) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
    }
  };

  const totalBytes = assets.reduce((sum, item) => sum + item.sizeKb, 0);
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
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Media & Engineering Files
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Centralized library for high-resolution component micrographs, part photographs, engineering drawings, and ISO compliance PDFs.
          </p>
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
            <span className="text-xs text-muted-foreground">compressed web assets</span>
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
              {assets.filter((a) => a.category === "parts").length}
            </span>
            <span className="text-xs text-muted-foreground">high-res photos</span>
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
            ? "border-accent bg-accent/10"
            : "border-border/70 bg-card/30 hover:border-accent/50 hover:bg-card/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent group-hover:scale-110 transition-transform">
          <UploadCloud className="size-6" />
        </div>
        <div className="mt-3 text-sm font-semibold text-foreground">
          Drop component micrographs, CAD drawings, or ISO certificates here
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Supports JPEG, PNG, WebP up to 10MB; and PDF compliance documents up to 25MB.
        </p>

        {uploadStatus ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-mono text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="size-4" />
            <span>{uploadStatus}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground hover:border-accent transition-colors"
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
          {(["all", "parts", "documents"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                categoryFilter === cat
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {cat === "parts" ? "Micrographs & Parts" : cat === "documents" ? "PDF Docs" : "All Media"}
            </button>
          ))}
        </div>
      </div>

      {/* Media Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => {
          const isPdf = asset.contentType === "application/pdf";
          return (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group relative cursor-pointer flex flex-col rounded-2xl border border-border/70 bg-card/40 p-2.5 backdrop-blur-md transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Media Preview Box */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-background/60 flex items-center justify-center">
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
                  />
                )}

                {/* Hover overlay with copy */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyUrl(asset.url, asset.id);
                    }}
                    className="rounded-lg bg-card/90 p-2 text-foreground hover:text-accent shadow-sm"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(asset.id);
                    }}
                    className="rounded-lg bg-card/90 p-2 text-foreground hover:text-destructive shadow-sm"
                    title="Delete"
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
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <ImageIcon className="mx-auto size-8 text-muted-foreground/60" />
            <div className="mt-2 text-sm font-medium text-foreground">
              No media matches found
            </div>
          </div>
        )}
      </div>

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <ImageIcon className="size-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground truncate max-w-xs">
                  {selectedAsset.filename}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Preview */}
              <div className="aspect-video w-full rounded-xl bg-card/40 border border-border/60 flex items-center justify-center overflow-hidden">
                {selectedAsset.contentType === "application/pdf" ? (
                  <div className="flex flex-col items-center gap-2 text-accent">
                    <FileText className="size-12" />
                    <span className="text-xs font-mono font-bold uppercase">PDF Document</span>
                  </div>
                ) : (
                  <img
                    src={selectedAsset.url}
                    alt={selectedAsset.alt}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>

              {/* Details table */}
              <div className="rounded-xl border border-border/60 bg-card/30 p-3 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alt Description:</span>
                  <span className="text-foreground text-right max-w-xs">{selectedAsset.alt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MIME Type:</span>
                  <span className="font-mono text-foreground">{selectedAsset.contentType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size:</span>
                  <span className="font-mono text-foreground">{selectedAsset.sizeKb} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="font-mono text-foreground">{selectedAsset.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span className="font-mono text-foreground">{selectedAsset.uploadedAt}</span>
                </div>
              </div>

              {/* URL and copy */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                  Asset URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-md hover:bg-accent/90 shrink-0"
                  >
                    {copiedId === selectedAsset.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span>{copiedId === selectedAsset.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-border/60 shrink-0 bg-background/95">
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="rounded-xl border border-border px-4 py-1.5 text-xs font-medium text-foreground hover:bg-card"
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
