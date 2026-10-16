import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";
import { buildIndustries } from "@/backend/scripts/content";

export async function GET() {
  try {
    await requireSession();
    const snapshot = await adminDb.collection("industries").orderBy("order", "asc").get();

    if (snapshot.empty) {
      const fallback = buildIndustries();
      return NextResponse.json({ ok: true, industries: fallback });
    }

    const industries = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug || doc.id,
        name: data.name || doc.id,
        order: data.order ?? 1,
        eyebrow: data.hero?.eyebrow || data.eyebrow || "",
        headline: data.hero?.headline || data.headline || "",
        subheadline: data.hero?.subheadline || data.subheadline || "",
        heroImage: data.hero?.image || data.heroImage || "",
        overview: data.overview || "",
        relevance: data.relevance || "",
        applications: data.applications || [],
        materials: data.materials || [],
        benefits: data.benefits || [],
        published: typeof data.published === "boolean" ? data.published : true,
        seoTitle: data.seo?.title || data.seoTitle || "",
        seoDesc: data.seo?.description || data.seoDesc || "",
      };
    });

    return NextResponse.json({ ok: true, industries });
  } catch (error) {
    console.error("[api/admin/industries] GET error:", error);
    const fallback = buildIndustries();
    return NextResponse.json({ ok: true, industries: fallback });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const payload = await request.json();
    const {
      slug,
      name,
      order,
      eyebrow,
      headline,
      subheadline,
      heroImage,
      overview,
      relevance,
      applications,
      materials,
      benefits,
      published,
      seoTitle,
      seoDesc,
    } = payload;

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug and name are required" }, { status: 400 });
    }

    const docData = {
      slug,
      name,
      order: typeof order === "number" ? order : 1,
      hero: {
        eyebrow: eyebrow || "",
        headline: headline || "",
        subheadline: subheadline || "",
        image: heroImage || "",
      },
      overview: overview || "",
      relevance: relevance || "",
      applications: Array.isArray(applications) ? applications : [],
      materials: Array.isArray(materials) ? materials : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      published: Boolean(published),
      seo: {
        title: seoTitle || `${name} Surface Finishing | INFINI`,
        description: seoDesc || overview || name,
        ogTitle: seoTitle || name,
        ogDescription: seoDesc || overview || name,
        ogImage: heroImage || "",
        canonical: `/industries/${slug}`,
        noindex: false,
      },
    };

    await adminDb.collection("industries").doc(slug).set(docData, { merge: true });

    revalidatePath("/");
    revalidatePath("/industries");
    revalidatePath(`/industries/${slug}`);

    return NextResponse.json({ ok: true, industry: { id: slug, ...docData } });
  } catch (error) {
    console.error("[api/admin/industries] POST error:", error);
    return NextResponse.json({ error: "Failed to save industry" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || searchParams.get("slug");

    if (!id) {
      return NextResponse.json({ error: "Missing industry id or slug" }, { status: 400 });
    }

    await adminDb.collection("industries").doc(id).delete();

    revalidatePath("/");
    revalidatePath("/industries");
    revalidatePath(`/industries/${id}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/industries] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete industry" }, { status: 500 });
  }
}
