import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/backend/firebase/admin";
import { requireSession } from "@/lib/auth/requireRole";

export async function GET() {
  try {
    await requireSession();
    const docSnap = await adminDb.collection("settings").doc("global").get();

    if (!docSnap.exists) {
      return NextResponse.json({ ok: true, settings: null });
    }

    const data = docSnap.data() || {};
    const settings = {
      primaryEmail: data.contact?.email || "superfinish@infini.co.in",
      technicalPhone: data.contact?.technicalPhone || "+91 (1792) 234459",
      dispatchPhone: data.contact?.phone || "+91 1792 233216",
      plantAddress: data.contact?.address || "Treatment & validation labs, 1 Taksal Road, Parwanoo, Himachal Pradesh 173220, India",
      googleMapsUrl: data.contact?.googleMapsUrl || "https://maps.google.com/maps?q=1%20Taksal%20Road%2C%20Parwanoo%2C%20Himachal%20Pradesh%20173220&z=14&output=embed",
      linkedin: data.social?.linkedin || "",
      twitter: data.social?.twitter || data.social?.x || "",
      instagram: data.social?.instagram || "",
      youtube: data.social?.youtube || "",
      facebook: data.social?.facebook || "",
      metaTitle: data.defaultSeo?.title || "INFINI | Precision Surface Finishing & MMP Technology",
      metaDescription: data.defaultSeo?.description || "Super precision surface finishing and micro-edge honing for aerospace, medical implants, cutting tools, and critical dies.",
      cookieBannerEnabled: data.cookieBanner?.enabled ?? true,
      logoUrl: data.branding?.logoUrl || "/brand/infini-finish-unlimited.png",
      brochureUrl: data.branding?.brochureUrl || "/docs/infini-precision-capability-brochure.pdf",
    };

    return NextResponse.json({ ok: true, settings });
  } catch (error) {
    console.error("[api/admin/settings] GET error:", error);
    return NextResponse.json({ ok: true, settings: null });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireSession();
    const payload = await request.json();

    const firestoreData = {
      contact: {
        email: payload.primaryEmail || "superfinish@infini.co.in",
        phone: payload.dispatchPhone || "+91 1792 233216",
        technicalPhone: payload.technicalPhone || "+91 (1792) 234459",
        address: payload.plantAddress || "Parwanoo, Himachal Pradesh, India",
        googleMapsUrl: payload.googleMapsUrl || "",
      },
      social: {
        linkedin: payload.linkedin || "",
        twitter: payload.twitter || "",
        x: payload.twitter || "",
        instagram: payload.instagram || "",
        youtube: payload.youtube || "",
        facebook: payload.facebook || "",
      },
      defaultSeo: {
        title: payload.metaTitle || "INFINI | Precision Surface-Finishing",
        description: payload.metaDescription || "Super Precision Surface Finishing",
        ogTitle: payload.metaTitle || "INFINI | Precision Surface-Finishing",
        ogDescription: payload.metaDescription || "Super Precision Surface Finishing",
      },
      cookieBanner: {
        enabled: Boolean(payload.cookieBannerEnabled),
      },
      branding: {
        logoUrl: payload.logoUrl || "",
        brochureUrl: payload.brochureUrl || "",
      },
    };

    await adminDb.collection("settings").doc("global").set(firestoreData, { merge: true });

    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/blue");

    return NextResponse.json({ ok: true, settings: payload });
  } catch (error) {
    console.error("[api/admin/settings] POST error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
