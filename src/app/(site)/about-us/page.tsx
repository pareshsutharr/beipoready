import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import { getPublishedClients } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About Our SME IPO Advisors",
  description:
    "Meet the BEIPOREADY team helping Indian businesses raise capital, improve IPO readiness, and list on NSE Emerge, BSE SME, and the Main Board.",
  path: "/about-us",
  keywords: [
    "about BEIPOREADY",
    "IPO advisory firm India",
    "SME IPO consultants",
    "growth capital advisors",
    "our team",
    "our journey",
  ],
});

export default async function AboutUsPage() {
  const clients = await getPublishedClients();

  return <AboutContent clients={clients} />;
}
