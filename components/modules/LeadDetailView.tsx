"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  FileImage,
  Check,
  Send,
  Copy,
  ExternalLink,
  MessageSquare,
  Clock,
  Trash2,
  Download,
  Sparkles,
} from "lucide-react";
import type { LeadRecord, EmailLogEntry } from "@/lib/demo/leads";

const STATUSES: Array<LeadRecord["status"]> = [
  "New",
  "In Review",
  "Quoted",
  "Completed",
  "Closed",
];

const EMAIL_TEMPLATES = [
  {
    id: "ack-drawing",
    name: "Acknowledge & Request CAD Drawing",
    subject: (lead: LeadRecord) =>
      `INFINI Surface Finishing: Inquiry Acknowledgment & Technical Drawing Request [${lead.company || lead.name}]`,
    body: (lead: LeadRecord) =>
      `Dear ${lead.name},

Thank you for contacting INFINI Precision Surface Finishing.

We have received your technical inquiry regarding ${lead.industry || "precision"} component surface finishing for ${lead.company || "your organization"}.

To help our metallurgy engineering team evaluate the optimal MMP (Micro Machining Process) parameters and surface roughness (Ra) reduction targets, please provide:

1. 2D component manufacturing drawings with critical tolerance limits.
2. Current base material or alloy specification (e.g. Inconel 718, Ti-6Al-4V, 16MnCr5).
3. Initial versus target surface roughness requirements (Ra / Rz in micrometers).

You may reply directly to this email with your PDF/STEP drawings attached, or let us know a suitable time for a brief technical call.

Best regards,

Technical Sales & Applications Engineering
INFINI Precision Surface Finishing
Sector 2, Parwanoo, HP, India
Website: https://infini.co.in | Email: info@infini.co.in`,
  },
  {
    id: "feasibility-sample",
    name: "MMP Feasibility Confirmed & Sample Trial Request",
    subject: (lead: LeadRecord) =>
      `INFINI Evaluation: Technical Feasibility Confirmed [${lead.company || lead.name}]`,
    body: (lead: LeadRecord) =>
      `Dear ${lead.name},

Our metallurgy division has completed an initial feasibility review for your ${lead.industry || "precision"} component requirements.

The component geometry and alloy specifications fall within our selective MMP surface finishing capabilities. Our process can filter high-frequency surface wave-lengths to achieve your target Ra while preserving critical edge radii and dimensional tolerances.

We invite ${lead.company || "your team"} to send 2-3 sample prototype coupons to our Parwanoo facility for trial processing and optical profilometer metrology reporting.

Please confirm your courier dispatch schedule so our production floor can prepare the dedicated process fixtures.

Best regards,

Metallurgy & Applications Team
INFINI Precision Surface Finishing
Sector 2, Parwanoo, HP, India`,
  },
  {
    id: "quotation",
    name: "Formal Quotation & Process Schedule",
    subject: (lead: LeadRecord) =>
      `Commercial Quotation & Process Turnaround [${lead.company || lead.name}] - INFINI`,
    body: (lead: LeadRecord) =>
      `Dear ${lead.name},

Following our technical review of your ${lead.industry || "precision"} components, we are pleased to confirm our commercial quotation and delivery timeline.

Process: MMP Selective Precision Micro Machining
Standard Batch Turnaround: 3 to 5 business days upon sample receipt
Quality Documentation: Certified before/after surface roughness optical profilometry report

Please review the attached formal quotation. Once confirmed with a formal purchase order, our technical department will lock your production slot.

Best regards,

Commercial Estimations Division
INFINI Precision Surface Finishing
Sector 2, Parwanoo, HP, India`,
  },
  {
    id: "custom",
    name: "Custom Blank Message",
    subject: (lead: LeadRecord) =>
      `Inquiry Follow-up [${lead.company || lead.name}] - INFINI Precision Surface Finishing`,
    body: (lead: LeadRecord) =>
      `Dear ${lead.name},

Thank you for your interest in INFINI Precision Surface Finishing.

Regarding your recent inquiry:
"${lead.message}"

[Enter your custom message here]

Best regards,

INFINI Technical Team
Sector 2, Parwanoo, HP, India`,
  },
];

export function LeadDetailView({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [lead, setLead] = useState<LeadRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState("ack-drawing");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [newNote, setNewNote] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(leadId)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.lead) {
            setLead(json.lead);
            // Initialize default email template
            const defaultTemplate = EMAIL_TEMPLATES[0];
            setEmailSubject(defaultTemplate.subject(json.lead));
            setEmailBody(defaultTemplate.body(json.lead));
          }
        }
      } catch {
        // Handled gracefully
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [leadId]);

  function handleTemplateChange(templateId: string) {
    setSelectedTemplateId(templateId);
    if (!lead) return;
    const t = EMAIL_TEMPLATES.find((tpl) => tpl.id === templateId);
    if (t) {
      setEmailSubject(t.subject(lead));
      setEmailBody(t.body(lead));
    }
  }

  async function updateStatus(newStatus: LeadRecord["status"]) {
    if (!lead) return;
    setLead({ ...lead, status: newStatus });
    setNotification(`Status updated to ${newStatus}`);
    setTimeout(() => setNotification(null), 3000);

    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status: newStatus }),
      });
    } catch {
      // rollback or ignore
    }
  }

  async function handleAddNote() {
    if (!lead || !newNote.trim()) return;
    const formatted = `${newNote.trim()} (Recorded on ${new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })})`;
    const updatedNotes = [...(lead.notes || []), formatted];
    setLead({ ...lead, notes: updatedNotes });
    setNewNote("");
    setNotification("Note recorded");
    setTimeout(() => setNotification(null), 3000);

    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, note: formatted }),
      });
    } catch {
      // ignore
    }
  }

  async function handleLogEmail() {
    if (!lead || !emailSubject || !emailBody) return;
    const t = EMAIL_TEMPLATES.find((tpl) => tpl.id === selectedTemplateId);
    const entry: EmailLogEntry = {
      recipient: lead.email,
      subject: emailSubject,
      template: t?.name || "Custom",
      sentAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      bodySnippet: emailBody.slice(0, 140) + "...",
    };

    const updatedLogs = [...(lead.emailLogs || []), entry];
    // If inquiry was New, auto-advance to In Review
    const nextStatus = lead.status === "New" ? "In Review" : lead.status;
    setLead({ ...lead, emailLogs: updatedLogs, status: nextStatus });
    setNotification("Email recorded in dispatch history");
    setTimeout(() => setNotification(null), 3000);

    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.id,
          status: nextStatus,
          emailLog: entry,
        }),
      });
    } catch {
      // ignore
    }
  }

  function handleCopyEmail() {
    const fullText = `To: ${lead?.email}\nSubject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard.writeText(fullText);
    setCopiedEmail(true);
    setNotification("Email copied to clipboard");
    setTimeout(() => {
      setCopiedEmail(false);
      setNotification(null), 3000;
    });
  }

  function getMailtoHref() {
    if (!lead) return "#";
    const encSubject = encodeURIComponent(emailSubject);
    const encBody = encodeURIComponent(emailBody);
    return `mailto:${lead.email}?subject=${encSubject}&body=${encBody}`;
  }

  async function handleDelete() {
    if (!lead) return;
    if (!confirm(`Permanently remove inquiry from ${lead.name}?`)) return;
    try {
      await fetch(`/api/admin/leads?id=${encodeURIComponent(lead.id)}`, {
        method: "DELETE",
      });
      router.push("/admin/leads");
    } catch {
      alert("Failed to delete inquiry.");
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block size-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="mt-3 text-xs text-muted-foreground font-mono">Loading inquiry details...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-sm text-foreground">Inquiry record not found.</p>
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return to Inquiries</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Inquiries List</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {lead.name}
            </h1>
            <span className="text-xs text-muted-foreground font-mono">
              ({lead.company || "Individual"})
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {notification && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400 font-mono">
              <Check className="size-3.5" />
              <span>{notification}</span>
            </span>
          )}

          <button
            onClick={() => window.print()}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors font-mono"
          >
            Print Inquiry
          </button>

          <button
            onClick={handleDelete}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/20 transition-colors font-mono"
            title="Delete this inquiry"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Status Workflow Selector Bar */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span>Inquiry Lifecycle Status:</span>
          <span className="text-foreground font-semibold">Current: {lead.status}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => {
            const isCurrent = lead.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => updateStatus(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border ${
                  isCurrent
                    ? status === "Completed"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold"
                      : status === "In Review"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500/40 font-semibold"
                      : "bg-accent/20 text-accent border-accent/40 font-semibold"
                    : "border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Inquiry Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Data, Message, and CAD Drawing (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Contact Details Card */}
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">
              Customer Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-muted-foreground block">Email Address</span>
                <a
                  href={`mailto:${lead.email}`}
                  className="font-mono text-accent hover:underline flex items-center gap-1.5"
                >
                  <Mail className="size-3.5" />
                  <span>{lead.email}</span>
                </a>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-muted-foreground block">Phone Contact</span>
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-mono text-foreground hover:text-accent flex items-center gap-1.5"
                  >
                    <Phone className="size-3.5" />
                    <span>{lead.phone}</span>
                  </a>
                ) : (
                  <span className="text-muted-foreground font-mono">Not specified</span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-muted-foreground block">Company / OEM</span>
                <span className="text-foreground font-medium flex items-center gap-1.5">
                  <Building className="size-3.5 text-muted-foreground" />
                  <span>{lead.company || "Individual"}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-muted-foreground block">Industry Sector</span>
                <span className="text-foreground font-medium">
                  {lead.industry || "General Engineering"}
                </span>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <span className="text-[11px] font-mono text-muted-foreground block">Submission Timestamp</span>
                <span className="text-muted-foreground font-mono flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>{lead.createdAt}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Customer Requirement Message Card */}
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">
              Component Finishing Scope & Requirement
            </h2>
            <div className="rounded-lg border border-border/60 bg-background/60 p-4 text-xs leading-relaxed text-foreground whitespace-pre-line font-sans">
              {lead.message || "No description provided."}
            </div>
          </div>

          {/* Uploaded Part Drawing / Micrograph Inspection */}
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileImage className="size-4 text-accent" />
                <span>Component Drawing / Micrograph</span>
              </h2>
              {lead.imageUrl && (
                <a
                  href={lead.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline font-mono"
                >
                  <ExternalLink className="size-3" />
                  <span>Open Full Size</span>
                </a>
              )}
            </div>

            {lead.imageUrl ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg border border-border/80 bg-black/50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lead.imageUrl}
                    alt={`Drawing submitted by ${lead.name}`}
                    className="max-h-[380px] w-full object-contain rounded"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>File stored in secure system storage</span>
                  <a
                    href={lead.imageUrl}
                    download
                    className="inline-flex items-center gap-1 rounded bg-muted/60 px-2.5 py-1 text-foreground hover:bg-muted"
                  >
                    <Download className="size-3" />
                    <span>Download File</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-background/30 p-6 text-center text-xs text-muted-foreground">
                <p>No part drawing or photo was attached with this online submission.</p>
                <p className="mt-1 text-[11px]">
                  Use the email response panel on the right to request 2D/3D component drawings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Professional Email Response Station & Notes (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Response Station */}
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Send className="size-4 text-accent" />
                <span>Customer Email Response</span>
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Select an engineering template to compose an immediate response.
              </p>
            </div>

            {/* Template Selector Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-muted-foreground block">
                Response Template
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleTemplateChange(tpl.id)}
                    className={`text-left rounded-lg px-3 py-2 text-xs transition-colors border ${
                      selectedTemplateId === tpl.id
                        ? "border-accent bg-accent/15 text-foreground font-medium"
                        : "border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Subject */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground block">
                Subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full rounded-lg border border-border/80 bg-background/70 px-3 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none font-mono"
              />
            </div>

            {/* Editable Body */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-muted-foreground block">
                Message Body
              </label>
              <textarea
                rows={9}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full rounded-lg border border-border/80 bg-background/70 p-3 text-xs text-foreground focus:border-accent focus:outline-none font-mono leading-relaxed resize-y"
              />
            </div>

            {/* Response Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={getMailtoHref()}
                  onClick={handleLogEmail}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90 transition-colors text-center"
                >
                  <Mail className="size-3.5" />
                  <span>Open in Mail Client</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {copiedEmail ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  <span>{copiedEmail ? "Copied" : "Copy Text"}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogEmail}
                className="w-full rounded-lg border border-border/60 bg-card px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors font-mono text-center"
              >
                Log Response in Inquiry History
              </button>
            </div>
          </div>

          {/* Dispatch Log */}
          {lead.emailLogs && lead.emailLogs.length > 0 && (
            <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-3">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="size-3.5 text-accent" />
                <span>Response History ({lead.emailLogs.length})</span>
              </h2>
              <div className="space-y-2">
                {lead.emailLogs.map((entry, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/60 bg-background/50 p-2.5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                      <span className="font-semibold text-foreground">{entry.template}</span>
                      <span>{entry.sentAt}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] truncate">
                      {entry.subject}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Engineering & Metallurgy Notes */}
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="size-3.5 text-accent" />
              <span>Internal Metallurgy Notes</span>
            </h2>

            <div className="space-y-2">
              <textarea
                rows={3}
                placeholder="Record feasibility findings, fixture notes, or client phone call summaries..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full rounded-lg border border-border/80 bg-background/70 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none resize-none"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Save Internal Note
              </button>
            </div>

            {lead.notes && lead.notes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                {lead.notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/40 bg-background/40 p-2.5 text-xs text-muted-foreground leading-relaxed"
                  >
                    {note}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
