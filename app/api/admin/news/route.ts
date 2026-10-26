import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiRole, CONTENT_ROLES } from "@/lib/auth/requireApiRole";
import {
  getStoredArticles,
  saveStoredArticle,
  deleteStoredArticle,
} from "@/lib/data/newsStorage";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

    const articles = await getStoredArticles();
    return NextResponse.json({ ok: true, articles });
  } catch (error) {
    console.error("[api/admin/news] GET error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

    const payload = await request.json();
    const { title, excerpt } = payload;

    if (!title || !excerpt) {
      return NextResponse.json({ error: "Title and excerpt are required" }, { status: 400 });
    }

    const savedArticle = await saveStoredArticle(payload);

    // Instantly invalidate public ISR caches so changes appear globally across India, Australia, etc.
    revalidatePath("/");
    revalidatePath("/news");
    revalidatePath(`/news/${savedArticle.slug}`);

    return NextResponse.json({ ok: true, article: savedArticle });
  } catch (error) {
    console.error("[api/admin/news] POST error:", error);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing article id" }, { status: 400 });
    }

    await deleteStoredArticle(id);

    revalidatePath("/");
    revalidatePath("/news");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/news] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
