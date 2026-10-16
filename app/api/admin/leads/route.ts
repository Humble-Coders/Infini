import "server-only";

import { NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";

export async function GET() {
  try {
    await requireSession();

    const snapshot = await adminDb
      .collection("leads")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const leads = snapshot.docs.map((doc) => {
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
        status: data.status === "new" ? "New" : data.status || "New",
        notes: data.notes || [],
      };
    });

    return NextResponse.json({ ok: true, leads });
  } catch {
    // In local dev without live Firestore configuration, return empty list gracefully
    return NextResponse.json({ ok: true, leads: [] });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireSession();
    const body = await request.json();
    const { id, status, note } = body;

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
      const existingNotes = doc.data()?.notes || [];
      updateData.notes = [...existingNotes, note];
    }

    await leadRef.update(updateData);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
