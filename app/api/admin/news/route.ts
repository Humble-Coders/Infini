import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/session";
import {
  getStoredArticles,
  saveStoredArticle,
  deleteStoredArticle,
} from "@/lib/data/newsStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articles = await getStoredArticles();
    return NextResponse.json({ ok: true, articles });
  } catch (error) {
    console.error("[api/admin/news] GET error:", error);
    const articles = await getStoredArticles();
    return NextResponse.json({ ok: true, articles });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
