import { requireSession } from "@/lib/auth/requireRole";
import { ModernDashboard } from "@/components/admin/ModernDashboard";
import { getStoredEventBanner } from "@/lib/data/eventBannerStorage";
import { getStoredCaseStudies } from "@/lib/data/caseStudiesStorage";
import { getStoredTestimonials } from "@/lib/data/testimonialsStorage";
import { getStoredCompanySettings } from "@/lib/data/companySettingsStorage";
import { getStoredLeads } from "@/lib/data/leadsStorage";

export default async function AdminDashboardPage() {
  const session = await requireSession();

  const [eventBanner, caseStudies, testimonials, companySettings, leads] = await Promise.all([
    getStoredEventBanner(),
    getStoredCaseStudies(),
    getStoredTestimonials(),
    getStoredCompanySettings(),
    getStoredLeads(),
  ]);

  return (
    <div className="w-full">
      <ModernDashboard
        email={session.email}
        role={session.role}
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
