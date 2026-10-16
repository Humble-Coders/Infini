import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";

const INITIAL_CONFIG = {
  enabled: true,
  badge: "Upcoming Exhibition",
  title: "EMO Hannover 2026",
  location: "Hannover, Germany (Hall 11, Booth D32)",
  subtitle: "Visit INFINI at Hall 11, Booth D32 for live MMP precision surface finishing demonstrations",
  ctaText: "Schedule Technical Meeting",
  ctaUrl: "/contact",
  startDate: "2026-09-18",
  endDate: "2026-09-23",
  theme: "red",
};

export async function GET() {
  try {
    await requireSession();
    const docSnap = await adminDb.collection("settings").doc("eventBanner").get();

    if (!docSnap.exists) {
      return NextResponse.json({ ok: true, config: INITIAL_CONFIG });
    }

    return NextResponse.json({ ok: true, config: { ...INITIAL_CONFIG, ...docSnap.data() } });
  } catch (error) {
    console.error("[api/admin/events] GET error:", error);
    return NextResponse.json({ ok: true, config: INITIAL_CONFIG });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const payload = await request.json();

    await adminDb.collection("settings").doc("eventBanner").set(payload, { merge: true });

    revalidatePath("/");

    return NextResponse.json({ ok: true, config: payload });
  } catch (error) {
    console.error("[api/admin/events] POST error:", error);
    return NextResponse.json({ error: "Failed to save event banner" }, { status: 500 });
  }
}
