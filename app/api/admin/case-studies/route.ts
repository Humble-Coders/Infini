import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";
import { buildCaseStudies } from "@/backend/scripts/content";
import type { CaseStudyDoc } from "@/lib/types";

export async function GET() {
  try {
    await requireSession();

    const snapshot = await adminDb
      .collection("caseStudies")
      .orderBy("publishedAt", "desc")
      .get();

    if (snapshot.empty) {
      const tsFactory = { fromDate: (date: Date) => Timestamp.fromDate(date) };
      const fallback = buildCaseStudies(tsFactory);
      return NextResponse.json({ ok: true, caseStudies: fallback });
    }

    const caseStudies = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ ok: true, caseStudies });
  } catch (error) {
    console.error("[api/admin/case-studies] GET error:", error);
    const tsFactory = { fromDate: (date: Date) => Timestamp.fromDate(date) };
    const fallback = buildCaseStudies(tsFactory);
    return NextResponse.json({ ok: true, caseStudies: fallback });
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
      industry,
      industryId,
      challenge,
      solution,
      beforeRa,
      afterRa,
      toolLifeGain,
      beforeImage,
      afterImage,
      material,
      published,
      sourceUrl,
    } = payload;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const docSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const docId = id || `cs-${Date.now()}`;

    const dataToSave: Partial<CaseStudyDoc> & Record<string, unknown> = {
      slug: docSlug,
      title,
      industryId: industryId || (industry || "Aerospace").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      industry: industry || "Aerospace",
      challenge: challenge || "",
      solution: solution || "",
      process: solution || "Controlled MMP precision micro-finishing.",
      result: toolLifeGain || "Surface roughness improved to mirror finish.",
      results: [
        { label: "Before Ra", value: beforeRa || "0.60 µm", direction: "down" },
        { label: "After Ra", value: afterRa || "0.02 µm", direction: "up" },
        { label: "Tool Life", value: toolLifeGain || "+260%", direction: "up" },
      ],
      beforeRa: beforeRa || "",
      afterRa: afterRa || "",
      toolLifeGain: toolLifeGain || "",
      beforeImage: beforeImage || "/images/cutting-tool-1.jpg",
      afterImage: afterImage || "/images/cutting-tool-3.png",
      material: material || "Steel",
      gallery: [],
      specs: {
        material: material || "Steel",
        process: "MMP Surface Treatment",
        duration: "Validated Production",
      },
      published: typeof published === "boolean" ? published : true,
      publishedAt: Timestamp.now(),
      seo: {
        title: `${title} | Case Study | INFINI`,
        description: challenge || title,
        ogTitle: title,
        ogDescription: challenge || title,
        ogImage: afterImage || "",
        canonical: `/case-studies/${docSlug}`,
        noindex: false,
      },
      ...(sourceUrl ? { sourceUrl } : {}),
    };

    await adminDb.collection("caseStudies").doc(docId).set(dataToSave, { merge: true });

    // Invalidate public caches immediately
    revalidatePath("/");
    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${docSlug}`);

    return NextResponse.json({ ok: true, id: docId, caseStudy: { id: docId, ...dataToSave } });
  } catch (error) {
    console.error("[api/admin/case-studies] POST error:", error);
    return NextResponse.json({ error: "Failed to save case study" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing case study id" }, { status: 400 });
    }

    await adminDb.collection("caseStudies").doc(id).delete();

    revalidatePath("/");
    revalidatePath("/case-studies");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/case-studies] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 });
  }
}
