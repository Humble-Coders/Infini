"use client";

import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/components/ui/utils";
import { GlowingBorderCard } from "@/components/ui/glowing-border-card";
import type { Role } from "@/lib/types";

interface LeadItem {
  id: string;
  name: string;
  company: string;
  email: string;
  industry: string;
  message: string;
  date: string;
  status: "New" | "In Review" | "Quoted";
  hasDrawing: boolean;
}

const SAMPLE_LEADS: LeadItem[] = [
  {
    id: "lead-1",
    name: "Vikram Singhania",
    company: "Aerospace Dynamics Ltd",
    email: "v.singhania@aero-dyn.com",
    industry: "Aerospace",
    message: "Titanium compressor blades need Ra reduction from 0.8 to 0.04 um with zero profile loss.",
    date: "14 Oct 2026",
    status: "New",
    hasDrawing: true,
  },
  {
    id: "lead-2",
    name: "Dr. Ananya Roy",
    company: "OrthoPrecision Implants",
    email: "ananya.roy@orthoprecision.in",
    industry: "Medical",
    message: "CoCr knee femoral heads batch validation inquiry, Ra target 0.01 um mirror finish.",
    date: "12 Oct 2026",
    status: "In Review",
    hasDrawing: true,
  },
  {
    id: "lead-3",
    name: "Marcus Vance",
    company: "Vance Precision Tooling",
    email: "m.vance@vancetooling.de",
    industry: "Cutting Tools",
    message: "Carbide micro-drills flutes polishing for friction reduction and tool life extension.",
    date: "10 Oct 2026",
    status: "Quoted",
    hasDrawing: false,
  },
];

export function ModernDashboard({ email, role }: { email: string; role: Role }) {
  const [filter, setFilter] = useState<"All" | "New" | "In Review" | "Quoted">("All");
  const [bannerActive, setBannerActive] = useState(true);

  const filteredLeads =
    filter === "All"
      ? SAMPLE_LEADS
      : SAMPLE_LEADS.filter((l) => l.status === filter);

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
        {/* Metric 1 */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Inquiries</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Inbox className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">38</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400">
              <TrendingUp className="size-3" aria-hidden="true" />
              +14% this month
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">3 require engineering review</p>
        </div>

        {/* Metric 2 */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Top Event Banner</span>
            <button
              onClick={() => setBannerActive(!bannerActive)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                bannerActive
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "bg-muted text-muted-foreground border border-border"
              )}
            >
              <span className={cn("size-1.5 rounded-full", bannerActive ? "bg-accent" : "bg-muted-foreground")} />
              {bannerActive ? "Active" : "Paused"}
            </button>
          </div>
          <div className="mt-4">
            <span className="text-sm font-semibold text-foreground line-clamp-1">
              IMTEX Forming 2026
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              Hall 4, Stall B112, Bengaluru
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] font-mono text-accent">Expires in 18 days</span>
            <Link href="/admin/events" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <span>Edit</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Published Case Studies</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-card border border-border text-foreground">
              <BookOpen className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">12</span>
            <span className="text-xs font-medium text-muted-foreground">Across 7 Industries</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Average tool life gain +300%</p>
        </div>

        {/* Metric 4 */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Quality Endorsements</span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-card border border-border text-foreground">
              <MessageSquareQuote className="size-4" aria-hidden="true" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">24</span>
            <span className="text-xs font-medium text-emerald-400">100% Verified</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Aerospace, Medical & Dies</p>
        </div>
      </div>

      {/* Main Grid: 8 Cols Left + 4 Cols Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (8 cols): Recent Inquiries & Part RFQ Pipeline */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
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
              <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-1 overflow-x-auto max-w-full scrollbar-none">
                {(["All", "New", "In Review", "Quoted"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0",
                      filter === tab
                        ? "bg-accent text-accent-foreground"
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
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col gap-3 py-3.5 sm:py-4 transition-colors hover:bg-muted/20 px-2 sm:px-3 rounded-xl"
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
                        lead.status === "Quoted" && "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      )}
                    >
                      {lead.status}
                    </span>
                    <Link
                      href="/admin/leads"
                      className="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
                      aria-label={`View details for ${lead.name}`}
                    >
                      <ArrowUpRight className="size-3.5 sm:size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border/60 pt-4 text-center">
              <Link
                href="/admin/leads"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
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
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                Facility & Contact Channels
              </h2>
              <Link href="/admin/settings" className="text-xs text-accent hover:underline">
                Edit
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                <Mail className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Direct Email</span>
                  <span className="font-semibold text-foreground break-all">superfinish@infini.co.in</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                <Phone className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Technical Desk</span>
                  <span className="font-semibold text-foreground">+91 (1792) 234459</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/50 p-3">
                <MapPin className="size-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[10px] uppercase text-muted-foreground tracking-wider">MMP Licensed Plant</span>
                  <span className="font-semibold text-foreground">Parwanoo, Himachal Pradesh, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Media Upload Box */}
          <div className="rounded-2xl border border-dashed border-border bg-card/40 p-5 sm:p-6 text-center space-y-3">
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
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground hover:border-accent"
            >
              <span>Open Media Library</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
