import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/session";
import { getStoredEventBanner, saveStoredEventBanner } from "@/lib/data/eventBannerStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await getStoredEventBanner();
    return NextResponse.json({ ok: true, config });
  } catch (error) {
    console.error("[api/admin/events] GET error:", error);
    const config = await getStoredEventBanner();
    return NextResponse.json({ ok: true, config });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const config = await saveStoredEventBanner(payload);

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, config });
  } catch (error) {
    console.error("[api/admin/events] POST error:", error);
    return NextResponse.json({ error: "Failed to save event banner" }, { status: 500 });
  }
}
