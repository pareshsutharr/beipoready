import type { Metadata } from "next";
import { notFound } from "next/navigation";
import IpoTracker from "@/components/ipo/IpoTracker";
import { getIpoListings } from "@/lib/ipos";
import { buildMetadata } from "@/lib/seo";

// Live IPO Tracker is hidden for now (unlinked from nav/sitemap and 404s directly).
// Remove this flag to bring the feature back — everything else is left intact.
const HIDDEN = true;

export const metadata: Metadata = buildMetadata({
  title: "Live IPO Tracker: NSE & BSE Public Issues",
  description: "Track current and upcoming IPOs on NSE and BSE, including issue dates, price bands, lot size and issue size.",
  path: "/ipo-market",
  keywords: ["live IPO tracker India", "NSE upcoming IPO", "BSE public issues", "IPO dates and price band"],
});

export const dynamic = "force-dynamic";

export default async function IpoMarketPage() {
  if (HIDDEN) notFound();
  const { listings, updatedAt } = await getIpoListings();
  return (
    <main>
      <section className="relative overflow-hidden bg-brand-navy py-16 sm:py-20">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_10%,#F59E0B_0,transparent_24%),radial-gradient(circle_at_80%_85%,#2563EB_0,transparent_27%)]" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">Market intelligence</p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-white sm:text-5xl">Live IPO Tracker</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">One place to see current and upcoming public issues from NSE and BSE, refreshed daily for IPO planning and market research.</p>
        </div>
      </section>
      <IpoTracker listings={listings} updatedAt={updatedAt} />
    </main>
  );
}
