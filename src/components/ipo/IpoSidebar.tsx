import type { IpoListing, IpoStatus } from "@/lib/ipos";
import { STATUS_TOKENS } from "./statusTokens";
import { daysLeftLabel, daysUntil, formatDate, indiaTodayIso } from "./format";

const STEPS: { key: IpoStatus; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "live", label: "Live" },
  { key: "closed", label: "Closed" },
];

export default function IpoSidebar({
  listings,
  onStepClick,
}: {
  listings: IpoListing[];
  onStepClick?: (status: IpoStatus) => void;
}) {
  const today = indiaTodayIso();
  const counts: Record<IpoStatus, number> = {
    upcoming: listings.filter((l) => l.status === "upcoming").length,
    live: listings.filter((l) => l.status === "live").length,
    closed: listings.filter((l) => l.status === "closed").length,
  };
  const open = listings
    .filter((l) => l.status === "live")
    .map((l) => ({ listing: l, days: daysUntil(l.closeDate, today) }))
    .sort((a, b) => (a.days ?? 999) - (b.days ?? 999));

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-navy">Today&apos;s IPOs</h2>
        <ol className="mt-4 flex items-center justify-between">
          {STEPS.map((step, index) => {
            const tokens = STATUS_TOKENS[step.key];
            return (
              <li key={step.key} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => onStepClick?.(step.key)}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold ring-1 ring-inset ${tokens.badge}`}>
                    {counts[step.key]}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && <span className="mx-1 h-px flex-1 bg-slate-200" aria-hidden="true" />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-navy">Currently Open</h2>
        {open.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No IPOs are open for subscription right now.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {open.map(({ listing, days }) => (
              <li key={listing.id} className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{listing.name}</p>
                  <p className="text-xs text-slate-500">Closes {formatDate(listing.closeDate)}</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                  {daysLeftLabel(days)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
