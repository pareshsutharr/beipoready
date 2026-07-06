import Hero from "@/components/sections/Hero";
import StatsBanner from "@/components/sections/StatsBanner";
import WhatWeDo from "@/components/sections/WhatWeDo";
import PositioningBanner from "@/components/sections/PositioningBanner";
import BeforeAfter from "@/components/sections/BeforeAfter";
import ServicesOverview from "@/components/sections/ServicesOverview";
import ToolsPreview from "@/components/sections/ToolsPreview";
import ReadinessJourney from "@/components/sections/ReadinessJourney";
import TeamSection from "@/components/sections/TeamSection";
import { Case } from "@/components/ui/cases-with-infinite-scroll";
import CaseStudiesHighlights from "@/components/sections/CaseStudiesHighlights";
import KnowledgeCorner from "@/components/sections/KnowledgeCorner";
import HomeFaq from "@/components/sections/HomeFaq";
import FinalCta from "@/components/sections/FinalCta";
import {
  getPublishedArticles,
  getPublishedClients,
  getPublishedTestimonials,
  getSiteStats,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, clients, testimonials, articles] = await Promise.all([
    getSiteStats(),
    getPublishedClients(),
    getPublishedTestimonials(),
    getPublishedArticles(),
  ]);

  return (
    <>
      {/* 1 — Hero */}
      <Hero />
      <StatsBanner stats={stats} />

      {/* 2 — About / What We Do */}
      <WhatWeDo />

      {/* 3 — Positioning statement */}
      <PositioningBanner />

      {/* 4 — Why go public (before / after) */}
      <BeforeAfter />

      {/* 5 — Services */}
      <ServicesOverview />

      {/* 6 — Tools & lead magnets */}
      <ToolsPreview />

      {/* 7 — Process */}
      <ReadinessJourney />

      {/* 8 — Team */}
      <TeamSection />

      {/* 9 — Clients logo wall */}
      <Case clients={clients} />

      {/* 10 — Testimonials (hidden until real quotes are published) */}
      <CaseStudiesHighlights testimonials={testimonials} />

      {/* 11 — Knowledge corner */}
      <KnowledgeCorner articles={articles} />

      {/* 12 — FAQs (with FAQPage schema) */}
      <HomeFaq />

      {/* 13 — Final CTA + lead capture */}
      <FinalCta />
    </>
  );
}
