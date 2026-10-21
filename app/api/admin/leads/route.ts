import "server-only";

import { NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";
import { DEMO_LEADS, type LeadRecord } from "@/lib/demo/leads";

export async function GET(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Single Lead Detail Retrieval
    if (id) {
      try {
        const doc = await adminDb.collection("leads").doc(id).get();
        if (doc.exists) {
          const data = doc.data()!;
          const createdAt = data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recent";

          const lead: LeadRecord = {
            id: doc.id,
            name: data.name || "Anonymous",
            company: data.company || "Individual / Private",
            email: data.email || "",
            phone: data.phone || "",
            industry: data.industry || "General",
            message: data.message || "",
            imageUrl: data.imageUrl || null,
            createdAt,
            status: data.status === "new" ? "New" : (data.status as LeadRecord["status"]) || "New",
            notes: data.notes || [],
            emailLogs: data.emailLogs || [],
          };
          return NextResponse.json({ ok: true, lead });
        }
      } catch {
        // Fall through to demo leads fallback
      }

      // Check demo leads fallback
      const demoMatch = DEMO_LEADS.find((l) => l.id === id);
      if (demoMatch) {
        return NextResponse.json({ ok: true, lead: demoMatch });
      }

      return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
    }

    // List of Leads
    const snapshot = await adminDb
      .collection("leads")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const leads: LeadRecord[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Recent";

      return {
        id: doc.id,
        name: data.name || "Anonymous",
        company: data.company || "Individual / Private",
        email: data.email || "",
        phone: data.phone || "",
        industry: data.industry || "General",
        message: data.message || "",
        imageUrl: data.imageUrl || null,
        createdAt,
        status: data.status === "new" ? "New" : (data.status as LeadRecord["status"]) || "New",
        notes: data.notes || [],
        emailLogs: data.emailLogs || [],
      };
    });

    return NextResponse.json({ ok: true, leads });
  } catch {
    // In local dev without live Firestore configuration, return demo leads smoothly
    return NextResponse.json({ ok: true, leads: DEMO_LEADS });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const { id, status, note, emailLog } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    const leadRef = adminDb.collection("leads").doc(id);
    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
    }

    if (note) {
      const doc = await leadRef.get();
      const existingNotes = doc.exists ? doc.data()?.notes || [] : [];
      updateData.notes = [...existingNotes, note];
    }

    if (emailLog) {
      const doc = await leadRef.get();
      const existingEmailLogs = doc.exists ? doc.data()?.emailLogs || [] : [];
      updateData.emailLogs = [...existingEmailLogs, emailLog];
    }

    await leadRef.set(updateData, { merge: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    await adminDb.collection("leads").doc(id).delete();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
