import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";

const REAL_CERTS = [
  {
    id: "iso-9001-2015",
    name: "ISO 9001:2015",
    certificateNumber: "Q-000001",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: "Quality management system certification covering process controls, precision micro-machining, and contract surface finishing.",
    fileUrl: "/docs/iso-9001-2015-infini.pdf",
    fileName: "iso-9001-2015-infini.pdf",
    order: 1,
    published: true,
  },
  {
    id: "iso-13485-2016",
    name: "ISO 13485:2016",
    certificateNumber: "M-000002",
    issuedDate: "01 Mar 2024",
    validUntil: "28 Feb 2027",
    description: "Medical device quality management alignment for orthopedic implant, titanium bone plate, and surgical instrument surface finishing.",
    fileUrl: "/docs/iso-13485-medical-infini.pdf",
    fileName: "iso-13485-medical-infini.pdf",
    order: 2,
    published: true,
  },
  {
    id: "iso-14001-2015",
    name: "ISO 14001:2015",
    certificateNumber: "E-000003",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: "Environmental management system certification for plant operations and sustainable surface finishing facilities.",
    fileUrl: "/docs/iso-14001-2015-infini.pdf",
    fileName: "iso-14001-2015-infini.pdf",
    order: 3,
    published: true,
  },
  {
    id: "iso-45001-2018",
    name: "ISO 45001:2018",
    certificateNumber: "H-000004",
    issuedDate: "15 Jan 2024",
    validUntil: "14 Jan 2027",
    description: "Occupational health and safety management system certification for precision workshop operations.",
    fileUrl: "/docs/iso-45001-2018-infini.pdf",
    fileName: "iso-45001-2018-infini.pdf",
    order: 4,
    published: true,
  },
  {
    id: "udyam-registration",
    name: "Udyam Registration",
    certificateNumber: "UDYAM-HP-00-0000000",
    issuedDate: "01 Jun 2023",
    validUntil: "Permanent (MSME)",
    description: "Government of India MSME registration for precision engineering manufacturing.",
    fileUrl: "/docs/udyam-registration-infini.pdf",
    fileName: "udyam-registration-infini.pdf",
    order: 5,
    published: true,
  },
];

function parseToTimestamp(dateStr?: string, defaultOffsetYears = 3): Timestamp {
  if (!dateStr || dateStr.toLowerCase().includes("permanent")) {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 50); // far future for permanent
    return Timestamp.fromDate(d);
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return Timestamp.fromDate(parsed);
  }
  const d = new Date();
  d.setFullYear(d.getFullYear() + defaultOffsetYears);
  return Timestamp.fromDate(d);
}

export async function GET() {
  try {
    await requireSession();
    const snapshot = await adminDb.collection("certifications").get();

    if (snapshot.empty) {
      return NextResponse.json({ ok: true, certifications: REAL_CERTS });
    }

    const certifications = snapshot.docs.map((doc) => {
      const data = doc.data();
      const issued = data.issuedDate?.toDate
        ? data.issuedDate.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : data.issuedDate || "15 Jan 2024";

      const valid = data.validUntil?.toDate
        ? data.validUntil.toDate().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        : data.validUntil || "14 Jan 2027";

      return {
        id: doc.id,
        name: data.name || doc.id,
        certificateNumber: data.certificateNumber || "",
        issuedDate: issued,
        validUntil: valid,
        description: data.description || "",
        fileUrl: data.fileUrl || "",
        fileName: data.fileName || "",
        order: typeof data.order === "number" ? data.order : 1,
        published: typeof data.published === "boolean" ? data.published : true,
      };
    });

    certifications.sort((a, b) => a.order - b.order);

    return NextResponse.json({ ok: true, certifications });
  } catch (error) {
    console.error("[api/admin/certifications] GET error:", error);
    return NextResponse.json({ ok: true, certifications: REAL_CERTS });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const payload = await request.json();
    const {
      id,
      name,
      certificateNumber,
      issuedDate,
      validUntil,
      description,
      fileUrl,
      fileName,
      order,
      published,
    } = payload;

    if (!name) {
      return NextResponse.json({ error: "Certificate name is required" }, { status: 400 });
    }

    const docId =
      id ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const issuedTs = parseToTimestamp(issuedDate, 0);
    const validTs = parseToTimestamp(validUntil, 3);

    const docData = {
      name,
      certificateNumber: certificateNumber || "",
      issuedDate: issuedTs,
      validUntil: validTs,
      description: description || "",
      fileUrl: fileUrl || "",
      fileName: fileName || (fileUrl ? fileUrl.split("/").pop() : ""),
      order: typeof order === "number" ? order : 1,
      published: typeof published === "boolean" ? published : true,
    };

    await adminDb.collection("certifications").doc(docId).set(docData, { merge: true });

    revalidatePath("/");
    revalidatePath("/certifications");

    return NextResponse.json({
      ok: true,
      certification: {
        id: docId,
        ...docData,
        issuedDate: issuedDate || "15 Jan 2024",
        validUntil: validUntil || "14 Jan 2027",
      },
    });
  } catch (error) {
    console.error("[api/admin/certifications] POST error:", error);
    return NextResponse.json({ error: "Failed to save certification" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireSession();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing certificate id" }, { status: 400 });
    }

    await adminDb.collection("certifications").doc(id).delete();

    revalidatePath("/");
    revalidatePath("/certifications");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/admin/certifications] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
