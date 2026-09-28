import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { IpoListing } from "@/lib/ipos";
import { STATUS_TOKENS } from "./statusTokens";
import { avatarClasses, exchangeBadgeLabel, formatDate, initials, listingKeyFacts } from "./format";

export default function IpoCard({ listing }: { listing: IpoListing }) {
  const tokens = STATUS_TOKENS[listing.status];
  const sourceLinks = Object.entries(listing.sources) as [string, { sourceUrl: string }][];

  return (
    <article className={`flex flex-col rounded-xl border p-5 transition-shadow hover:shadow-md ${tokens.cardTint}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg font-heading text-sm font-bold ${avatarClasses(listing.name)}`}
            aria-hidden="true"
          >
            {initials(listing.name)}
          </span>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand-gold-ink">
              {exchangeBadgeLabel(listing.exchanges, listing.segment)}
            </span>
            <h3 className="mt-1 font-heading text-lg font-bold leading-snug text-brand-navy">{listing.name}</h3>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${tokens.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${tokens.dot}`} aria-hidden="true" />
          {tokens.label}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold text-slate-500">
        {formatDate(listing.openDate)} – {formatDate(listing.closeDate)}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-x-3 gap-y-4 border-t border-slate-200/70 pt-4 text-sm">
        {listingKeyFacts(listing).map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs text-slate-500">{fact.label}</dt>
            <dd className="mt-1 font-semibold text-slate-700">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-200/70 pt-4">
        <Link
          href={`/ipo-market/${listing.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-brand-navy/30 px-4 py-2 text-sm font-bold text-brand-navy transition-colors hover:bg-brand-navy hover:text-white"
        >
          View Details
        </Link>
        {sourceLinks.map(([source, info]) => (
          <a
            key={source}
            href={info.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-gold-ink"
          >
            {source.toUpperCase()} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ))}
      </div>
    </article>
  );
}
