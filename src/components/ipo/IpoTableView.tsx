"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { IpoListing } from "@/lib/ipos";
import { STATUS_TOKENS } from "./statusTokens";
import { exchangeBadgeLabel, formatDate, formatShares, segmentLabel } from "./format";
import IpoCard from "./IpoCard";

type SortKey = "name" | "segment" | "openDate" | "closeDate" | "status";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Company" },
  { key: "segment", label: "Type" },
  { key: "openDate", label: "Open" },
  { key: "closeDate", label: "Close" },
  { key: "status", label: "Status" },
];

const STATUS_ORDER = { live: 0, upcoming: 1, closed: 2 };

export default function IpoTableView({ listings }: { listings: IpoListing[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("status");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    const copy = [...listings];
    copy.sort((a, b) => {
      let result = 0;
      if (sortKey === "status") result = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
      else if (sortKey === "openDate") result = (a.openDate || "").localeCompare(b.openDate || "");
      else if (sortKey === "closeDate") result = (a.closeDate || "").localeCompare(b.closeDate || "");
      else if (sortKey === "segment") result = a.segment.localeCompare(b.segment);
      else result = a.name.localeCompare(b.name);
      return sortDir === "asc" ? result : -result;
    });
    return copy;
  }, [listings, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <>
      {/* Table view on sm+; tables don't scan well on narrow screens, so mobile always gets the compact card list. */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th key={column.key} scope="col" className="border-b border-slate-200 px-3 py-2 text-left">
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-brand-navy"
                  >
                    {column.label}
                    {sortKey === column.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                    )}
                  </button>
                </th>
              ))}
              <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Price band</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Lot size</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Issue size</th>
              <th scope="col" className="border-b border-slate-200 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((listing) => {
              const tokens = STATUS_TOKENS[listing.status];
              return (
                <tr key={listing.id} className={tokens.rowTint}>
                  <td className="border-b border-slate-100 px-3 py-3 font-semibold text-brand-navy">
                    <div>{listing.name}</div>
                    <div className="text-xs font-normal text-slate-500">{exchangeBadgeLabel(listing.exchanges, listing.segment)}</div>
                  </td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{segmentLabel(listing.segment)}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{formatDate(listing.openDate)}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{formatDate(listing.closeDate)}</td>
                  <td className="border-b border-slate-100 px-3 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${tokens.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${tokens.dot}`} aria-hidden="true" />
                      {tokens.label}
                    </span>
                  </td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{listing.priceBand || "—"}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{listing.lotSize ? `${listing.lotSize} shares` : "—"}</td>
                  <td className="border-b border-slate-100 px-3 py-3 text-slate-600">{formatShares(listing.issueSize)}</td>
                  <td className="border-b border-slate-100 px-3 py-3">
                    <Link href={`/ipo-market/${listing.id}`} className="font-bold text-brand-navy hover:text-brand-gold-ink">
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile fallback: tables don't work on narrow screens, so render the same data as cards. */}
      <div className="grid gap-4 sm:hidden">
        {sorted.map((listing) => (
          <IpoCard key={listing.id} listing={listing} />
        ))}
      </div>
    </>
  );
}
