import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/session";
import {
  getStoredCaseStudies,
  saveStoredCaseStudy,
  deleteStoredCaseStudy,
} from "@/lib/data/caseStudiesStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const caseStudies = await getStoredCaseStudies();
    return NextResponse.json({ ok: true, caseStudies });
  } catch (error) {
    console.error("[api/admin/case-studies] GET error:", error);
    const caseStudies = await getStoredCaseStudies();
    return NextResponse.json({ ok: true, caseStudies });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const { title } = payload;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const saved = await saveStoredCaseStudy(payload);

    // Instantly invalidate public ISR caches so changes appear globally across India, Australia, etc.
    revalidatePath("/");
    revalidatePath("/case-studies");
    revalidatePath(`/case-studies/${saved.slug}`);

    return NextResponse.json({ ok: true, id: saved.id, caseStudy: saved });
  } catch (error) {
    console.error("[api/admin/case-studies] POST error:", error);
    return NextResponse.json({ error: "Failed to save case study" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing case study id" }, { status: 400 });
    }

    await deleteStoredCaseStudy(id);

    revalidatePath("/");
    revalidatePath("/case-studies");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/case-studies] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 });
  }
}
