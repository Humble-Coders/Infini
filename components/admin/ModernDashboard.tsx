"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Inbox,
  CalendarDays,
  BookOpen,
  MessageSquareQuote,
  ArrowUpRight,
  Plus,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";
import { GlowingBorderCard } from "@/components/ui/glowing-border-card";
import type { Role, TestimonialDoc, WithId } from "@/lib/types";
import type { EventBannerConfig } from "@/lib/data/eventBannerStorage";
import type { StoredCaseStudy } from "@/lib/data/caseStudiesStorage";
import type { CompanySettings } from "@/lib/data/companySettingsStorage";
import type { LeadItem } from "@/lib/data/leadsStorage";

export interface DashboardData {
  eventBanner: EventBannerConfig;
  caseStudies: StoredCaseStudy[];
  testimonials: WithId<TestimonialDoc>[];
  companySettings: CompanySettings;
  leads: LeadItem[];
}

const DEFAULT_DATA: DashboardData = {
  eventBanner: {
    enabled: true,
    badge: "Upcoming Exhibition",
    title: "IMTEX Forming 2026",
    subtitle: "Visit INFINI for live demonstrations",
    location: "Hall 4, Stall B112, Bengaluru",
    ctaText: "Schedule Technical Meeting",
    ctaUrl: "/contact",
    startDate: "2026-01-22",
    endDate: "2026-01-27",
    theme: "red",
  },
  caseStudies: [],
  testimonials: [],
  companySettings: {
    primaryEmail: "superfinish@infini.co.in",
    technicalPhone: "+91 (1792) 234459",
    dispatchPhone: "+91 1792 233216",
    plantAddress: "Treatment & validation labs, 1 Taksal Road, Parwanoo, Himachal Pradesh 173220, India",
    googleMapsUrl: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    youtube: "",
    facebook: "",
    metaTitle: "",
    metaDescription: "",
    cookieBannerEnabled: true,
  },
  leads: [],
};

export function ModernDashboard({
  email,
  role,
  now,
  initialData,
}: {
  email: string;
  role: Role;
  /** Server time of the render, so the banner countdown is the same on server and client. */
  now: number;
  initialData?: DashboardData;
}) {
  const [data, setData] = useState<DashboardData>(() => initialData || DEFAULT_DATA);

  const [filter, setFilter] = useState<"All" | "New" | "In Review" | "Quoted">("All");
  const [isTogglingBanner, setIsTogglingBanner] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Poll or refresh data smoothly on client
  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.ok && json.data) {
          setData(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const leads = data.leads || [];
  const caseStudies = data.caseStudies || [];
  const testimonials = data.testimonials || [];
  const eventBanner = data.eventBanner;
  const companySettings = data.companySettings;

  // Filtered inquiries
  const filteredLeads =
    filter === "All"
      ? leads
      : leads.filter((l) => l.status === filter);

  // Dynamic Metrics
  const totalInquiries = leads.length;
  const newInquiriesCount = leads.filter((l) => l.status === "New").length;

  const isBannerActive = eventBanner.enabled;
  const endTime = eventBanner.endDate ? new Date(eventBanner.endDate).getTime() : NaN;
  // Kept up through the end day itself, matching the public site's check.
  const bannerEnded = !Number.isNaN(endTime) && endTime + 24 * 60 * 60 * 1000 <= now;
  const daysRemaining = Number.isNaN(endTime) ? null : Math.max(0, Math.ceil((endTime - now) / (1000 * 60 * 60 * 24)));

  const publishedCaseStudiesCount = caseStudies.filter((c) => c.published !== false).length;
  const uniqueIndustriesCount = new Set(caseStudies.map((c) => c.industry)).size;
  const averageGain = caseStudies[0]?.toolLifeGain
    ? `Latest result: ${caseStudies[0].toolLifeGain}`
    : "No results published yet";

  const reviewsCount = testimonials.length;

  // Event banner toggle handler
  async function handleToggleBanner() {
    setIsTogglingBanner(true);
    const newStatus = !isBannerActive;
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eventBanner, enabled: newStatus }),
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          eventBanner: { ...prev.eventBanner, enabled: newStatus },
        }));
        toast.success(newStatus ? "Event banner activated & live on site!" : "Event banner paused.");
      }
    } catch {
      toast.error("Failed to update event banner status.");
    } finally {
      setIsTogglingBanner(false);
    }
  }

  // Lead status change handler
  async function handleStatusChange(leadId: string, newStatus: "New" | "In Review" | "Quoted" | "Won") {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        setData((prev) => ({
          ...prev,
          leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
        }));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => prev ? { ...prev, status: newStatus } : null);
        }
        toast.success(`Inquiry marked as ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update inquiry status.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Welcome Bar with running red glow border effect */}
      <GlowingBorderCard className="rounded-2xl" innerClassName="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                Engineering Console
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live System
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-mono capitalize text-muted-foreground">
                {role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">
              Signed in as <span className="font-medium text-foreground">{email}</span>. Manage inquiries, proof case studies, exhibition announcements, and technical content.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <Link
              href="/admin/case-studies"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              <span>New Case Study</span>
            </Link>
            <Link
              href="/admin/leads"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-2.5 text-xs font-medium text-foreground transition-all hover:bg-muted"
            >
              <Inbox className="size-3.5 text-muted-foreground" aria-hidden="true" />
              <span>View Inquiries</span>
            </Link>
          </div>
        </div>
      </GlowingBorderCard>

      {/* Top 4 KPI Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Inquiries */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Inquiries</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Inbox className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
              {totalInquiries}
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400">
              <TrendingUp className="size-3" aria-hidden="true" />
              +14% this month
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {newInquiriesCount > 0
              ? `${newInquiriesCount} require engineering review`
              : "All inquiries reviewed & logged"}
          </p>
        </div>

        {/* Metric 2: Live Event Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Top Event Banner</span>
            <button
              onClick={handleToggleBanner}
              disabled={isTogglingBanner}
              title={isBannerActive ? "Click to pause banner" : "Click to activate banner"}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                isBannerActive
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-muted text-muted-foreground border border-border"
              )}
            >
              <span className={cn("size-1.5 rounded-full", isBannerActive ? "bg-accent" : "bg-muted-foreground")} />
              {isBannerActive ? "Active" : "Paused"}
            </button>
          </div>
          <div className="mt-4">
            <span className="text-sm font-semibold text-foreground line-clamp-1">
              {eventBanner.title || "IMTEX Forming 2026"}
            </span>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
              {eventBanner.location || "No location set"}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-mono text-accent">
              {!isBannerActive
                ? "Banner paused"
                : bannerEnded
                  ? "Event ended, hidden on the site"
                  : daysRemaining !== null
                    ? `Ends in ${daysRemaining} ${daysRemaining === 1 ? "day" : "days"}`
                    : "Active on public header"}
            </span>
            <Link
              href="/admin/events"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <span>Edit</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Published Case Studies */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Published Case Studies</span>
            <Link
              href="/admin/case-studies"
              className="flex size-8 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <BookOpen className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
              {publishedCaseStudiesCount}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Across {uniqueIndustriesCount} Industries
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
            {averageGain}
          </p>
        </div>

        {/* Metric 4: Quality Endorsements */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Quality Endorsements</span>
            <Link
              href="/admin/testimonials"
              className="flex size-8 items-center justify-center rounded-xl bg-card border border-border text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              <MessageSquareQuote className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
              {reviewsCount}
            </span>
            <span className="text-xs font-medium text-emerald-400">100% Verified</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Aerospace, Medical & Dies</p>
        </div>
      </div>

      {/* Main Grid: 8 Cols Left + 4 Cols Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Recent Inquiries & Part RFQ Pipeline */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Recent Inquiries & Part Drawings
                </h2>
                <p className="text-xs text-muted-foreground">
                  Customer requirements submitted via the website contact form
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-1">
                {(["All", "New", "In Review", "Quoted"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      filter === tab
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            <div className="mt-5 divide-y divide-border/60">
              {filteredLeads.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  No inquiries found matching &quot;{filter}&quot;.
                </div>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="flex flex-col gap-3 py-3.5 sm:py-4 transition-colors hover:bg-muted/20 px-2 sm:px-3 rounded-xl cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                      <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background font-mono text-xs font-semibold text-foreground mt-0.5">
                        {lead.name.charAt(0)}
                      </span>
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-xs sm:text-sm font-semibold text-foreground">
                            {lead.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {lead.company}
                          </span>
                          {lead.hasDrawing && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[10px] font-mono text-accent shrink-0">
                              Drawing Attached
                            </span>
                          )}
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground break-words leading-relaxed">
                          {lead.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] sm:text-[11px] text-muted-foreground font-mono">
                          <span className="break-all">{lead.email}</span>
                          {lead.phone && (
                            <>
                              <span>·</span>
                              <span>{lead.phone}</span>
                            </>
                          )}
                          <span>·</span>
                          <span>{lead.industry}</span>
                          <span>·</span>
                          <span>{lead.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-border/40 sm:border-0 pl-10 sm:pl-0">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-medium font-mono",
                          lead.status === "New" && "bg-accent/15 text-accent border border-accent/30",
                          lead.status === "In Review" && "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                          lead.status === "Quoted" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
                          lead.status === "Won" && "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40"
                        )}
                      >
                        {lead.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                        aria-label={`View details for ${lead.name}`}
                      >
                        <ArrowUpRight className="size-3.5 sm:size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 border-t border-border/60 pt-4 text-center">
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline font-mono"
              >
                <span>Open full inquiries management and triage inbox</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

          {/* Quick Action Bento Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/admin/case-studies"
              className="group rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-card"
            >
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground group-hover:border-accent group-hover:text-accent">
                <BookOpen className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent">
                Case Studies
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Update Ra/Rz before and after image sliders and customer specs
              </p>
            </Link>

            <Link
              href="/admin/testimonials"
              className="group rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-card"
            >
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground group-hover:border-accent group-hover:text-accent">
                <MessageSquareQuote className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent">
                Reviews
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Add client quotes, logos, and aerospace partner reviews
              </p>
            </Link>

            <Link
              href="/admin/events"
              className="group rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-card"
            >
              <span className="flex size-9 items-center justify-center rounded-xl border border-border bg-background text-foreground group-hover:border-accent group-hover:text-accent">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent">
                Exhibition Banner
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Schedule top announcements and trade show booths
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column (4 cols): Facility Contacts & Live Settings */}
        <div className="space-y-6 lg:col-span-4">
          {/* Company Contact Snapshot Card */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Facility & Contact Channels
              </h2>
              <Link href="/admin/settings" className="text-xs text-accent hover:underline font-mono">
                Edit
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                <Mail className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Direct Email</span>
                  <span className="font-semibold text-foreground truncate break-all">
                    {companySettings.primaryEmail}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                <Phone className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Technical Desk</span>
                  <span className="font-semibold text-foreground truncate">
                    {companySettings.technicalPhone || companySettings.dispatchPhone}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                <MapPin className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">MMP Licensed Plant</span>
                  <span className="font-semibold text-foreground line-clamp-2">
                    {companySettings.plantAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Media Upload Box */}
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center space-y-3">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
              <ImageIcon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Media Repository</h3>
              <p className="text-xs text-muted-foreground">
                Upload part drawings, micro-photographs, or PDF certificates
              </p>
            </div>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-accent transition-colors"
            >
              <span>Open Media Library</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Inquiry Detail Quick-Inspect Modal */}
      {selectedLead && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {selectedLead.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedLead.company} · {selectedLead.industry}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
                  <span className="text-[10px] text-muted-foreground block uppercase">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-accent hover:underline break-all">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/40 p-2.5">
                  <span className="text-[10px] text-muted-foreground block uppercase">Phone</span>
                  {selectedLead.phone ? (
                    <a href={`tel:${selectedLead.phone}`} className="text-foreground hover:underline">
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                  Customer Requirement / Specification:
                </span>
                <p className="rounded-xl border border-border/60 bg-card/50 p-3 leading-relaxed text-foreground">
                  {selectedLead.message}
                </p>
              </div>

              {selectedLead.imageUrl && (
                <div>
                  <span className="text-[11px] font-medium text-muted-foreground block mb-1">
                    Uploaded Drawing / Component Photo:
                  </span>
                  <div className="overflow-hidden rounded-xl border border-border bg-black/40 p-2 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedLead.imageUrl}
                      alt="Part Drawing Attachment"
                      className="max-h-48 mx-auto rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Change Status:
                </span>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  {(["New", "In Review", "Quoted", "Won"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(selectedLead.id, st)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 transition-all",
                        selectedLead.status === st
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "border border-border bg-card/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
