"use client";

import { useState, useRef } from "react";
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Globe,
  Share2,
  Check,
  Users,
  ShieldCheck,
  Building,
  UploadCloud,
  FileText,
} from "lucide-react";
import { TeamAccessManager } from "./TeamAccessManager";

export interface CompanySettings {
  primaryEmail: string;
  technicalPhone: string;
  dispatchPhone: string;
  plantAddress: string;
  googleMapsUrl: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  facebook: string;
  metaTitle: string;
  metaDescription: string;
  cookieBannerEnabled: boolean;
  logoUrl?: string;
  brochureUrl?: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  primaryEmail: "superfinish@infini.co.in",
  technicalPhone: "+91 (1792) 234459",
  dispatchPhone: "+91 1792 233216",
  plantAddress: "Treatment & validation labs, 1 Taksal Road, Parwanoo, Himachal Pradesh 173220, India",
  googleMapsUrl: "https://maps.google.com/maps?q=1%20Taksal%20Road%2C%20Parwanoo%2C%20Himachal%20Pradesh%20173220&z=14&output=embed",
  linkedin: "https://www.linkedin.com/in/infini-precision-private-limited-73b19921b/",
  twitter: "https://x.com/preision",
  instagram: "https://www.instagram.com/infiniprecisionpvt.ltd/?hl=en",
  youtube: "https://youtu.be/YKcmtDuxXks?si=btPyU3ZyS3xiqF5D",
  facebook: "https://www.facebook.com/profile.php?id=100064548354724",
  metaTitle: "INFINI | Precision Surface Finishing & MMP Technology",
  metaDescription: "Super precision surface finishing and micro-edge honing for aerospace, medical implants, cutting tools, and critical dies.",
  cookieBannerEnabled: true,
  logoUrl: "/brand/infini-finish-unlimited.png",
  brochureUrl: "/docs/infini-precision-capability-brochure.pdf",
};

export function CompanySettingsManager() {
  const [activeTab, setActiveTab] = useState<"company" | "team">("company");
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const brochureFileInputRef = useRef<HTMLInputElement>(null);

  useState(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSettings((prev) => ({ ...prev, logoUrl: url }));
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSettings((prev) => ({ ...prev, brochureUrl: url }));
  };

  async function handleSave() {
    setSaved(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch {
      alert("Failed to save settings to server.");
    } finally {
      setTimeout(() => setSaved(false), 2200);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Administration</span>
            <span>/</span>
            <span className="text-foreground">Settings & Team Access</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Settings & Access Control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update official company communication channels, Parwanoo plant address, social profiles, and manage staff access.
          </p>
        </div>

        {activeTab === "company" && (
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90"
          >
            {saved ? <Check className="size-4" /> : <Settings className="size-4" />}
            <span>{saved ? "Saved Changes" : "Save Settings"}</span>
          </button>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === "company"
              ? "bg-accent/15 text-accent border border-accent/30 font-semibold"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Building className="size-4" />
          <span>Company Profile & Channels</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === "team"
              ? "bg-accent/15 text-accent border border-accent/30 font-semibold"
              : "text-muted-foreground hover:bg-card hover:text-foreground"
          }`}
        >
          <Users className="size-4" />
          <span>Team & Access Control</span>
        </button>
      </div>

      {/* Tab 1: Company Profile and Channels */}
      {activeTab === "company" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1: Official Contact Details */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Mail className="size-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">
                Primary Contact Channels
              </h2>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Primary Receiving Email</label>
              <input
                type="email"
                value={settings.primaryEmail}
                onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-muted-foreground">
                All contact form submissions and RFQ notifications route to this address.
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Technical Enquiries Phone</label>
                <input
                  type="text"
                  value={settings.technicalPhone}
                  onChange={(e) => setSettings({ ...settings, technicalPhone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Dispatch & Logistics Phone</label>
                <input
                  type="text"
                  value={settings.dispatchPhone}
                  onChange={(e) => setSettings({ ...settings, dispatchPhone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Physical Plant & Lab Address</label>
              <textarea
                rows={2}
                value={settings.plantAddress}
                onChange={(e) => setSettings({ ...settings, plantAddress: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background/80 p-3 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Google Maps Embed URL</label>
              <input
                type="text"
                value={settings.googleMapsUrl}
                onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 font-mono text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: Social Media & Global Metadata */}
          <div className="space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Share2 className="size-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">
                Corporate Social Handles
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground">LinkedIn Company Profile</label>
                <input
                  type="text"
                  value={settings.linkedin}
                  onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">X (formerly Twitter)</label>
                <input
                  type="text"
                  value={settings.twitter}
                  onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Instagram</label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">YouTube Video / Channel</label>
                <input
                  type="text"
                  value={settings.youtube}
                  onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium text-muted-foreground">Default SEO Meta Title</label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Default Meta Description</label>
              <textarea
                rows={2}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-background/80 p-3 text-xs text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Card 3: Brand Identity & Corporate Brochure (Full Width) */}
          <div className="lg:col-span-2 space-y-4 rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Building className="size-4 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">
                Brand Assets & Capability Brochure
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Official Logo */}
              <div className="space-y-2 rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Corporate Brand Logo
                  </span>
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
                  >
                    <UploadCloud className="size-3" />
                    <span>Upload Logo</span>
                  </button>
                </div>
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <div className="flex items-center gap-3 pt-1">
                  {settings.logoUrl && (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={settings.logoUrl}
                        alt="Company Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={settings.logoUrl || ""}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Capability Brochure PDF */}
              <div className="space-y-2 rounded-xl border border-border/60 bg-background/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Corporate Capability Brochure (PDF)
                  </span>
                  <button
                    type="button"
                    onClick={() => brochureFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
                  >
                    <UploadCloud className="size-3" />
                    <span>Upload PDF</span>
                  </button>
                </div>
                <input
                  ref={brochureFileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleBrochureUpload}
                />
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-accent/10 text-accent">
                    <FileText className="size-5" />
                  </div>
                  <input
                    type="text"
                    value={settings.brochureUrl || ""}
                    onChange={(e) => setSettings({ ...settings, brochureUrl: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/80 px-3 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Team Access Control */}
      {activeTab === "team" && (
        <div className="w-full">
          <TeamAccessManager />
        </div>
      )}
    </div>
  );
}
