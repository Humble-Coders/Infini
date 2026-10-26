import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireApiRole, SETTINGS_ROLES } from "@/lib/auth/requireApiRole";
import {
  getStoredCompanySettings,
  saveStoredCompanySettings,
} from "@/lib/data/companySettingsStorage";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, SETTINGS_ROLES);
    if (guard.error) return guard.error;

    const settings = await getStoredCompanySettings();
    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("[api/admin/settings] GET error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, SETTINGS_ROLES);
    if (guard.error) return guard.error;

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
