import "server-only";

import { NextRequest, NextResponse } from "next/server";
import { requireApiRole, LEADS_ROLES } from "@/lib/auth/requireApiRole";
import { getStoredEventBanner } from "@/lib/data/eventBannerStorage";
import { getStoredCaseStudies } from "@/lib/data/caseStudiesStorage";
import { getStoredTestimonials } from "@/lib/data/testimonialsStorage";
import { getStoredCompanySettings } from "@/lib/data/companySettingsStorage";
import { getStoredLeads } from "@/lib/data/leadsStorage";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireApiRole(request, ["superAdmin", "contentEditor", "leadsManager"]);
    if (guard.error) return guard.error;

    // Leads carry customer contact details: only the roles that may read
    // them in Firestore rules get them here too.
    const canSeeLeads = LEADS_ROLES.includes(guard.session.role);

    const [eventBanner, caseStudies, testimonials, companySettings, leads] = await Promise.all([
      getStoredEventBanner(),
      getStoredCaseStudies(),
      getStoredTestimonials(),
      getStoredCompanySettings(),
      canSeeLeads ? getStoredLeads() : Promise.resolve([]),
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
