import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/session";
import {
  getStoredTestimonials,
  saveStoredTestimonial,
  deleteStoredTestimonial,
} from "@/lib/data/testimonialsStorage";
import type { TestimonialDoc, WithId } from "@/lib/types";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await getStoredTestimonials();
    return NextResponse.json({ ok: true, testimonials });
  } catch (error) {
    console.error("[api/admin/testimonials] GET error:", error);
    const testimonials = await getStoredTestimonials();
    return NextResponse.json({ ok: true, testimonials });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const { id, quote, personName, designation, company, logoUrl, order, published, industry, rating } = payload;

    if (!quote || !personName || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const docId = id || `testimonial-${Date.now()}`;
    const dataToSave: WithId<TestimonialDoc> = {
      id: docId,
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

    const saved = await saveStoredTestimonial(dataToSave);

    // Instantly invalidate public ISR caches so changes appear globally across India, Australia, etc.
    revalidatePath("/");

    return NextResponse.json({ ok: true, id: docId, testimonial: saved });
  } catch (error) {
    console.error("[api/admin/testimonials] POST error:", error);
    return NextResponse.json({ error: "Failed to save testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing testimonial id" }, { status: 400 });
    }

    await deleteStoredTestimonial(id);
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/testimonials] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
