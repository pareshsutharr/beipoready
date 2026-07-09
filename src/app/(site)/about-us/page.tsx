import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import { getPublishedClients } from "@/lib/cms";

export const metadata: Metadata = {
  title: "About BEIPOREADY | India's Leading SME IPO Advisor & Growth Capital Experts",
  description:
    "Meet the team behind BEIPOREADY — India's IPO advisory and growth-capital specialists helping businesses raise capital, get IPO-ready, and list on NSE Emerge & BSE SME.",
  keywords: [
    "about BEIPOREADY",
    "IPO advisory firm India",
    "SME IPO consultants",
    "growth capital advisors",
    "our team",
    "our journey",
  ],
};

export const dynamic = "force-dynamic";

export default async function AboutUsPage() {
  const clients = await getPublishedClients();

  return <AboutContent clients={clients} />;
}
