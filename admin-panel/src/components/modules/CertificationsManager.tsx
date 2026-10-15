"use client";

import { useState, useRef } from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Edit3,
  FileText,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
  UploadCloud,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";

export interface CertificationItem {
  id: string;
  name: string;
  certificateNumber: string;
  issuedDate: string;
  validUntil: string;
  description: string;
  fileUrl: string;
  fileName?: string;
  order: number;
  published: boolean;
}

const PRESET_STANDARDS: Record<string, { desc: string; certNo: string }> = {
  "ISO 9001:2015": {
    desc: "Quality management system certification covering process controls, precision micro-machining, and contract surface finishing.",
    certNo: "Q-000001",
  },
  "ISO 13485:2016": {
    desc: "Medical device quality management alignment for orthopedic implant, titanium bone plate, and surgical instrument surface finishing.",
    certNo: "M-000002",
  },
  "ISO 14001:2015": {
    desc: "Environmental management system certification for plant operations and sustainable surface finishing facilities.",
    certNo: "E-000003",
  },
  "ISO 45001:2018": {
    desc: "Occupational health and safety management system certification for precision workshop operations.",
    certNo: "H-000004",
  },
  "Udyam Registration": {
    desc: "Government of India MSME registration for precision engineering manufacturing.",
    certNo: "UDYAM-HP-00-0000000",
  },
};

const REAL_CERTS: CertificationItem[] = [
  {
    id: "iso-9001-2015",
    name: "ISO 9001:2015",
    certificateNumber: "Q-000001",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: "Quality management system certification covering process controls, precision micro-machining, and contract surface finishing.",
    fileUrl: "/docs/iso-9001-2015-infini.pdf",
    fileName: "iso-9001-2015-infini.pdf",
    order: 1,
    published: true,
  },
  {
    id: "iso-13485-2016",
    name: "ISO 13485:2016",
    certificateNumber: "M-000002",
    issuedDate: "01 Mar 2024",
    validUntil: "28 Feb 2027",
    description: "Medical device quality management alignment for orthopedic implant, titanium bone plate, and surgical instrument surface finishing.",
    fileUrl: "/docs/iso-13485-medical-infini.pdf",
    fileName: "iso-13485-medical-infini.pdf",
    order: 2,
    published: true,
  },
  {
    id: "iso-14001-2015",
    name: "ISO 14001:2015",
    certificateNumber: "E-000003",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: "Environmental management system certification for plant operations and sustainable surface finishing facilities.",
    fileUrl: "/docs/iso-14001-2015-infini.pdf",
    fileName: "iso-14001-2015-infini.pdf",
    order: 3,
    published: true,
  },
  {
    id: "iso-45001-2018",
    name: "ISO 45001:2018",
    certificateNumber: "H-000004",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: "Occupational health and safety management system certification for precision workshop operations.",
    fileUrl: "/docs/iso-45001-2018-infini.pdf",
    fileName: "iso-45001-2018-infini.pdf",
    order: 4,
    published: true,
  },
  {
    id: "udyam-registration",
    name: "Udyam Registration",
    certificateNumber: "UDYAM-HP-00-0000000",
    issuedDate: "01 Jun 2023",
    validUntil: "Permanent (MSME)",
    description: "Government of India MSME registration for precision engineering manufacturing.",
    fileUrl: "/docs/udyam-registration-infini.pdf",
    fileName: "udyam-registration-infini.pdf",
    order: 5,
    published: true,
  },
];

export function CertificationsManager() {
  const [certs, setCerts] = useState<CertificationItem[]>(REAL_CERTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CertificationItem>({
    id: "",
    name: "ISO 9001:2015",
    certificateNumber: "Q-000001",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: PRESET_STANDARDS["ISO 9001:2015"].desc,
    fileUrl: "",
    fileName: "",
    order: certs.length + 1,
    published: true,
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: "",
      name: "ISO 9001:2015",
      certificateNumber: "Q-000001",
      issuedDate: "15 Jan 2024",
      validUntil: "14 Jan 2027",
      description: PRESET_STANDARDS["ISO 9001:2015"].desc,
      fileUrl: "",
      fileName: "",
      order: certs.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: CertificationItem) => {
    setEditingItem(cert);
    setFormData({ ...cert });
    setIsModalOpen(true);
  };

  const handleTogglePublish = (id: string) => {
    setCerts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: !c.published } : c))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this certificate record?")) {
      setCerts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleStandardSelect = (val: string) => {
    if (val in PRESET_STANDARDS) {
      setFormData((prev) => ({
        ...prev,
        name: val,
        certificateNumber: PRESET_STANDARDS[val].certNo,
        description: PRESET_STANDARDS[val].desc,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        name: val,
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      fileUrl: url,
      fileName: file.name,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.certificateNumber) return;

    if (editingItem) {
      setCerts((prev) =>
        prev.map((c) => (c.id === editingItem.id ? { ...formData, id: editingItem.id } : c))
      );
    } else {
      const newItem: CertificationItem = {
        ...formData,
        id: `cert-${Date.now()}`,
      };
      setCerts((prev) => [...prev, newItem]);
    }
    setIsModalOpen(false);
  };

  const totalPublished = certs.filter((c) => c.published).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Certifications
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage ISO standards, accreditation records, and direct PDF downloads.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90"
        >
          <Plus className="size-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Summary stats with symmetrical bento layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Standards
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Award className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
              {certs.length}
            </span>
            <span className="text-xs text-muted-foreground">ISO & Govt Registrations</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Live on Website
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Eye className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-emerald-400">
              {totalPublished} / {certs.length}
            </span>
            <span className="text-xs text-muted-foreground">Active in public footer</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Audit Status
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-emerald-400">
              Compliant
            </span>
            <span className="text-xs text-muted-foreground">Traceable to Parwanoo plant</span>
          </div>
        </div>
      </div>

      {/* Grid of Certification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-sm transition-all ${
              cert.published
                ? "border-border/80 bg-card/60 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                : "border-border/40 bg-card/20 opacity-70"
            }`}
          >
            <div>
              {/* Card top bar with proper vertical alignment */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground block">
                      Cert No.
                    </span>
                    <span className="text-xs font-bold text-foreground font-mono leading-tight">
                      {cert.certificateNumber}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePublish(cert.id)}
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono transition-colors ${
                    cert.published
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-muted/40 text-muted-foreground border border-border"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      cert.published ? "bg-emerald-400" : "bg-muted-foreground"
                    }`}
                  />
                  <span>{cert.published ? "Live on Site" : "Draft"}</span>
                </button>
              </div>

              {/* Title & Description with balanced spacing */}
              <div className="py-3 space-y-1.5">
                <h2 className="text-base font-bold tracking-tight text-foreground">
                  {cert.name}
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {cert.description}
                </p>
              </div>

              {/* Symmetrical 2-column validity box */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-background/50 p-3 my-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Issued Date
                  </span>
                  <span className="text-xs font-semibold text-foreground font-mono mt-0.5 block">
                    {cert.issuedDate}
                  </span>
                </div>
                <div className="border-l border-border/60 pl-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                    Valid Until
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono mt-0.5 block">
                    {cert.validUntil}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
              <div>
                {cert.fileUrl ? (
                  <a
                    href={cert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-card/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-accent"
                  >
                    <FileText className="size-3 text-accent" />
                    <span>{cert.fileName || "View Document"}</span>
                  </a>
                ) : (
                  <span className="text-[11px] text-muted-foreground italic">No document attached</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cert)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                  title="Edit certificate details"
                >
                  <Edit3 className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Delete certificate"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        
      </div>

      {/* Edit / Create Modal with Direct Upload and Dropdowns */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" />
                <h3 className="text-base font-bold text-foreground">
                  {editingItem ? "Edit Certification" : "Upload New Certificate"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3.5">
              {/* Dropdown for standard selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Certification Standard (Select from list)
                </label>
                <AdminSelect
                  value={formData.name}
                  onChange={(val) => handleStandardSelect(val)}
                  options={[
                    { value: "ISO 9001:2015", label: "ISO 9001:2015 (Quality Management)" },
                    { value: "ISO 13485:2016", label: "ISO 13485:2016 (Medical Devices)" },
                    { value: "ISO 14001:2015", label: "ISO 14001:2015 (Environmental)" },
                    { value: "ISO 45001:2018", label: "ISO 45001:2018 (Health & Safety)" },
                    { value: "Udyam Registration", label: "Udyam Registration (MSME)" },
                    { value: "Custom Standard", label: "Custom / Other Standard" },
                  ]}
                />
              </div>

              {formData.name === "Custom Standard" && (
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Custom Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. ISO Standard Name"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    placeholder="e.g. Q-000001"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Validity (Valid Until)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    placeholder="e.g. 14 Jan 2027"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Scope & Details
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of certification scope..."
                  className="w-full rounded-xl border border-border/70 bg-card/50 p-2.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              {/* Direct file upload zone */}
              <div className="rounded-xl border border-border/70 bg-card/30 p-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Certificate Document (Direct Upload)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent transition-colors"
                  >
                    <UploadCloud className="size-3.5 text-accent" />
                    <span>Choose File from Disk</span>
                  </button>
                  {formData.fileName ? (
                    <span className="text-xs text-emerald-400 font-mono truncate max-w-[220px]">
                      {formData.fileName}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">No file selected</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cert-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="size-4 rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="cert-published" className="text-xs text-foreground select-none">
                  Display publicly on website certifications section
                </label>
              </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
                >
                  <Save className="size-3.5" />
                  <span>{editingItem ? "Update Record" : "Save Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
