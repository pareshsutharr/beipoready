import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getIpoListingBySlug, getIpoListings } from "@/lib/ipos";
import { buildMetadata } from "@/lib/seo";
import { STATUS_TOKENS } from "@/components/ipo/statusTokens";
import { exchangeBadgeLabel, formatDate, listingKeyFacts, segmentLabel } from "@/components/ipo/format";

export const dynamic = "force-dynamic";

// Live IPO Tracker is hidden for now — see the matching flag in ../page.tsx.
const HIDDEN = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (HIDDEN) return {};
  const { slug } = await params;
  const { listings } = await getIpoListings();
  const listing = getIpoListingBySlug(listings, slug);
  if (!listing) return {};
  return buildMetadata({
    title: `${listing.name} IPO: Dates, Price Band & Lot Size`,
    description: `${listing.name} IPO on ${exchangeBadgeLabel(listing.exchanges, listing.segment)} — issue window ${formatDate(listing.openDate)} to ${formatDate(listing.closeDate)}, price band ${listing.priceBand || "TBA"}.`,
    path: `/ipo-market/${slug}`,
    keywords: [listing.name, `${listing.name} IPO`, "IPO price band", "IPO lot size"],
  });
}

const NOT_YET_TRACKED = [
  "Company financials (3-year table)",
  "Category-wise subscription (QIB / NII / Retail)",
  "Grey market premium (GMP) history",
  "Anchor investor list",
  "Lead managers & registrar",
  "Risk factors & object of issue",
  "Peer comparison",
  "DRHP / RHP documents",
  "Related news",
];

export default async function IpoDetailPage({ params }: Props) {
  if (HIDDEN) notFound();
  const { slug } = await params;
  const { listings, updatedAt } = await getIpoListings();
  const listing = getIpoListingBySlug(listings, slug);
  if (!listing) notFound();

  const tokens = STATUS_TOKENS[listing.status];
  const sourceLinks = Object.entries(listing.sources) as [string, { sourceUrl: string }][];

  return (
    <main>
      <section className={`border-b border-slate-200 py-12 sm:py-16 ${tokens.cardTint}`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/ipo-market" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-navy hover:text-brand-gold-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to IPO Tracker
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold-ink">
                {exchangeBadgeLabel(listing.exchanges, listing.segment)}
              </span>
              <h1 className="mt-1 font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">{listing.name}</h1>
              <p className="mt-1 text-sm text-slate-500">{segmentLabel(listing.segment)} IPO</p>
            </div>
            <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ring-1 ring-inset ${tokens.badge}`}>
              <span className={`h-2 w-2 rounded-full ${tokens.dot}`} aria-hidden="true" />
              {tokens.label}
            </span>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F9FC] py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-brand-navy">Key facts</h2>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              <Fact label="Issue window" value={`${formatDate(listing.openDate)} – ${formatDate(listing.closeDate)}`} wide />
              {listingKeyFacts(listing).map((fact) => (
                <Fact key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </dl>

            {sourceLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                {sourceLinks.map(([source, info]) => (
                  <a
                    key={source}
                    href={info.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-navy/30 px-4 py-2 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
                  >
                    View on {source.toUpperCase()} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-lg font-bold text-brand-navy">Additional information</h2>
            <p className="mt-2 text-sm text-slate-500">
              Our data pipeline currently tracks issue dates, price band, lot size and issue size from NSE and BSE. The
              sections below aren&apos;t part of our dataset yet — for now, check the official exchange filing linked above.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {NOT_YET_TRACKED.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Updated {updatedAt ? new Date(updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", timeZoneName: "short" }) : "after the next scheduled refresh"}. Data is provided by NSE and BSE — verify issue terms in the official offer documents before investing.
          </p>
        </div>
      </section>
    </main>
  );
}

function Fact({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 sm:col-span-3" : ""}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold text-slate-700">{value}</dd>
    </div>
  );
}
