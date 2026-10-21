"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Download,
  Eye,
  FileImage,
  ExternalLink,
} from "lucide-react";
import { DEMO_LEADS, type LeadRecord } from "@/lib/demo/leads";

export function LeadsCRMManager() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRecord[]>(DEMO_LEADS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadLeads() {
      try {
        const res = await fetch("/api/admin/leads");
        if (res.ok) {
          const json = await res.json();
          if (json.leads && json.leads.length > 0) {
            setLeads((prev) => {
              const liveIds = new Set(json.leads.map((l: LeadRecord) => l.id));
              const nonDuplicateDemos = prev.filter((l) => !liveIds.has(l.id));
              return [...json.leads, ...nonDuplicateDemos];
            });
          }
        }
      } catch {
        // Fallback to local demo leads smoothly
      }
    }
    loadLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter =
      activeFilter === "All" || lead.status === activeFilter;
    const matchesQuery =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  function exportCSV() {
    const headers = ["ID", "Name", "Company", "Email", "Phone", "Industry", "Status", "Date"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.company}"`,
      l.email,
      `"${l.phone}"`,
      l.industry,
      l.status,
      `"${l.createdAt}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `infini_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Inquiries & RFQ Leads CRM
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review incoming component specs, inspect CAD drawings, and track technical evaluations.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors self-start sm:self-auto"
        >
          <Download className="size-3.5 text-muted-foreground" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {(["All", "New", "In Review", "Quoted", "Completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                activeFilter === tab
                  ? "bg-accent/15 text-accent border-accent/40 font-semibold"
                  : "border-transparent text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customer, alloy, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card/60 pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Leads Container: Mobile Cards View + Desktop Table View */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm">
        {/* Mobile Cards View (screens < md) */}
        <div className="md:hidden divide-y divide-border/60">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-4 space-y-3 transition-colors hover:bg-muted/20 cursor-pointer"
              onClick={() => router.push(`/admin/leads/${lead.id}`)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground text-sm truncate">{lead.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-mono font-medium shrink-0 border ${
                    lead.status === "New"
                      ? "bg-accent/15 text-accent border-accent/30"
                      : lead.status === "In Review"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      : lead.status === "Quoted"
                      ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                      : lead.status === "Completed"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {lead.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md border border-border bg-background/80 px-2 py-0.5 font-mono text-[10px] text-foreground">
                  {lead.industry}
                </span>
                {lead.imageUrl && (
                  <span className="inline-flex items-center gap-1 text-accent font-medium font-mono text-[10px]">
                    <FileImage className="size-3" />
                    <span>Drawing Attached</span>
                  </span>
                )}
                <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                  {lead.createdAt}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-muted-foreground font-mono text-[11px] truncate max-w-[200px]">
                  {lead.email}
                </span>
                <span className="text-accent inline-flex items-center gap-1 text-[11px] font-medium">
                  <span>View Details</span>
                  <ExternalLink className="size-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (screens >= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/80 bg-background/50 font-mono text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5 font-medium">Customer & Company</th>
                <th className="px-5 py-3.5 font-medium">Industry</th>
                <th className="px-5 py-3.5 font-medium">Part Drawing</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium">Received Date</th>
                <th className="px-5 py-3.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-muted/30 cursor-pointer"
                  onClick={() => router.push(`/admin/leads/${lead.id}`)}
                >
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-foreground">{lead.name}</div>
                      <div className="text-muted-foreground text-[11px]">{lead.company}</div>
                      <div className="text-muted-foreground font-mono text-[10px]">{lead.email}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md border border-border bg-background/80 px-2.5 py-0.5 font-mono text-[11px] text-foreground">
                      {lead.industry}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {lead.imageUrl ? (
                      <span className="inline-flex items-center gap-1 text-accent font-medium font-mono text-[11px]">
                        <FileImage className="size-3.5" />
                        <span>Attached</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">None</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-mono font-medium border ${
                        lead.status === "New"
                          ? "bg-accent/15 text-accent border-accent/30"
                          : lead.status === "In Review"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : lead.status === "Quoted"
                          ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                          : lead.status === "Completed"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-muted-foreground text-[11px]">
                    {lead.createdAt}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground hover:border-accent hover:text-accent transition-colors"
                    >
                      <Eye className="size-3" />
                      <span>View Details</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
