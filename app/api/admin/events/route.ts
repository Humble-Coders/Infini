import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiRole, CONTENT_ROLES } from "@/lib/auth/requireApiRole";
import { getStoredEventBanner, saveStoredEventBanner } from "@/lib/data/eventBannerStorage";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

    const config = await getStoredEventBanner();
    return NextResponse.json({ ok: true, config });
  } catch (error) {
    console.error("[api/admin/events] GET error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, CONTENT_ROLES);
    if (guard.error) return guard.error;

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
