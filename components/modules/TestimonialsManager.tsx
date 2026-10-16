"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Star,
  CheckCircle2,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Building,
  User,
  ArrowUpDown,
  Save,
  X,
  UploadCloud,
  Check,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";
import { DEMO_TESTIMONIALS } from "@/lib/demo/testimonials";
import type { TestimonialDoc, WithId } from "@/lib/types";

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<WithId<TestimonialDoc>[]>(DEMO_TESTIMONIALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WithId<TestimonialDoc> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {});
  }, []);

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, logoUrl: url }));
  };

  // Form State for create/edit
  const [formData, setFormData] = useState<TestimonialDoc>({
    personName: "",
    designation: "",
    company: "",
    quote: "",
    logoUrl: "",
    order: testimonials.length + 1,
    published: true,
  });

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      t.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.quote.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all"
        ? true
        : filterStatus === "published"
        ? t.published
        : !t.published;
    return matchesSearch && matchesFilter;
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      personName: "",
      designation: "",
      company: "",
      quote: "",
      logoUrl: "",
      order: testimonials.length + 1,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: WithId<TestimonialDoc>) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (id: string) => {
    const item = testimonials.find((t) => t.id === id);
    if (!item) return;
    const newStatus = !item.published;
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, published: newStatus } : t))
    );
    try {
      await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, published: newStatus }),
      });
      setSaveMessage(newStatus ? "Published live to site" : "Moved to drafts");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, published: !newStatus } : t))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this testimonial?")) return;
    setTestimonials((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/admin/testimonials?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setSaveMessage("Testimonial removed");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch {
      // ignore
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.personName || !formData.quote || !formData.company) return;

    setSaving(true);
    const targetId = editingItem?.id || `testimonial-${Date.now()}`;
    const payload = { ...formData, id: targetId };

    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        if (editingItem) {
          setTestimonials((prev) =>
            prev.map((item) => (item.id === targetId ? { ...payload, id: targetId } : item))
          );
        } else {
          setTestimonials((prev) => [...prev, { ...payload, id: targetId }]);
        }
        setSaveMessage("Saved & published live!");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
      setIsModalOpen(false);
    }
  };

  const publishedCount = testimonials.filter((t) => t.published).length;

  return (
    <div className="space-y-6">
      {/* Header bar with breadcrumbs and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Website Content</span>
            <span>/</span>
            <span className="text-foreground">Client Reviews</span>
            {saveMessage && (
              <span className="ml-2 inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-sans lowercase">
                <Check className="size-3" /> {saveMessage}
              </span>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Testimonials & Social Proof
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage executive quotes, OEM endorsements, and metrology validation testimonials displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90"
        >
          <Plus className="size-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Top Bento Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Reviews
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <MessageSquareQuote className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {testimonials.length}
            </span>
            <span className="text-xs text-muted-foreground">stored quotes</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Live on Site
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Eye className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">
              {publishedCount}
            </span>
            <span className="text-xs text-muted-foreground">visible live</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Quality Score
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Star className="size-4 fill-amber-400 text-amber-400" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              5.0
            </span>
            <span className="text-xs text-amber-400 font-mono">Verified OEM</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Industries
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Building className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              5
            </span>
            <span className="text-xs text-muted-foreground">precision sectors</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/40 p-3 backdrop-blur-md">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client, company, or quote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background/50 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterStatus === status
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id}
            className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 ${
              item.published
                ? "border-border/80 bg-card/50 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                : "border-border/40 bg-card/20 opacity-70"
            }`}
          >
            <div>
              {/* Card top bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400/90 ml-0.5">
                    {item.rating ? item.rating.toFixed(1) : "5.0"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    #{item.order}
                  </span>
                  <button
                    onClick={() => handleTogglePublish(item.id)}
                    title={item.published ? "Active on site" : "Draft (hidden)"}
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                      item.published
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-muted/40 text-muted-foreground border border-border"
                    }`}
                  >
                    {item.published ? (
                      <>
                        <Eye className="size-2.5" />
                        <span>Live</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="size-2.5" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Industry Tag */}
              {item.industry && (
                <div className="mb-2.5">
                  <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background/60 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                    <Building className="size-2.5 text-accent" />
                    <span>{item.industry}</span>
                  </span>
                </div>
              )}

              {/* Quote text */}
              <p className="text-xs sm:text-sm font-normal leading-relaxed text-foreground/90 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Author info & Actions footer */}
            <div className="mt-5 pt-3.5 border-t border-border/50 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {item.logoUrl ? (
                  <div className="relative size-8 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.logoUrl}
                      alt={item.company}
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent font-mono text-[11px] font-bold">
                    {item.personName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">
                    {item.personName}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {item.designation}, {item.company}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                  title="Edit testimonial"
                >
                  <Edit3 className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Delete testimonial"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTestimonials.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <MessageSquareQuote className="mx-auto size-8 text-muted-foreground/60" />
            <div className="mt-2 text-sm font-medium text-foreground">
              No testimonials match your criteria
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search terms or add a new customer review.
            </p>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[88vh] flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden my-auto min-h-0">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <MessageSquareQuote className="size-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {editingItem ? "Edit Testimonial" : "New Customer Endorsement"}
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
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Full Customer Quote
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="e.g. Burr free edges on every batch, with measurement data we can file directly into our quality system."
                  className="w-full rounded-xl border border-border/70 bg-card/50 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Quality Head"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. AeroWorks Pvt Ltd"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Industry Sector
                  </label>
                  <AdminSelect
                    value={formData.industry || "Aerospace & Defense"}
                    onChange={(val) => setFormData({ ...formData, industry: val })}
                    options={[
                      "Aerospace & Defense",
                      "Medical Implants",
                      "Cutting Tools & Tooling",
                      "Plastic Injection Molds",
                      "Gears & Transmission",
                      "Additive Manufacturing",
                      "Forging & Stamping Dies",
                      "Precision Engineering",
                    ]}
                  />
                </div>
              </div>

              {/* Direct Logo / Photo Upload */}
              <div className="space-y-1.5 rounded-xl border border-border/60 bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Client Logo or Avatar Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
                  >
                    <UploadCloud className="size-3" />
                    <span>Upload from Device</span>
                  </button>
                </div>
                <input
                  ref={logoFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.logoUrl || ""}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="/images/client-logo.png or click upload"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-1.5 text-xs font-mono text-foreground focus:border-accent focus:outline-none"
                  />
                  {formData.logoUrl && (
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.logoUrl}
                        alt="Logo preview"
                        className="size-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Rating Score
                  </label>
                  <AdminSelect
                    value={formData.rating ? formData.rating.toString() : "5"}
                    onChange={(val) => setFormData({ ...formData, rating: parseFloat(val) })}
                    options={[
                      { value: "5", label: "5.0 / 5.0 (Exceptional)" },
                      { value: "4.8", label: "4.8 / 5.0 (High Precision)" },
                      { value: "4.5", label: "4.5 / 5.0 (Verified)" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Sort Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published-toggle"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="size-4 rounded border-border text-accent focus:ring-accent"
                />
                <label htmlFor="published-toggle" className="text-xs text-foreground select-none">
                  Publish immediately to homepage review carousel
                </label>
              </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90"
                >
                  <Save className="size-3.5" />
                  <span>{editingItem ? "Update Testimonial" : "Create Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
