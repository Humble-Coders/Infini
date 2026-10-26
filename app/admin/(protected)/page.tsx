import { requireSession } from "@/lib/auth/requireRole";
import { ModernDashboard } from "@/components/admin/ModernDashboard";
import { getStoredEventBanner } from "@/lib/data/eventBannerStorage";
import { getStoredCaseStudies } from "@/lib/data/caseStudiesStorage";
import { getStoredTestimonials } from "@/lib/data/testimonialsStorage";
import { getStoredCompanySettings } from "@/lib/data/companySettingsStorage";
import { getStoredLeads } from "@/lib/data/leadsStorage";

/** This request's server time (the page is dynamic, so it is the time of this visit). */
function renderedAt(): number {
  return Date.now();
}

export default async function AdminDashboardPage() {
  const session = await requireSession();
  // Leads carry customer contact details: same roles as the leads rules.
  const canSeeLeads = session.role === "superAdmin" || session.role === "leadsManager";

  const [eventBanner, caseStudies, testimonials, companySettings, leads] = await Promise.all([
    getStoredEventBanner(),
    getStoredCaseStudies(),
    getStoredTestimonials(),
    getStoredCompanySettings(),
    canSeeLeads ? getStoredLeads() : Promise.resolve([]),
  ]);

  return (
    <div className="w-full">
      <ModernDashboard
        email={session.email}
        role={session.role}
        now={renderedAt()}
        initialData={{
          eventBanner,
          caseStudies,
          testimonials,
          companySettings,
          leads,
        }}
      />
    </div>
  );
}
