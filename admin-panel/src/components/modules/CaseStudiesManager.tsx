"use client";

import { useState, useRef } from "react";
import {
  BookOpen,
  Plus,
  Save,
  Link2,
  Check,
  TrendingDown,
  TrendingUp,
  UploadCloud,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  industry: string;
  challenge: string;
  solution: string;
  beforeRa: string;
  afterRa: string;
  toolLifeGain: string;
  beforeImage: string;
  afterImage: string;
  material: string;
  published: boolean;
  sourceUrl?: string;
}

const DEMO_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "cs-1",
    slug: "turbine-blisk-internal-passages",
    title: "Turbine Blisk Internal Passages Superfinishing",
    industry: "Aerospace",
    challenge:
      "Complex internal aerofoil cooling passages suffered from micro-scratches and recast layer following EDM, creating stress concentrations.",
    solution:
      "Multi-axis selective MMP formulation filtered high-frequency surface wave-lengths without eroding leading edge tolerances.",
    beforeRa: "0.80 µm",
    afterRa: "0.03 µm",
    toolLifeGain: "+280% Fatigue Life",
    beforeImage: "/images/cutting-tool-1.jpg",
    afterImage: "/images/cutting-tool-3.png",
    material: "Inconel 718",
    published: true,
  },
  {
    id: "cs-2",
    slug: "carbide-gun-drills-edge-honing",
    title: "Solid Carbide Gun Drills Edge Honing",
    industry: "Cutting Tools",
    challenge:
      "Micro-chipping on cutting edges led to premature tool failure during deep hole automotive crankshaft drilling.",
    solution:
      "Controlled MMP micro-edge honing imparted an exact 15 µm symmetric edge radius while polishing flutes to mirror brilliance.",
    beforeRa: "0.45 µm",
    afterRa: "0.02 µm",
    toolLifeGain: "+320% Tool Life",
    beforeImage: "/images/cutting-tool-2.png",
    afterImage: "/images/cutting-tool-3.png",
    material: "Tungsten Carbide",
    published: true,
  },
];

function generateCaseStudyId(): string {
  return `cs-${Date.now()}`;
}

export function CaseStudiesManager() {
  const [studies, setStudies] = useState<CaseStudyItem[]>(DEMO_CASE_STUDIES);
  const [selected, setSelected] = useState<CaseStudyItem>(DEMO_CASE_STUDIES[0]);
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(type: "before" | "after", e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSelected((prev) => ({
      ...prev,
      [type === "before" ? "beforeImage" : "afterImage"]: url,
    }));
  }

  function parseSlugFromUrl(urlStr: string): { title: string; industry: string; material: string } {
    try {
      const u = new URL(urlStr);
      const segments = u.pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1] || "";
      const cleaned = last
        .replace(/activity-\d+.*$/i, "")
        .replace(/urn:li:activity:\d+/i, "")
        .replace(/^infini-precision[_-]?/i, "")
        .replace(/[-_]+/g, " ")
        .trim();

      const title = cleaned.length > 3
        ? cleaned
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ")
        : "LinkedIn Application Brief";

      const lower = (title + " " + urlStr).toLowerCase();
      let industry = "Aerospace";
      let material = "Inconel 718";

      if (lower.includes("medical") || lower.includes("implant") || lower.includes("orthopedic")) {
        industry = "Medical";
        material = "Ti-6Al-4V ELI (Titanium)";
      } else if (lower.includes("gear") || lower.includes("automotive") || lower.includes("transmission")) {
        industry = "Automotive";
        material = "16MnCr5 Steel";
      } else if (lower.includes("tool") || lower.includes("carbide") || lower.includes("die") || lower.includes("mold")) {
        industry = "Cutting Tools";
        material = "Tungsten Carbide";
      }

      return { title, industry, material };
    } catch {
      return {
        title: "Precision MMP Application",
        industry: "Aerospace",
        material: "17-4 PH Stainless",
      };
    }
  }

  async function handleLinkedInSync() {
    if (!linkedInUrl.trim()) return;
    setSyncing(true);
    setSyncMessage(null);

    try {
      const res = await fetch("/api/admin/linkedin-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkedInUrl }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.study) {
        const item = data.study;
        const newStudy: CaseStudyItem = {
          id: generateCaseStudyId(),
          slug: item.slug,
          title: item.title,
          industry: item.industry,
          challenge: item.challenge,
          solution: item.solution,
          beforeRa: item.beforeRa,
          afterRa: item.afterRa,
          toolLifeGain: item.toolLifeGain,
          beforeImage: "/images/cutting-tool-1.jpg",
          afterImage: item.imageUrl || "/images/cutting-tool-3.png",
          material: item.material,
          published: true,
          sourceUrl: linkedInUrl,
        };
        setStudies((prev) => [newStudy, ...prev]);
        setSelected(newStudy);
        setSyncMessage(`Imported "${newStudy.title}"`);
        setLinkedInUrl("");
      } else {
        fallbackSync();
      }
    } catch {
      fallbackSync();
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  }

  function fallbackSync() {
    const { title, industry, material } = parseSlugFromUrl(linkedInUrl);
    const newStudy: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title,
      industry,
      challenge: `Component surface required ISO-certified Ra reduction and uniform micro-finishing for ${industry.toLowerCase()} applications.`,
      solution: "MMP precision surface treatment delivered isotropic mirror finish without compromising geometric tolerance.",
      beforeRa: "0.60 µm",
      afterRa: "0.03 µm",
      toolLifeGain: "+260% Cycle Life",
      beforeImage: "/images/cutting-tool-1.jpg",
      afterImage: "/images/cutting-tool-3.png",
      material,
      published: true,
      sourceUrl: linkedInUrl,
    };
    setStudies((prev) => [newStudy, ...prev]);
    setSelected(newStudy);
    setSyncMessage(`Imported "${title}"`);
    setLinkedInUrl("");
  }

  function handleCreateNew() {
    const newStudy: CaseStudyItem = {
      id: `cs-${Date.now()}`,
      slug: `study-${Date.now()}`,
      title: "New Precision Case Study",
      industry: "Aerospace",
      challenge: "Describe the initial friction, wear, or surface finish bottleneck...",
      solution: "Describe the MMP surface treatment process and key metallurgical outcomes...",
      beforeRa: "0.65 µm",
      afterRa: "0.02 µm",
      toolLifeGain: "+300% Tool Life",
      beforeImage: "/images/cutting-tool-1.jpg",
      afterImage: "/images/cutting-tool-3.png",
      material: "Inconel 718",
      published: true,
    };
    setStudies((prev) => [newStudy, ...prev]);
    setSelected(newStudy);
  }

  function handleDeleteSelected() {
    if (studies.length <= 1) return;
    const remaining = studies.filter((s) => s.id !== selected.id);
    setStudies(remaining);
    setSelected(remaining[0]);
  }

  function handleSave() {
    setSaved(true);
    setStudies((prev) =>
      prev.map((s) => (s.id === selected.id ? selected : s))
    );
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Case Studies & Proven Work
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage before and after surface roughness data, technical specifications, and LinkedIn imports.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs font-semibold text-foreground hover:border-accent transition-colors"
          >
            <Plus className="size-3.5 text-accent" />
            <span>New Study</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors"
          >
            {saved ? (
              <>
                <Check className="size-3.5" />
                <span>Saved to Site</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LinkedIn Auto-Sync Bar */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#0077b5]/15 text-[#0077b5] border border-[#0077b5]/30">
              <Link2 className="size-4" />
            </span>
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground">Import Case Study from LinkedIn</span>
              <p className="text-[11px] text-muted-foreground">
                Paste a LinkedIn post or article URL to extract case study details and micrographs
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="url"
              placeholder="https://www.linkedin.com/posts/infini-precision_..."
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              className="w-full sm:w-80 rounded-xl border border-border bg-input-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleLinkedInSync}
              disabled={syncing || !linkedInUrl.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0077b5] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#0077b5]/90 disabled:opacity-50 transition-colors shrink-0"
            >
              {syncing ? (
                <span>Extracting...</span>
              ) : (
                <>
                  <Sparkles className="size-3" />
                  <span>Sync Post</span>
                </>
              )}
            </button>
          </div>
        </div>

        {syncMessage && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-400 animate-in fade-in">
            <Check className="size-3.5" />
            <span>{syncMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Selector List Left + Editor Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Studies List (4 cols) */}
        <div className="space-y-3 lg:col-span-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-muted-foreground tracking-wider font-semibold block">
              Published Studies ({studies.length})
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">Click to edit</span>
          </div>

          <div className="space-y-2">
            {studies.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item)}
                className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                  selected.id === item.id
                    ? "border-accent bg-accent/10 shadow-sm"
                    : "border-border/80 bg-card/60 hover:bg-card hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-accent">
                    {item.industry}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {item.toolLifeGain}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-semibold text-foreground line-clamp-1">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="truncate max-w-[140px]">Alloy: {item.material}</span>
                  <span>Ra: {item.beforeRa} → {item.afterRa}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Editor (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent">Editor Mode</span>
                <h3 className="text-base font-bold text-foreground truncate max-w-md">{selected.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelected({ ...selected, published: !selected.published })}
                  className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition-colors ${
                    selected.published ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {selected.published ? "Published" : "Draft"}
                </button>

                {studies.length > 1 && (
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Delete this study"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Title & Industry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Project Title</label>
                <input
                  type="text"
                  value={selected.title}
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Industry Association</label>
                <AdminSelect
                  value={selected.industry}
                  onChange={(val) => setSelected({ ...selected, industry: val })}
                  options={[
                    { value: "Aerospace", label: "Aerospace" },
                    { value: "Cutting Tools", label: "Cutting Tools" },
                    { value: "Medical", label: "Medical Implants" },
                    { value: "Automotive", label: "Automotive & EV" },
                    { value: "Forge & Stamping Die", label: "Forge & Stamping Die" },
                    { value: "Plastic Injection Molds", label: "Plastic Injection Molds" },
                    { value: "Additive Manufacturing", label: "Additive Manufacturing" },
                    { value: "Gears & Transmission", label: "Gears & Transmission" },
                    { value: "Precision Engineering", label: "Precision Engineering" },
                  ]}
                />
              </div>
            </div>

            {/* Material & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Alloy / Base Material</label>
                <input
                  type="text"
                  value={selected.material}
                  onChange={(e) => setSelected({ ...selected, material: e.target.value })}
                  placeholder="e.g. Inconel 718, Ti-6Al-4V, Tungsten Carbide"
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">URL Slug</label>
                <input
                  type="text"
                  value={selected.slug}
                  onChange={(e) => setSelected({ ...selected, slug: e.target.value })}
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2 text-xs font-mono text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Metrics Triplet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-border bg-background/50 p-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="size-3 text-accent" />
                  Initial Roughness (Ra)
                </span>
                <input
                  type="text"
                  value={selected.beforeRa}
                  onChange={(e) => setSelected({ ...selected, beforeRa: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="size-3 text-emerald-400" />
                  Finished Target (Ra)
                </span>
                <input
                  type="text"
                  value={selected.afterRa}
                  onChange={(e) => setSelected({ ...selected, afterRa: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-400" />
                  Measured Gain / Life
                </span>
                <input
                  type="text"
                  value={selected.toolLifeGain}
                  onChange={(e) => setSelected({ ...selected, toolLifeGain: e.target.value })}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                />
              </div>
            </div>

            {/* Challenge & Solution */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">The Challenge</label>
                <textarea
                  rows={3}
                  value={selected.challenge}
                  onChange={(e) => setSelected({ ...selected, challenge: e.target.value })}
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">The MMP Solution</label>
                <textarea
                  rows={3}
                  value={selected.solution}
                  onChange={(e) => setSelected({ ...selected, solution: e.target.value })}
                  className="w-full rounded-xl border border-border bg-input-background px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Before and After Image Upload Slots with Direct Disk Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase font-semibold">
                    Before Treatment Photo
                  </span>
                  <button
                    type="button"
                    onClick={() => beforeFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-foreground hover:border-accent transition-colors"
                  >
                    <UploadCloud className="size-3 text-accent" />
                    <span>Upload</span>
                  </button>
                  <input
                    ref={beforeFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("before", e)}
                    className="hidden"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black/40">
                  <img src={selected.beforeImage} alt="Before treatment" className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-accent uppercase font-semibold">
                    After Treatment Photo (MMP)
                  </span>
                  <button
                    type="button"
                    onClick={() => afterFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[10px] text-foreground hover:border-accent transition-colors"
                  >
                    <UploadCloud className="size-3 text-accent" />
                    <span>Upload</span>
                  </button>
                  <input
                    ref={afterFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("after", e)}
                    className="hidden"
                  />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black/40">
                  <img src={selected.afterImage} alt="After treatment" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
