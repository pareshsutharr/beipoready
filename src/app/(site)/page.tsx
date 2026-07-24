import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import StatsBanner from "@/components/sections/StatsBanner";
import WhatWeDo from "@/components/sections/WhatWeDo";
import PositioningBanner from "@/components/sections/PositioningBanner";
import BeforeAfter from "@/components/sections/BeforeAfter";
import ToolsPreview from "@/components/sections/ToolsPreview";
import ReadinessJourney from "@/components/sections/ReadinessJourney";
import TeamSection from "@/components/sections/TeamSection";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import CaseStudiesHighlights from "@/components/sections/CaseStudiesHighlights";
import HomeFaq from "@/components/sections/HomeFaq";
import FinalCta from "@/components/sections/FinalCta";
import NewsAlertWidget from "@/components/sections/NewsAlertWidget";
import {
  getNewsAlertItems,
  getPublishedCaseStudies,
  getPublishedClients,
  getSiteStats,
} from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "BEIPOREADY | India's Leading SME IPO Advisor & Growth Capital Expert",
  description:
    "IPO advisory, pre-IPO readiness and growth-capital fundraising for Indian businesses including NSE Emerge & BSE SME listings. Book an IPO readiness call with BEIPOREADY.",
  path: "/",
  keywords: [
    "SME IPO advisor India",
    "IPO readiness assessment",
    "NSE Emerge IPO advisory",
    "BSE SME IPO advisory",
    "pre-IPO fundraising",
    "growth capital advisors India",
  ],
});

export default async function Home() {
  const [stats, clients, caseStudies, newsAlertItems] = await Promise.all([
    getSiteStats(),
    getPublishedClients(),
    getPublishedCaseStudies(),
    getNewsAlertItems(),
  ]);

  return (
    <>
      {/* 1, Hero */}
      <Hero />
      <NewsAlertWidget items={newsAlertItems} />
      <StatsBanner stats={stats} />

      {/* 2, About / What We Do */}
      <WhatWeDo />

      {/* 3, Positioning statement */}
      <PositioningBanner />

      {/* 4, Why go public (before / after) */}
      <BeforeAfter />

      {/* 5, Tools & lead magnets */}
      <ToolsPreview />

      {/* 6, Process */}
      <ReadinessJourney />

      {/* 7, Team */}
      <TeamSection />

      {/* 8, Clients logo wall */}
      <ClientsMarquee clients={clients} />

      {/* 9, Case studies */}
      <CaseStudiesHighlights caseStudies={caseStudies} />

      {/* 10, FAQs (with FAQPage schema) */}
      <HomeFaq />

      {/* 11, Final CTA + lead capture */}
      <FinalCta />
    </>
  );
}
