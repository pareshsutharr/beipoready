import type { IpoStatus } from "@/lib/ipos";

/**
 * Single source of truth for status colors. Reused by IpoCard, IpoTableView and
 * the ticker strip so the palette only ever needs to change in one place.
 * Color is always paired with the `label` text — never the sole signal (WCAG).
 */
export const STATUS_TOKENS: Record<
  IpoStatus,
  { label: string; dot: string; badge: string; cardTint: string; rowTint: string }
> = {
  live: {
    label: "Live",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cardTint: "bg-emerald-50/70 border-emerald-200",
    rowTint: "bg-emerald-50/60",
  },
  upcoming: {
    label: "Upcoming",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-800 ring-amber-200",
    cardTint: "bg-amber-50/70 border-amber-200",
    rowTint: "bg-amber-50/60",
  },
  closed: {
    label: "Closed",
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    cardTint: "bg-white border-slate-200",
    rowTint: "",
  },
};

export const SEGMENT_LABEL: Record<"mainboard" | "sme", string> = {
  mainboard: "Mainboard",
  sme: "SME",
};
