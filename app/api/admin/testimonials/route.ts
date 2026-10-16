import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";
import { DEMO_TESTIMONIALS } from "@/lib/demo/testimonials";
import type { TestimonialDoc, WithId } from "@/lib/types";

export async function GET() {
  try {
    await requireSession();

    const snapshot = await adminDb
      .collection("testimonials")
      .orderBy("order", "asc")
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ ok: true, testimonials: DEMO_TESTIMONIALS });
    }

    const testimonials: WithId<TestimonialDoc>[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as TestimonialDoc),
    }));

    return NextResponse.json({ ok: true, testimonials });
  } catch (error) {
    console.error("[api/admin/testimonials] GET error:", error);
    return NextResponse.json({ ok: true, testimonials: DEMO_TESTIMONIALS });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const payload = await request.json();
    const { id, quote, personName, designation, company, logoUrl, order, published, industry, rating } = payload;

    if (!quote || !personName || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docId = id || `testimonial-${Date.now()}`;
    const dataToSave: TestimonialDoc = {
      quote,
      personName,
      designation: designation || "",
      company,
      logoUrl: logoUrl || "",
      order: typeof order === "number" ? order : 1,
      published: Boolean(published),
      ...(industry ? { industry } : {}),
      ...(typeof rating === "number" ? { rating } : {}),
    };

    await adminDb.collection("testimonials").doc(docId).set(dataToSave, { merge: true });

    // Instantly invalidate public ISR caches so changes appear globally
    revalidatePath("/");

    return NextResponse.json({ ok: true, id: docId, testimonial: dataToSave });
  } catch (error) {
    console.error("[api/admin/testimonials] POST error:", error);
    return NextResponse.json({ error: "Failed to save testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing testimonial id" }, { status: 400 });
    }

    await adminDb.collection("testimonials").doc(id).delete();
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/testimonials] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
