import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/backend/firebase/admin";

export const dynamic = "force-dynamic";

/**
 * Liveness: `GET /api/health` answers 200 while the server process is up.
 * Readiness: `GET /api/health?deep=1` also round-trips Firestore and answers
 * 503 when it can't. Point an uptime monitor at the deep form. Reveals no
 * configuration or data.
 */
export async function GET(request: NextRequest) {
  const deep = new URL(request.url).searchParams.get("deep") === "1";
  if (!deep) return NextResponse.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
  const started = Date.now();
  try {
    await adminDb.collection("settings").doc("global").get();
    return NextResponse.json({ status: "ok", firestoreMs: Date.now() - started }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "degraded", firestore: "unreachable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
