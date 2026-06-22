import Hero from "@/components/sections/Hero";
import TrustStats from "@/components/sections/TrustStats";
import { Case } from "@/components/ui/cases-with-infinite-scroll";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ReadinessJourney from "@/components/sections/ReadinessJourney";
import CaseStudiesHighlights from "@/components/sections/CaseStudiesHighlights";
import ToolsPreview from "@/components/sections/ToolsPreview";
import { getPublishedClients, getPublishedTestimonials, getSiteStats } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, clients, testimonials] = await Promise.all([
    getSiteStats(),
    getPublishedClients(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <TrustStats stats={stats} />
      <Case clients={clients} />
      <ServicesOverview />
      <ReadinessJourney />
      <CaseStudiesHighlights testimonials={testimonials} />
      <ToolsPreview />
    </>
  );
}
