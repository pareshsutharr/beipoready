"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, RefreshCw } from "lucide-react";
import type { IpoListing, IpoSegment, IpoStatus } from "@/lib/ipos";
import { STATUS_TOKENS } from "./statusTokens";
import { indiaTodayIso } from "./format";
import IpoCard from "./IpoCard";
import IpoTableView from "./IpoTableView";
import IpoSidebar from "./IpoSidebar";

type SegmentFilter = IpoSegment | "all";
type StatusFilter = IpoStatus | "all";
type TodayFilter = "none" | "opening" | "closing";
type ViewMode = "cards" | "table";

export default function IpoTracker({ listings, updatedAt }: { listings: IpoListing[]; updatedAt: string | null }) {
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [todayFilter, setTodayFilter] = useState<TodayFilter>("none");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  const today = indiaTodayIso();

  const ticker = useMemo(
    () => ({
      live: listings.filter((l) => l.status === "live").length,
      openingToday: listings.filter((l) => l.openDate === today).length,
      closingToday: listings.filter((l) => l.closeDate === today).length,
    }),
    [listings, today]
  );

  const filtered = useMemo(
    () =>
      listings.filter((listing) => {
        if (segmentFilter !== "all" && listing.segment !== segmentFilter) return false;
        if (statusFilter !== "all" && listing.status !== statusFilter) return false;
        if (todayFilter === "opening" && listing.openDate !== today) return false;
        if (todayFilter === "closing" && listing.closeDate !== today) return false;
        return true;
      }),
    [listings, segmentFilter, statusFilter, todayFilter, today]
  );

  function selectStatus(status: StatusFilter) {
    setStatusFilter(status);
    setTodayFilter("none");
  }

  function selectTicker(kind: "live" | "opening" | "closing") {
    if (kind === "live") {
      setStatusFilter("live");
      setTodayFilter("none");
    } else if (kind === "opening") {
      setStatusFilter("upcoming");
      setTodayFilter("opening");
    } else {
      setStatusFilter("live");
      setTodayFilter("closing");
    }
  }

  return (
    <section className="bg-[#F6F9FC] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Status ticker strip */}
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm sm:gap-4">
          <TickerItem
            tone="live"
            label="Live"
            value={ticker.live}
            active={statusFilter === "live" && todayFilter === "none"}
            onClick={() => selectTicker("live")}
          />
          <TickerItem
            tone="upcoming"
            label="Opening Today"
            value={ticker.openingToday}
            active={todayFilter === "opening"}
            onClick={() => selectTicker("opening")}
          />
          <TickerItem
            tone="live"
            label="Closing Today"
            value={ticker.closingToday}
            active={todayFilter === "closing"}
            onClick={() => selectTicker("closing")}
          />
          <button
            type="button"
            onClick={() => selectStatus("all")}
            className="ml-auto text-xs font-bold text-slate-500 hover:text-brand-navy"
          >
            Clear filters
          </button>
        </div>

        {/* View controls row */}
        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2" aria-label="Segment filter">
            <Pill label="All" selected={segmentFilter === "all"} onClick={() => setSegmentFilter("all")} />
            <Pill label="Mainboard" selected={segmentFilter === "mainboard"} onClick={() => setSegmentFilter("mainboard")} />
            <Pill label="SME" selected={segmentFilter === "sme"} onClick={() => setSegmentFilter("sme")} />
            <span className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />
            <Pill label="All statuses" selected={statusFilter === "all"} onClick={() => selectStatus("all")} />
            <Pill label="Upcoming" selected={statusFilter === "upcoming" && todayFilter === "none"} onClick={() => selectStatus("upcoming")} />
            <Pill label="Closed" selected={statusFilter === "closed"} onClick={() => selectStatus("closed")} />
          </div>
          <div className="flex items-center gap-1 self-start rounded-lg border border-slate-200 bg-white p-1 sm:self-auto" role="group" aria-label="Display mode">
            <ViewButton icon={LayoutGrid} label="Cards" active={viewMode === "cards"} onClick={() => setViewMode("cards")} />
            <ViewButton icon={List} label="Table" active={viewMode === "table"} onClick={() => setViewMode("table")} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-500">
                {updatedAt ? "No IPOs match this filter." : "The first exchange refresh has not completed yet. Please check back shortly."}
              </div>
            ) : viewMode === "cards" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((listing) => (
                  <IpoCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <IpoTableView listings={filtered} />
            )}
          </div>

          <aside>
            <IpoSidebar listings={listings} onStepClick={selectStatus} />
          </aside>
        </div>

        <div className="mt-5 flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p className="flex items-center gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Updated {updatedAt ? new Date(updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", timeZoneName: "short" }) : "after the next scheduled refresh"}
          </p>
          <p>Data is provided by NSE and BSE. Verify issue terms in the official offer documents before investing.</p>
        </div>
      </div>
    </section>
  );
}

function TickerItem({
  tone,
  label,
  value,
  active,
  onClick,
}: {
  tone: IpoStatus;
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}) {
  const tokens = STATUS_TOKENS[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors sm:text-sm ${active ? "bg-brand-navy/10" : "hover:bg-slate-100"}`}
    >
      <span className={`h-2 w-2 rounded-full ${tokens.dot}`} aria-hidden="true" />
      <span className="text-slate-600">{label}:</span>
      <span className="text-brand-navy">{value}</span>
    </button>
  );
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${selected ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
    >
      {label}
    </button>
  );
}

function ViewButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof LayoutGrid;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${active ? "bg-brand-navy text-white" : "text-slate-500 hover:bg-slate-100"}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}
