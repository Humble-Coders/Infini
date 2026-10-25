import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";
import {
  getStoredMedia,
  saveStoredMediaAsset,
  deleteStoredMediaAsset,
} from "@/lib/data/mediaStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const assets = await getStoredMedia();
    return NextResponse.json({ ok: true, assets });
  } catch (error) {
    console.error("[api/admin/media] GET error:", error);
    const assets = await getStoredMedia();
    return NextResponse.json({ ok: true, assets });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    if (!payload.url) {
      return NextResponse.json({ error: "Media file URL/content is required" }, { status: 400 });
    }

    const saved = await saveStoredMediaAsset(payload);

    revalidatePath("/admin/media");
    revalidatePath("/");

    return NextResponse.json({ ok: true, asset: saved });
  } catch (error) {
    console.error("[api/admin/media] POST error:", error);
    return NextResponse.json({ error: "Failed to save media asset" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing media asset id" }, { status: 400 });
    }

    await deleteStoredMediaAsset(id);

    revalidatePath("/admin/media");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/media] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete media asset" }, { status: 500 });
  }
}
