import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiRole, CONTENT_ROLES } from "@/lib/auth/requireApiRole";
import {
  getStoredCaseStudies,
  saveStoredCaseStudy,
  deleteStoredCaseStudy,
} from "@/lib/data/caseStudiesStorage";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

    const caseStudies = await getStoredCaseStudies();
    return NextResponse.json({ ok: true, caseStudies });
  } catch (error) {
    console.error("[api/admin/case-studies] GET error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

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
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

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
