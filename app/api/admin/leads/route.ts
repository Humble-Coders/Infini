import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole, LEADS_ROLES } from "@/lib/auth/requireApiRole";
import {
  getStoredLeads,
  updateStoredLeadStatus,
  addStoredLeadNote,
  deleteStoredLead,
  isLeadStatus,
} from "@/lib/data/leadsStorage";

const NOTE_MAX = 2000;

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, LEADS_ROLES);
    if (guard.error) return guard.error;

    const leads = await getStoredLeads();
    return NextResponse.json({ ok: true, leads });
  } catch (error) {
    console.error("[api/admin/leads] GET error:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, LEADS_ROLES);
    if (guard.error) return guard.error;

    const body = await request.json();
    const { id, status, note } = body;

    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }
    if (status !== undefined && !isLeadStatus(status)) {
      return NextResponse.json({ error: "Unknown lead status" }, { status: 400 });
    }
    if (note !== undefined && (typeof note !== "string" || note.trim().length === 0 || note.length > NOTE_MAX)) {
      return NextResponse.json({ error: `Notes must be 1–${NOTE_MAX} characters` }, { status: 400 });
    }

    if (status && !(await updateStoredLeadStatus(id, status))) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (note && !(await addStoredLeadNote(id, note.trim()))) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/leads] PATCH error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, LEADS_ROLES);
    if (guard.error) return guard.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    await deleteStoredLead(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/admin/leads] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
