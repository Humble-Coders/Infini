import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/session";
import {
  getStoredCompanySettings,
  saveStoredCompanySettings,
} from "@/lib/data/companySettingsStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getStoredCompanySettings();
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("[api/admin/settings] GET error:", error);
    const settings = await getStoredCompanySettings();
    return NextResponse.json({ ok: true, settings });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const saved = await saveStoredCompanySettings(payload);

    // Instantly invalidate public ISR caches so changes appear globally across India, Australia, etc.
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/blue");
    revalidatePath("/capabilities");
    revalidatePath("/", "layout");

    return NextResponse.json({ ok: true, settings: saved });
  } catch (error) {
    console.error("[api/admin/settings] POST error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
