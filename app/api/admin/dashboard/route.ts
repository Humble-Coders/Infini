import "server-only";

import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { getStoredEventBanner } from "@/lib/data/eventBannerStorage";
import { getStoredCaseStudies } from "@/lib/data/caseStudiesStorage";
import { getStoredTestimonials } from "@/lib/data/testimonialsStorage";
import { getStoredCompanySettings } from "@/lib/data/companySettingsStorage";
import { getStoredLeads } from "@/lib/data/leadsStorage";

export async function GET() {
  try {
    const session = await verifySession();
    if (!session && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [eventBanner, caseStudies, testimonials, companySettings, leads] = await Promise.all([
      getStoredEventBanner(),
      getStoredCaseStudies(),
      getStoredTestimonials(),
      getStoredCompanySettings(),
      getStoredLeads(),
    ]);

    return NextResponse.json({
      ok: true,
      data: {
        eventBanner,
        caseStudies,
        testimonials,
        companySettings,
        leads,
      },
    });
  } catch (error) {
    console.error("[api/admin/dashboard] GET error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
