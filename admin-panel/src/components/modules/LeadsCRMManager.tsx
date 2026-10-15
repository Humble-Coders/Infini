"use client";

import { useState, useEffect } from "react";
import {
  Inbox,
  Search,
  Download,
  Eye,
  FileImage,
  Clock,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  X,
  MessageSquare,
  Send,
} from "lucide-react";

export interface LeadRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
  imageUrl?: string | null;
  createdAt: string;
  status: "New" | "In Review" | "Sample Requested" | "Quoted" | "Won";
  notes: string[];
}

const DEMO_LEADS: LeadRecord[] = [
  {
    id: "lead-101",
    name: "Vikram Singhania",
    company: "Aerospace Dynamics Ltd",
    email: "v.singhania@aero-dyn.com",
    phone: "+91 98201 54321",
    industry: "Aerospace",
    message: "Titanium compressor blisks require Ra reduction from 0.8 um down to 0.04 um. Critical: profile geometry must remain unaltered with minimal edge radius.",
    imageUrl: "/images/placeholders/gallery-01-turbine-ring.jpg",
    createdAt: "14 Oct 2026, 11:20 AM",
    status: "New",
    notes: ["Initial inquiry received via website contact form with uploaded component drawing."],
  },
  {
    id: "lead-102",
    name: "Dr. Ananya Roy",
    company: "OrthoPrecision Implants",
    email: "ananya.roy@orthoprecision.in",
    phone: "+91 94330 98765",
    industry: "Medical",
    message: "Need batch validation for CoCr knee femoral components. Target Ra 0.01 um mirror finish. Looking to process 500 units per month.",
    imageUrl: "/images/placeholders/gallery-03-knee-implant.jpg",
    createdAt: "12 Oct 2026, 03:45 PM",
    status: "In Review",
    notes: [
      "Assigned to Senior Metallurgist for recipe recommendation.",
      "Sample coupons requested from client.",
    ],
  },
  {
    id: "lead-103",
    name: "Marcus Vance",
    company: "Vance Precision Tooling",
    email: "m.vance@vancetooling.de",
    phone: "+49 711 987654",
    industry: "Cutting Tools",
    message: "Carbide micro-drills flutes superfinishing for friction reduction and tool life extension on deep-hole drilling operations.",
    imageUrl: "/images/placeholders/gallery-05-carbide-drills.jpg",
    createdAt: "10 Oct 2026, 09:15 AM",
    status: "Quoted",
    notes: [
      "Quotation Q-2026-88 dispatched to client.",
      "Expected decision by end of month.",
    ],
  },
];

export function LeadsCRMManager() {
  const [leads, setLeads] = useState<LeadRecord[]>(DEMO_LEADS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [newNote, setNewNote] = useState("");

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

  function updateStatus(id: string, status: LeadRecord["status"]) {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status });
    }
    fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  }

  function addNote(leadId: string) {
    if (!newNote.trim()) return;
    const noteText = `${newNote.trim()} (Added on ${new Date().toLocaleDateString()})`;
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, notes: [...l.notes, noteText] } : l
      )
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({
        ...selectedLead,
        notes: [...selectedLead.notes, noteText],
      });
    }
    fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: leadId, note: noteText }),
    }).catch(() => {});
    setNewNote("");
  }

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
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Inquiries & RFQ Leads CRM
          </h2>
          <p className="text-xs text-muted-foreground">
            Review incoming component specs, inspect CAD drawings, and track technical evaluations.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Download className="size-3.5 text-muted-foreground" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-border bg-card/60 p-1 shrink-0">
          {(["All", "New", "In Review", "Quoted"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                activeFilter === tab
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
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
            className="w-full rounded-full border border-border bg-card/60 pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm">
        <div className="overflow-x-auto">
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
                  onClick={() => setSelectedLead(lead)}
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
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono font-medium ${
                        lead.status === "New"
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : lead.status === "In Review"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-muted-foreground text-[11px]">
                    {lead.createdAt}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-foreground hover:border-accent transition-colors"
                    >
                      <Eye className="size-3" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Detail & Part Drawing Modal Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col min-h-0 rounded-2xl sm:rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden my-auto">
            {/* Pinned Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 shrink-0 bg-card/95 backdrop-blur-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-accent">
                  Inquiry Review & Assessment
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedLead.name} · {selectedLead.company}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Body with min-h-0 */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Contact Information Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/50 p-3">
                  <Mail className="size-4 text-accent shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[10px] font-mono text-muted-foreground uppercase">Email</span>
                    <span className="block truncate text-xs font-semibold text-foreground">{selectedLead.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/50 p-3">
                  <Phone className="size-4 text-accent shrink-0" />
                  <div>
                    <span className="block text-[10px] font-mono text-muted-foreground uppercase">Phone</span>
                    <span className="block text-xs font-semibold text-foreground">{selectedLead.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-border bg-background/50 p-3">
                  <Building className="size-4 text-accent shrink-0" />
                  <div>
                    <span className="block text-[10px] font-mono text-muted-foreground uppercase">Industry</span>
                    <span className="block text-xs font-semibold text-foreground">{selectedLead.industry}</span>
                  </div>
                </div>
              </div>

              {/* Requirement Description */}
              <div className="rounded-2xl border border-border bg-background/40 p-4 space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                  Customer Requirement Message
                </span>
                <p className="text-xs leading-relaxed text-foreground">
                  {selectedLead.message}
                </p>
              </div>

              {/* Uploaded Part Drawing Inspector */}
              {selectedLead.imageUrl && (
                <div className="rounded-2xl border border-border bg-background/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold flex items-center gap-2">
                      <FileImage className="size-4 text-accent" />
                      Uploaded Part Drawing / Component Photo
                    </span>
                    <a
                      href={selectedLead.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-mono"
                    >
                      <span>Full Resolution</span>
                      <Download className="size-3" />
                    </a>
                  </div>
                  <div className="relative max-h-56 sm:max-h-64 w-full overflow-hidden rounded-xl border border-border bg-black/60 flex items-center justify-center p-2">
                    <img
                      src={selectedLead.imageUrl}
                      alt="Customer component upload"
                      className="max-h-52 sm:max-h-60 max-w-full object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Status Update & Internal Notes */}
              <div className="space-y-4 border-t border-border/80 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-foreground">Pipeline Status:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(["New", "In Review", "Sample Requested", "Quoted", "Won"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => updateStatus(selectedLead.id, st)}
                        className={`rounded-full px-3 py-1 text-xs font-mono font-medium transition-all ${
                          selectedLead.status === st
                            ? "bg-accent text-accent-foreground"
                            : "border border-border bg-background text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes Feed */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-accent" />
                    Engineering Activity Log
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedLead.notes.map((n, idx) => (
                      <div key={idx} className="rounded-xl border border-border/60 bg-card p-2.5 text-xs text-muted-foreground">
                        {n}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add engineering assessment note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addNote(selectedLead.id)}
                      className="flex-1 rounded-xl border border-border bg-input-background px-3.5 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      onClick={() => addNote(selectedLead.id)}
                      className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
                    >
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
