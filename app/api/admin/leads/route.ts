import "server-only";

import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { getStoredLeads, updateStoredLeadStatus } from "@/lib/data/leadsStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await getStoredLeads();
    return NextResponse.json({ ok: true, leads });
  } catch (error) {
    console.error("[api/admin/leads] GET error:", error);
    const leads = await getStoredLeads();
    return NextResponse.json({ ok: true, leads });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    if (status) {
      await updateStoredLeadStatus(id, status);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/leads] PATCH error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
