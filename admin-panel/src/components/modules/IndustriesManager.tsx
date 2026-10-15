"use client";

import { useState, useRef } from "react";
import {
  Factory,
  CheckCircle2,
  Eye,
  EyeOff,
  Edit3,
  Save,
  Plus,
  Trash2,
  Layers,
  ExternalLink,
  ChevronRight,
  Shield,
  Search,
  UploadCloud,
  Image as ImageIcon,
} from "lucide-react";
import { GlowingBorderCard } from "@/components/ui/glowing-border-card";

export interface IndustryItem {
  id: string;
  slug: string;
  name: string;
  order: number;
  eyebrow: string;
  headline: string;
  subheadline: string;
  heroImage: string;
  overview: string;
  relevance: string;
  applications: string[];
  materials: string[];
  benefits: string[];
  published: boolean;
  seoTitle: string;
  seoDesc: string;
}

const DEFAULT_INDUSTRIES: IndustryItem[] = [
  {
    id: "ind-1",
    slug: "aerospace",
    name: "Aerospace & Defense",
    order: 1,
    eyebrow: "Flight-Critical Standards",
    headline: "Sub-Micron Precision on Complex Aerospace Geometry",
    subheadline: "Turbine blades, compressor blisks, and fuel injection nozzles treated with zero distortion of aerodynamic profiles.",
    heroImage: "/images/placeholders/gallery-01-turbine-ring.jpg",
    overview: "Extreme operating temperatures and rotational forces demand surface topography free from micro-notches, stress risers, and residual abrasive grains.",
    relevance: "Micro Machining Process (MMP) extends high-cycle fatigue life and reduces skin friction drag on critical turbine components.",
    applications: ["Compressor Blisks", "Turbine Blades", "Fuel Injectors", "Hydraulic Actuators", "Landing Gear Pivots"],
    materials: ["Inconel 718", "Titanium Ti-6Al-4V", "Waspaloy", "Maraging Steel"],
    benefits: ["Sub-micron Ra down to 0.04 um", "Preserves aerodynamic edge radii", "Zero micro-crack propagation", "100% abrasive-free finish"],
    published: true,
    seoTitle: "Aerospace Surface Finishing | Infini",
    seoDesc: "High-precision surface finishing for turbine blades, blisks, and aerospace components.",
  },
  {
    id: "ind-2",
    slug: "medical-implants",
    name: "Medical Implants",
    order: 2,
    eyebrow: "Biocompatible Purity",
    headline: "Mirror-Finished Implants with Traceable Quality Control",
    subheadline: "Hip stems, knee femoral heads, and spinal screws finished to cleanroom standards without embedding media.",
    heroImage: "/images/placeholders/gallery-03-knee-implant.jpg",
    overview: "Orthopedic implants need flawless, isotropic finishes to prevent tissue inflammation, maximize joint mobility, and ensure smooth articulation.",
    relevance: "MMP ensures batch-to-batch repeatability and leaves zero embedded foreign media, complying with stringent ISO 13485 requirements.",
    applications: ["Knee Femoral Components", "Hip Stems and Balls", "Spinal Cages", "Bone Screws and Plates", "Dental Abutments"],
    materials: ["CoCrMo Alloys", "Titanium Grade 5", "PEEK (Polyether ether ketone)", "316L Medical Stainless"],
    benefits: ["Ra down to 0.01 um mirror finish", "100% bio-inert surface integrity", "Eliminates manual polishing variance", "Consistent articulation wear rate"],
    published: true,
    seoTitle: "Medical Implant Surface Finishing | Infini",
    seoDesc: "Cleanroom-grade surface finishing for orthopedic implants, dental prosthetics, and surgical instruments.",
  },
  {
    id: "ind-3",
    slug: "cutting-tools",
    name: "Cutting Tools & Inserts",
    order: 3,
    eyebrow: "Tooling Life Extension",
    headline: "Extend Carbide Cutting Tool Longevity by Up to 300%",
    subheadline: "Micro-honed flutes and edge preparation that eliminate chip packing and coating delamination.",
    heroImage: "/images/placeholders/gallery-05-carbide-drills.jpg",
    overview: "Flute friction directly translates to heat buildup, built-up edge (BUE), and catastrophic premature fracture during high-speed CNC milling.",
    relevance: "Controlled micro-finishing before and after PVD coating dramatically reduces sliding friction and stabilizes cutting edge geometry.",
    applications: ["Solid Carbide Endmills", "Step Drills", "Hob Cutters", "Thread Mills", "Indexable Inserts"],
    materials: ["Tungsten Carbide", "High Speed Steel (HSS-E)", "Cermet", "PCD Polycrystalline Diamond"],
    benefits: ["3x tool life enhancement", "Flawless chip evacuation", "Uniform coating adhesion", "Prevents micro-chipping under high feed"],
    published: true,
    seoTitle: "Cutting Tool Micro-Finishing | Infini",
    seoDesc: "Controlled micro-honing and polishing for carbide drills, endmills, and gear hobs.",
  },
  {
    id: "ind-4",
    slug: "plastic-injection-molds",
    name: "Plastic Injection Molds",
    order: 4,
    eyebrow: "Demolding Perfection",
    headline: "Optical Mold Cavities with Effortless Part Release",
    subheadline: "Deep ribs, textured cavities, and core pins polished uniformly without rounding delicate parting lines.",
    heroImage: "/images/placeholders/gallery-04-die-halves.jpg",
    overview: "Manual stoning and diamond lapping of complex injection molds consume weeks of skilled toolmaker hours and risk eroding sharp shut-offs.",
    relevance: "MMP penetrates deep crevices and complex 3D profiles simultaneously, achieving high-gloss or optical finishes while maintaining sharp parting lines.",
    applications: ["Automotive Lighting Lenses", "Medical Syringe Molds", "Precision Connectors", "Packaging Preforms", "Closure Caps"],
    materials: ["Stavax ESR", "Orvar Supreme", "P20 Tool Steel", "Beryllium Copper"],
    benefits: ["Reduces demolding force by 40%", "Slashes manual benching time by 75%", "Eliminates flow lines and drag marks", "Protects critical parting edges"],
    published: true,
    seoTitle: "Injection Mold Cavity Polishing | Infini",
    seoDesc: "Automated cavity polishing for plastic injection molds and optical tooling.",
  },
  {
    id: "ind-5",
    slug: "gears-transmission",
    name: "Gears & Transmission",
    order: 5,
    eyebrow: "Silent Drivetrains",
    headline: "Eliminate Gear Whine and Micropitting in EV Drivetrains",
    subheadline: "Superfinishing gear tooth flanks to create uniform isotropic micro-reservoirs for hydrodynamic lubrication.",
    heroImage: "/images/placeholders/gallery-02-spur-gear.jpg",
    overview: "Electric vehicles lack internal combustion noise, making gear mesh whine unacceptable to passengers. Surface asperities cause early micropitting under high EV torque.",
    relevance: "MMP achieves an isotropic finish across root fillets and active pitch lines, lowering operating temperatures and eliminating noise vibration harshness (NVH).",
    applications: ["EV Reduction Pinions", "Hypoid Ring Gears", "Helical Transmission Gears", "Planet Gears", "Spline Shafts"],
    materials: ["Case-Hardened 20MnCr5", "8620 Steel", "EN353", "Nitrided Steels"],
    benefits: ["Reduced NVH gear whine", "Elimination of micropitting", "Up to 5C reduction in oil sump temp", "Improved gear tooth bending fatigue"],
    published: true,
    seoTitle: "Gear Tooth Superfinishing | Infini",
    seoDesc: "Isotropic gear tooth polishing for EV gearboxes, industrial gearheads, and transmission sets.",
  },
  {
    id: "ind-6",
    slug: "additive-manufacturing",
    name: "Additive Manufacturing (3D Printing)",
    order: 6,
    eyebrow: "Powder-to-Part Perfection",
    headline: "Smoothing As-Printed Metal AM Surfaces Down to Spec",
    subheadline: "Internal fluid channels and organic lattice structures smoothed without degrading dimensional tolerances.",
    heroImage: "/images/placeholders/gallery-06-additive-ring.jpg",
    overview: "Laser Powder Bed Fusion (LPBF) and DMLS leave partially sintered powder particles and stepped layer lines (Ra 8 to 15 um) that severely impair fatigue life.",
    relevance: "MMP eliminates step layers and removes partially melted satellites without eroding thin thin-wall lattice geometries.",
    applications: ["Conformal Cooling Cores", "Heat Exchangers", "Lightweight Aerospace Brackets", "Custom Bone Scaffolds", "Manifolds"],
    materials: ["AlSi10Mg", "Inconel 625", "Scalmalloy", "Ti-6Al-4V ELI"],
    benefits: ["Ra reduced from 12 um to 0.1 um", "Cleans internal channels", "Drastic improvement in fatigue limit", "No abrasive entrapment in lattices"],
    published: true,
    seoTitle: "Additive Manufacturing Surface Smoothing | Infini",
    seoDesc: "Post-processing surface refinement for 3D printed metal parts and DMLS components.",
  },
  {
    id: "ind-7",
    slug: "forge-stamping-die",
    name: "Forging & Stamping Dies",
    order: 7,
    eyebrow: "Die Longevity",
    headline: "Extended Tool Life in Hot Forging and Cold Stamping",
    subheadline: "Polishing die impressions to minimize material galling, heat checking, and premature thermal fatigue cracking.",
    heroImage: "/images/placeholders/gallery-05-carbide-drills.jpg",
    overview: "Extreme friction and thermal cycling in drop forging dies cause galling and die washing, resulting in frequent press downtime.",
    relevance: "MMP polished die surfaces resist thermal shock, promote scale release, and preserve forging tolerances over longer production runs.",
    applications: ["Drop Forging Dies", "Hot Stamping Punches", "Coining Tooling", "Extrusion Mandrels", "Trimming Dies"],
    materials: ["H13 Tool Steel", "DIN 1.2714", "D2 Cold Work Steel", "Tungsten Carbide Dies"],
    benefits: ["2x die campaign life", "Superior scale release", "Reduced press tonnage requirements", "Consistent component dimensions"],
    published: true,
    seoTitle: "Forging & Stamping Die Polishing | Infini",
    seoDesc: "Surface engineering and polishing for high-wear forging dies and stamping tools.",
  },
];

export function IndustriesManager() {
  const [industries, setIndustries] = useState<IndustryItem[]>(DEFAULT_INDUSTRIES);
  const [selectedSlug, setSelectedSlug] = useState<string>("aerospace");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const selected = industries.find((i) => i.slug === selectedSlug) || industries[0];
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    handleUpdateSelected({ heroImage: url });
  };

  const handleUpdateSelected = (updatedFields: Partial<IndustryItem>) => {
    setIndustries((prev) =>
      prev.map((ind) => (ind.slug === selected.slug ? { ...ind, ...updatedFields } : ind))
    );
  };

  const handleTogglePublish = (slug: string) => {
    setIndustries((prev) =>
      prev.map((ind) =>
        ind.slug === slug ? { ...ind, published: !ind.published } : ind
      )
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const [newAppInput, setNewAppInput] = useState("");
  const handleAddApp = () => {
    if (!newAppInput.trim()) return;
    handleUpdateSelected({
      applications: [...selected.applications, newAppInput.trim()],
    });
    setNewAppInput("");
  };

  const handleRemoveApp = (idx: number) => {
    handleUpdateSelected({
      applications: selected.applications.filter((_, i) => i !== idx),
    });
  };

  const [newMatInput, setNewMatInput] = useState("");
  const handleAddMaterial = () => {
    if (!newMatInput.trim()) return;
    handleUpdateSelected({
      materials: [...selected.materials, newMatInput.trim()],
    });
    setNewMatInput("");
  };

  const handleRemoveMaterial = (idx: number) => {
    handleUpdateSelected({
      materials: selected.materials.filter((_, i) => i !== idx),
    });
  };

  const totalPublished = industries.filter((i) => i.published).length;
  const totalApps = industries.reduce((acc, curr) => acc + curr.applications.length, 0);
  const totalMats = industries.reduce((acc, curr) => acc + curr.materials.length, 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Website Content</span>
            <span>/</span>
            <span className="text-foreground">Sectors & Capabilities</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Industries & Applications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control the dedicated landing pages, technical copy, alloy checklists, and benefits for each of the 7 core industrial sectors.
          </p>
        </div>

        {isSavedNotice && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-2 text-xs font-medium text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="size-4" />
            <span>Changes saved to local preview</span>
          </div>
        )}
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Industries
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Factory className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {industries.length}
            </span>
            <span className="text-xs text-muted-foreground">dedicated pages</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Published Live
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Eye className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">
              {totalPublished} / {industries.length}
            </span>
            <span className="text-xs text-muted-foreground">active routes</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Verified Applications
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Layers className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {totalApps}
            </span>
            <span className="text-xs text-muted-foreground">component types</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Treated Alloys
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Shield className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {totalMats}
            </span>
            <span className="text-xs text-muted-foreground">materials cataloged</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Sector Picker on Left, In-Depth Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Industry Selector List */}
        <div className="lg:col-span-4 rounded-2xl border border-border/70 bg-card/40 p-3 backdrop-blur-md space-y-2">
          <div className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Select Industrial Sector
          </div>
          {industries.map((ind) => {
            const isCurrent = ind.slug === selected.slug;
            return (
              <button
                key={ind.slug}
                onClick={() => setSelectedSlug(ind.slug)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl p-3 text-left transition-all ${
                  isCurrent
                    ? "bg-accent/15 border border-accent/40 shadow-sm"
                    : "hover:bg-card/60 border border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{ind.order}
                  </span>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {ind.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono truncate">
                      /industries/{ind.slug}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`size-2 rounded-full ${
                      ind.published ? "bg-emerald-400" : "bg-muted-foreground/40"
                    }`}
                  />
                  <ChevronRight
                    className={`size-3.5 transition-transform ${
                      isCurrent ? "text-accent translate-x-0.5" : "text-muted-foreground/40"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Sector Form Editor */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-8 rounded-2xl border border-border/70 bg-card/40 p-6 backdrop-blur-md space-y-6"
        >
          {/* Header of Active Editor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-accent">Sector #{selected.order}</span>
                <span className="text-border">•</span>
                <span className="text-xs font-mono text-muted-foreground">/industries/{selected.slug}</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-0.5">
                {selected.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleTogglePublish(selected.slug)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  selected.published
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-muted/40 text-muted-foreground border border-border"
                }`}
              >
                {selected.published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                <span>{selected.published ? "Published Live" : "Draft (Hidden)"}</span>
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90"
              >
                <Save className="size-3.5" />
                <span>Save Sector</span>
              </button>
            </div>
          </div>

          {/* Hero Section Copy */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span>1. Hero Banner Content</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                  Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={selected.eyebrow}
                  onChange={(e) => handleUpdateSelected({ eyebrow: e.target.value })}
                  className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-mono uppercase text-muted-foreground">
                    Hero Image
                  </label>
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
                  >
                    <UploadCloud className="size-3" />
                    <span>Upload from Device</span>
                  </button>
                </div>
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeroUpload}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selected.heroImage}
                    onChange={(e) => handleUpdateSelected({ heroImage: e.target.value })}
                    placeholder="/images/... or click upload"
                    className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                  {selected.heroImage && (
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-border/70 bg-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selected.heroImage}
                        alt={selected.name}
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={selected.headline}
                onChange={(e) => handleUpdateSelected({ headline: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                Subheadline
              </label>
              <textarea
                rows={2}
                value={selected.subheadline}
                onChange={(e) => handleUpdateSelected({ subheadline: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background/50 p-3 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Technical Scope & Relevance */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              2. Technical Scope & Why Surface Finish Matters
            </h3>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                Industry Overview
              </label>
              <textarea
                rows={3}
                value={selected.overview}
                onChange={(e) => handleUpdateSelected({ overview: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background/50 p-3 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-muted-foreground mb-1">
                Why MMP Matters in this Sector
              </label>
              <textarea
                rows={3}
                value={selected.relevance}
                onChange={(e) => handleUpdateSelected({ relevance: e.target.value })}
                className="w-full rounded-xl border border-border/70 bg-background/50 p-3 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Applications & Materials Multi-chips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
            {/* Typical Applications */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Typical Components & Applications
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[60px] p-2 rounded-xl border border-border/60 bg-background/30">
                {selected.applications.map((app, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 px-2.5 py-1 text-[11px] text-foreground"
                  >
                    <span>{app}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveApp(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Fuel Actuator Nozzles"
                  value={newAppInput}
                  onChange={(e) => setNewAppInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddApp();
                    }
                  }}
                  className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddApp}
                  className="rounded-xl bg-card border border-border px-3 text-xs font-medium text-foreground hover:border-accent"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Treated Alloys */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Treated Alloys & Materials
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[60px] p-2 rounded-xl border border-border/60 bg-background/30">
                {selected.materials.map((mat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] text-accent"
                  >
                    <span>{mat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(i)}
                      className="text-accent/60 hover:text-destructive"
                    >
                      <Trash2 className="size-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Inconel 625"
                  value={newMatInput}
                  onChange={(e) => setNewMatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMaterial();
                    }
                  }}
                  className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="rounded-xl bg-card border border-border px-3 text-xs font-medium text-foreground hover:border-accent"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="space-y-3 pt-4 border-t border-border/50">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
              Search Engine Optimization (SEO)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={selected.seoTitle}
                onChange={(e) => handleUpdateSelected({ seoTitle: e.target.value })}
                placeholder="SEO Meta Title"
                className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
              <input
                type="text"
                value={selected.seoDesc}
                onChange={(e) => handleUpdateSelected({ seoDesc: e.target.value })}
                placeholder="Meta Description"
                className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
