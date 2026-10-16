import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";

const DEFAULT_ARTICLES = [
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
];

export async function GET() {
  try {
    await requireSession();
    const snapshot = await adminDb.collection("news").get();

    if (snapshot.empty) {
      return NextResponse.json({ ok: true, articles: DEFAULT_ARTICLES });
    }

    const articles = snapshot.docs.map((doc) => {
      const data = doc.data();
      const dateStr = data.publishedAt?.toDate
        ? data.publishedAt.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : data.publishedDate || "Recently";

      return {
        id: doc.id,
        slug: data.slug || doc.id,
        title: data.title || "",
        excerpt: data.excerpt || "",
        body: data.body || "",
        coverImage: data.coverImage || "/images/placeholders/process-01-bevel-pinion.jpg",
        tags: Array.isArray(data.tags) ? data.tags : ["Technology"],
        status: data.status === "draft" ? "draft" : "published",
        publishedDate: dateStr,
        author: data.author || data.authorId || "Infini Engineering",
        readTime: data.readTime || "5 min read",
        seoTitle: data.seo?.title || data.seoTitle || "",
        seoDesc: data.seo?.description || data.seoDesc || "",
      };
    });

    return NextResponse.json({ ok: true, articles });
  } catch (error) {
    console.error("[api/admin/news] GET error:", error);
    return NextResponse.json({ ok: true, articles: DEFAULT_ARTICLES });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const payload = await request.json();
    const {
      id,
      slug,
      title,
      excerpt,
      body,
      coverImage,
      tags,
      status,
      publishedDate,
      author,
      readTime,
      seoTitle,
      seoDesc,
    } = payload;

    if (!title || !excerpt) {
      return NextResponse.json({ error: "Title and excerpt are required" }, { status: 400 });
    }

    const docSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const docId = id && !id.startsWith("art-") ? id : docSlug;

    const docData = {
      slug: docSlug,
      title,
      excerpt,
      body: body || excerpt,
      coverImage: coverImage || "/images/placeholders/process-01-bevel-pinion.jpg",
      tags: Array.isArray(tags) ? tags : ["Technology"],
      status: status === "draft" ? "draft" : "published",
      publishedAt: Timestamp.now(),
      authorId: author || "Infini Engineering",
      author: author || "Infini Engineering",
      readTime: readTime || "5 min read",
      publishedDate: publishedDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      seo: {
        title: seoTitle || `${title} | INFINI Insights`,
        description: seoDesc || excerpt,
        ogTitle: seoTitle || title,
        ogDescription: seoDesc || excerpt,
        ogImage: coverImage || "",
        canonical: `/news/${docSlug}`,
        noindex: false,
      },
    };

    await adminDb.collection("news").doc(docId).set(docData, { merge: true });

    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath(`/news/${docSlug}`);

    return NextResponse.json({ ok: true, article: { id: docId, ...docData } });
  } catch (error) {
    console.error("[api/admin/news] POST error:", error);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing article id" }, { status: 400 });
    }

    await adminDb.collection("news").doc(id).delete();

    revalidatePath("/");
    revalidatePath("/news");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/news] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
