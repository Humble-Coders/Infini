"use client";

import { useState, useRef, useEffect } from "react";
import {
  Newspaper,
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Calendar,
  Tag,
  BookOpen,
  FileText,
  Save,
  X,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import { AdminSelect } from "@/components/admin/AdminSelect";

export interface NewsArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  tags: string[];
  status: "published" | "draft";
  publishedDate: string;
  author: string;
  readTime: string;
  seoTitle: string;
  seoDesc: string;
}

const INITIAL_ARTICLES: NewsArticleItem[] = [
  {
    id: "art-1",
    slug: "mmp-vs-traditional-polishing",
    title: "Why MMP Treatment Outperforms Traditional Polishing on Complex Geometry",
    excerpt: "Traditional polishing abrades a whole surface indiscriminately. MMP treats only the roughness that is actually a problem, preserving critical cutting edges and profiles.",
    body: "Traditional abrasive polishing removes material across all peaks and valleys alike, often degrading tight tolerances and rounding precision cutting edges. Micro Machining Process (MMP) utilizes controlled micro-friction tailored to specific material hardness and frequency thresholds. The result is selective roughness reduction down to sub-nanometer levels without altering the macro-geometry.",
    coverImage: "/images/placeholders/process-01-bevel-pinion.jpg",
    tags: ["Technology", "MMP", "Aerospace"],
    status: "published",
    publishedDate: "02 Jun 2026",
    author: "Technical Metrology Team",
    readTime: "5 min read",
    seoTitle: "Why MMP Treatment Outperforms Traditional Polishing | Infini",
    seoDesc: "How MMP frequency-based selective material removal compares to traditional abrasive polishing on complex geometry.",
  },
  {
    id: "art-2",
    slug: "medical-implant-surface-finishing",
    title: "Surface Finishing for Medical Implants: ISO 13485-Aligned Control",
    excerpt: "Implant surfaces need finishes verified to measurable Ra/Rz standards, not judged by eye. A breakdown of traceability and batch repeatability for orthopedic components.",
    body: "Orthopedic implants demand validated surface topography to ensure patient biocompatibility and long fatigue life. Cobalt-chrome femoral heads and titanium bone screws require Ra below 0.02 um with zero abrasive residue embedding. Here we examine cleanroom passivation and traceable metrology logs.",
    coverImage: "/images/placeholders/process-02-turbo-wheels-before-after.jpg",
    tags: ["Medical", "Quality", "ISO 13485"],
    status: "published",
    publishedDate: "18 May 2026",
    author: "Quality Directorate",
    readTime: "6 min read",
    seoTitle: "Surface Finishing for Medical Implants | Infini",
    seoDesc: "What ISO 13485-aligned process control looks like for medical-grade surface finishing.",
  },
  {
    id: "art-3",
    slug: "extending-carbide-tool-life",
    title: "Extending Carbide Tool Life by 300% via Controlled Micro-Honing",
    excerpt: "How micro-polishing the flute valleys and rounding the cutting edge radius reduces friction, prevents chip welding, and doubles tool longevity.",
    body: "Drills, endmills, and gear hobs fail prematurely when micro-cracks on the flutes cause chip clogging and heat buildup. Pre-coat and post-coat micro-finishing ensures uniform coating adhesion and eliminates stress risers along the cutting perimeter.",
    coverImage: "/images/cutting-tool-1.jpg",
    tags: ["Tooling", "Manufacturing"],
    status: "published",
    publishedDate: "28 Apr 2026",
    author: "Engineering Team",
    readTime: "4 min read",
    seoTitle: "Extending Carbide Tool Life with Micro-Finishing | Infini",
    seoDesc: "Engineering report on reducing cutting friction and extending tool operating cycles.",
  },
  {
    id: "art-4",
    slug: "aerospace-turbine-blade-aerodynamics",
    title: "Aerospace Turbine Blade Aerodynamics and Boundary Layer Drag Reduction",
    excerpt: "Achieving aerodynamic efficiency on nickel superalloy blades through isotropic surface refinement.",
    body: "Superalloy turbine blades operate in severe thermal and aerodynamic environments. Minimizing skin friction drag directly translates to improved fuel efficiency. Draft notes and data awaiting final CFD validation charts.",
    coverImage: "/images/cutting-tool-2.png",
    tags: ["Aerospace", "Superalloys"],
    status: "draft",
    publishedDate: "12 Jul 2026",
    author: "Chief Engineer",
    readTime: "7 min read",
    seoTitle: "Aerospace Turbine Blade Aerodynamics | Infini",
    seoDesc: "Surface finish impact on aerodynamic drag in turbine components.",
  },
];

export function NewsBlogManager() {
  const [articles, setArticles] = useState<NewsArticleItem[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticleItem | null>(null);
  const [saving, setSaving] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/news")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      })
      .catch((err) => console.error("Error loading news articles:", err));
  }, []);

  // Form state
  const [formData, setFormData] = useState<NewsArticleItem>({
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    coverImage: "/images/placeholders/process-01-bevel-pinion.jpg",
    tags: ["Technology"],
    status: "draft",
    publishedDate: "Today",
    author: "Infini Engineering",
    readTime: "4 min read",
    seoTitle: "",
    seoDesc: "",
  });

  const allTags = Array.from(new Set(articles.flatMap((a) => a.tags)));

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ? true : a.status === statusFilter;
    const matchesTag =
      selectedTag === "all" ? true : a.tags.includes(selectedTag);
    return matchesSearch && matchesStatus && matchesTag;
  });

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      id: "",
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      coverImage: "/images/placeholders/process-01-bevel-pinion.jpg",
      tags: ["Technology"],
      status: "draft",
      publishedDate: "Today",
      author: "Infini Engineering",
      readTime: "4 min read",
      seoTitle: "",
      seoDesc: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: NewsArticleItem) => {
    setEditingItem(article);
    setFormData({ ...article });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    const target = articles.find((a) => a.id === id);
    if (!target) return;
    const newStatus: "published" | "draft" = target.status === "published" ? "draft" : "published";
    const updated: NewsArticleItem = { ...target, status: newStatus };
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );
    try {
      await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this technical article?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      try {
        await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Failed to delete article:", err);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt) return;

    setSaving(true);
    const generatedSlug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const toSave: NewsArticleItem = {
      ...formData,
      id: editingItem ? editingItem.id : generatedSlug,
      slug: generatedSlug,
    };

    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSave),
      });
      const data = await res.json();
      if (data.ok && data.article) {
        const savedItem: NewsArticleItem = {
          ...toSave,
          ...data.article,
          status: data.article.status === "draft" ? "draft" : "published",
        };
        if (editingItem) {
          setArticles((prev) =>
            prev.map((a) => (a.id === editingItem.id ? savedItem : a))
          );
        } else {
          setArticles((prev) => [savedItem, ...prev]);
        }
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save article:", err);
      alert("Failed to save article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const publishedCount = articles.filter((a) => a.status === "published").length;
  const draftCount = articles.filter((a) => a.status === "draft").length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
            <span>Website Content</span>
            <span>/</span>
            <span className="text-foreground">Technical Articles & News</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            News & Engineering Insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish metallurgical whitepapers, MMP technical comparisons, industry case briefs, and corporate updates.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/25 transition-all hover:bg-accent/90"
        >
          <Plus className="size-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Total Articles
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Newspaper className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {articles.length}
            </span>
            <span className="text-xs text-muted-foreground">in repository</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Published & Live
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Eye className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400 font-mono">
              {publishedCount}
            </span>
            <span className="text-xs text-muted-foreground">indexed on site</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Drafts in Progress
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400 font-mono">
              {draftCount}
            </span>
            <span className="text-xs text-muted-foreground">unpublished</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-accent/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Domain Categories
            </span>
            <span className="flex size-8 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 text-accent">
              <Tag className="size-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-mono">
              {allTags.length}
            </span>
            <span className="text-xs text-muted-foreground">active tags</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/40 p-3 backdrop-blur-md">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border/60 bg-background/50 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
          {(["all", "published", "draft"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {status}
            </button>
          ))}

          <span className="text-border mx-1 hidden sm:inline">|</span>

          <AdminSelect
            value={selectedTag}
            onChange={setSelectedTag}
            options={[
              { value: "all", label: "All Tags" },
              ...allTags.map((tag) => ({ value: tag, label: tag })),
            ]}
            variant="pill"
            align="right"
            placement="top"
            className="py-1.5 px-3 text-xs"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className={`group flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-md transition-all duration-200 ${
              article.status === "published"
                ? "border-border/80 bg-card/40 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
                : "border-border/40 bg-card/20 opacity-75"
            }`}
          >
            <div>
              {/* Header pill bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {article.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/60 bg-background/40 px-2 py-0.5 text-[10px] font-mono text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {article.publishedDate}
                  </span>

                  <button
                    onClick={() => handleToggleStatus(article.id)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
                      article.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {article.status === "published" ? (
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

              {/* Title and Excerpt */}
              <h2 className="text-base font-bold text-foreground leading-snug group-hover:text-accent transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {article.excerpt}
              </p>
            </div>

            {/* Footer metadata and actions */}
            <div className="mt-5 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="font-mono text-[11px]">/news/{article.slug}</span>
                <span>•</span>
                <span className="text-[11px]">{article.readTime}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(article)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
                  title="Edit article"
                >
                  <Edit3 className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredArticles.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <Newspaper className="mx-auto size-8 text-muted-foreground/60" />
            <div className="mt-2 text-sm font-medium text-foreground">
              No articles match your search criteria
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Create a new technical whitepaper or clear the filter parameters.
            </p>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border/80 bg-background shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 shrink-0 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <BookOpen className="size-4" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {editingItem ? "Edit Technical Article" : "Compose New Engineering Insight"}
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
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Why MMP Treatment Outperforms Traditional Polishing"
                  className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags.join(", ")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Technology, MMP, Aerospace"
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Photo Direct Upload Slot */}
              <div className="rounded-xl border border-border/70 bg-card/40 p-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Article Cover Image
                </label>
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData((prev) => ({ ...prev, coverImage: URL.createObjectURL(file) }));
                    }
                  }}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => coverFileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent transition-colors"
                  >
                    <UploadCloud className="size-3.5 text-accent" />
                    <span>Upload Image from Disk</span>
                  </button>
                  {formData.coverImage && (
                    <div className="flex items-center gap-2">
                      <img
                        src={formData.coverImage}
                        alt="Cover preview"
                        className="size-8 rounded-lg object-cover border border-border"
                      />
                      <span className="text-[11px] text-emerald-400 font-mono">Image attached</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Executive Excerpt
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief synopsis displayed on the cards and social sharing cards..."
                  className="w-full rounded-xl border border-border/70 bg-card/50 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                  Technical Body Content (Markdown supported)
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Full engineering description, metrology metrics, surface Ra/Rz charts..."
                  className="w-full rounded-xl border border-border/70 bg-card/50 p-3 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Author / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full rounded-xl border border-border/70 bg-card/50 px-3 py-2 text-xs text-foreground focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                    Publication Status
                  </label>
                  <AdminSelect
                    value={formData.status}
                    onChange={(val) =>
                      setFormData({ ...formData, status: val as "published" | "draft" })
                    }
                    options={[
                      { value: "published", label: "Published (Visible on site)" },
                      { value: "draft", label: "Draft (Hidden)" },
                    ]}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/30 p-3 space-y-3">
                <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                  Search Engine Optimization (SEO)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder="SEO Page Title"
                    className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.seoDesc}
                    onChange={(e) => setFormData({ ...formData, seoDesc: e.target.value })}
                    placeholder="Meta Description"
                    className="w-full rounded-xl border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                </div>
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
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50"
                >
                  <Save className="size-3.5" />
                  <span>{saving ? "Saving..." : editingItem ? "Save Changes" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
