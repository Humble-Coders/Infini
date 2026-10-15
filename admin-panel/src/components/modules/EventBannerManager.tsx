"use client";

import { useState } from "react";
import {
  CalendarDays,
  Check,
  Eye,
  EyeOff,
  Save,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  Radio,
  Palette,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";

export interface EventBannerConfig {
  enabled: boolean;
  badge: string;
  title: string;
  location: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  startDate: string;
  endDate: string;
  theme: "red" | "dark" | "gold";
}

const INITIAL_CONFIG: EventBannerConfig = {
  enabled: true,
  badge: "Upcoming Exhibition",
  title: "EMO Hannover 2026",
  location: "Hannover, Germany (Hall 11, Booth D32)",
  subtitle: "Visit INFINI at Hall 11, Booth D32 for live MMP precision surface finishing demonstrations",
  ctaText: "Schedule Technical Meeting",
  ctaUrl: "/contact",
  startDate: "2026-09-18",
  endDate: "2026-09-23",
  theme: "red",
};

export function EventBannerManager() {
  const [config, setConfig] = useState<EventBannerConfig>(INITIAL_CONFIG);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Exhibition & Announcement Banner
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure the live website exhibition marquee, booth location coordinates, and global announcement banner.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-sm hover:bg-accent/90 transition-colors self-start sm:self-auto"
        >
          {saved ? (
            <>
              <Check className="size-3.5" />
              <span>Published to Site</span>
            </>
          ) : (
            <>
              <Save className="size-3.5" />
              <span>Save & Publish</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Event */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Featured Event
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <CalendarDays className="size-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-foreground truncate block">
              {config.title}
            </span>
            <span className="text-xs text-muted-foreground">{config.badge}</span>
          </div>
        </div>

        {/* Live Banner Status */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Banner Status
            </span>
            <span className={`flex size-8 items-center justify-center rounded-xl border ${
              config.enabled
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}>
              {config.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </span>
          </div>
          <div className="mt-3">
            <span className={`text-lg font-bold font-mono ${config.enabled ? "text-emerald-400" : "text-amber-400"}`}>
              {config.enabled ? "Live on Site" : "Hidden"}
            </span>
            <span className="text-xs text-muted-foreground block">
              {config.enabled ? "Visible to all visitors" : "Draft mode (not visible)"}
            </span>
          </div>
        </div>

        {/* Exhibition Dates */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Event Window
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Clock className="size-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-foreground font-mono">
              18 - 23 Sep 2026
            </span>
            <span className="text-xs text-muted-foreground block">EMO Hannover schedule</span>
          </div>
        </div>

        {/* Booth Coordinates */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Exhibition Booth
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <MapPin className="size-4" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-foreground truncate block">
              Hall 11, Booth D32
            </span>
            <span className="text-xs text-muted-foreground">Hannover, Germany</span>
          </div>
        </div>
      </div>

      {/* Live Website Preview Box */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            <Sparkles className="size-3.5 text-accent" />
            Live Website Preview
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            {config.enabled ? "Status: Displaying to Visitors" : "Status: Hidden"}
          </span>
        </div>

        {config.enabled ? (
          <div
            className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
              config.theme === "red"
                ? "border-accent/40 bg-accent/10 text-foreground"
                : config.theme === "gold"
                ? "border-amber-500/40 bg-amber-500/10 text-foreground"
                : "border-neutral-700 bg-neutral-900/80 text-foreground"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium shrink-0 border ${
                    config.theme === "red"
                      ? "border-accent/40 bg-accent/20 text-accent"
                      : config.theme === "gold"
                      ? "border-amber-500/40 bg-amber-500/20 text-amber-400"
                      : "border-neutral-600 bg-neutral-800 text-neutral-300"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full animate-pulse ${
                      config.theme === "red"
                        ? "bg-accent"
                        : config.theme === "gold"
                        ? "bg-amber-400"
                        : "bg-neutral-300"
                    }`}
                  />
                  {config.badge}
                </span>
                <span className="text-sm font-bold text-foreground shrink-0">
                  {config.title}
                </span>
                <span className="text-muted-foreground/60 hidden sm:inline">•</span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {config.subtitle}
                </span>
              </div>

              {config.ctaText && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold shrink-0 self-start md:self-auto transition-colors ${
                    config.theme === "red"
                      ? "bg-accent text-accent-foreground shadow-sm shadow-accent/25"
                      : config.theme === "gold"
                      ? "bg-amber-500 text-black shadow-sm shadow-amber-500/25"
                      : "bg-white text-neutral-900 hover:bg-neutral-200"
                  }`}
                >
                  <span>{config.ctaText}</span>
                  <ArrowRight className="size-3" />
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-background/40 p-6 text-center text-xs text-muted-foreground">
            Banner is currently disabled. Toggle the visibility switch in the broadcast settings to activate.
          </div>
        )}
      </div>

      {/* Editor Controls Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Left Column: Exhibition & Banner Content */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <h2 className="text-sm font-semibold text-foreground">Exhibition & Banner Content</h2>
            <span className="text-[11px] font-mono text-muted-foreground">Copy & Text</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Banner Badge Category</label>
            <AdminSelect
              value={config.badge}
              onChange={(val) => setConfig({ ...config, badge: val })}
              options={[
                "Upcoming Exhibition",
                "Live Demonstration",
                "Technical Milestone",
                "Plant Open Day",
                "Important Announcement",
              ]}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Headline Title</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full rounded-xl border border-border/80 bg-card/70 px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none placeholder:text-muted-foreground"
              placeholder="e.g. EMO Hannover 2026"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Location & Booth Coordinates</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                type="text"
                value={config.location}
                onChange={(e) => setConfig({ ...config, location: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-card/70 pl-9 pr-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none placeholder:text-muted-foreground"
                placeholder="e.g. Hannover, Germany (Hall 11, Booth D32)"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Subheading Details</label>
            <textarea
              rows={3}
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              className="w-full rounded-xl border border-border/80 bg-card/70 px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none placeholder:text-muted-foreground resize-none"
              placeholder="Location, booth coordinates, or demonstration highlights"
            />
          </div>
        </div>

        {/* Right Column: Broadcast Rules & Schedule */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <h2 className="text-sm font-semibold text-foreground">Broadcast Rules & Schedule</h2>
            <span className="text-[11px] font-mono text-muted-foreground">Controls</span>
          </div>

          {/* Redesigned Prominent Visibility Switch */}
          <div className="rounded-xl border border-border/80 bg-background/70 p-4 transition-all">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Radio className={`size-3.5 ${config.enabled ? "text-emerald-400" : "text-muted-foreground"}`} />
                  <span className="text-xs font-semibold text-foreground">Public Broadcast</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                      config.enabled
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        config.enabled ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    {config.enabled ? "Live on Site" : "Draft / Hidden"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {config.enabled
                    ? "Exhibition announcement is publicly visible across header banners"
                    : "Banner is currently hidden from public site visitors"}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={config.enabled}
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 ${
                  config.enabled
                    ? "border-emerald-500/50 bg-emerald-500 shadow-md shadow-emerald-500/20"
                    : "border-border/80 bg-muted/70"
                }`}
              >
                <span
                  className={`inline-block size-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    config.enabled ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Redesigned Theme Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Palette className="size-3 text-accent" />
                <label className="text-xs font-medium text-foreground">Color Theme</label>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                Selected: {config.theme === "red" ? "Precision Red" : config.theme === "dark" ? "Dark Slate" : "Gold Accent"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Red Theme Card */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, theme: "red" })}
                className={`relative flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all border ${
                  config.theme === "red"
                    ? "border-accent bg-accent/15 ring-1 ring-accent/40 shadow-sm shadow-accent/20"
                    : "border-border/80 bg-background/50 hover:border-accent/40 hover:bg-card/70"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex size-5 items-center justify-center rounded-full bg-accent text-white shadow-sm">
                    <span className="size-2 rounded-full bg-white" />
                  </div>
                  {config.theme === "red" && <Check className="size-3.5 text-accent" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Precision Red</div>
                  <div className="text-[10px] text-muted-foreground">Primary marquee</div>
                </div>
              </button>

              {/* Dark Theme Card */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, theme: "dark" })}
                className={`relative flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all border ${
                  config.theme === "dark"
                    ? "border-neutral-400 bg-neutral-800/80 ring-1 ring-neutral-400/40 shadow-sm"
                    : "border-border/80 bg-background/50 hover:border-neutral-500 hover:bg-card/70"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex size-5 items-center justify-center rounded-full bg-neutral-700 border border-neutral-500 text-white shadow-sm">
                    <span className="size-2 rounded-full bg-neutral-300" />
                  </div>
                  {config.theme === "dark" && <Check className="size-3.5 text-neutral-300" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Dark Slate</div>
                  <div className="text-[10px] text-muted-foreground">Technical finish</div>
                </div>
              </button>

              {/* Gold Theme Card */}
              <button
                type="button"
                onClick={() => setConfig({ ...config, theme: "gold" })}
                className={`relative flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all border ${
                  config.theme === "gold"
                    ? "border-amber-500 bg-amber-500/15 ring-1 ring-amber-500/40 shadow-sm shadow-amber-500/20"
                    : "border-border/80 bg-background/50 hover:border-amber-500/40 hover:bg-card/70"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-black shadow-sm">
                    <span className="size-2 rounded-full bg-white" />
                  </div>
                  {config.theme === "gold" && <Check className="size-3.5 text-amber-400" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Gold Accent</div>
                  <div className="text-[10px] text-muted-foreground">Exhibition highlight</div>
                </div>
              </button>
            </div>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Start Date</label>
              <input
                type="date"
                value={config.startDate}
                onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-card/70 px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">End Date (Auto-expire)</label>
              <input
                type="date"
                value={config.endDate}
                onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-card/70 px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* CTA Button and Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Button Label</label>
              <input
                type="text"
                value={config.ctaText}
                onChange={(e) => setConfig({ ...config, ctaText: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-card/70 px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none placeholder:text-muted-foreground"
                placeholder="e.g. Schedule Meeting"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Destination URL</label>
              <input
                type="text"
                value={config.ctaUrl}
                onChange={(e) => setConfig({ ...config, ctaUrl: e.target.value })}
                className="w-full rounded-xl border border-border/80 bg-card/70 px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none placeholder:text-muted-foreground"
                placeholder="e.g. /contact or https://..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
