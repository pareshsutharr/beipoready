import type { IpoListing, IpoSegment, IpoSource } from "@/lib/ipos";
import { SEGMENT_LABEL } from "./statusTokens";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const numberFormatter = new Intl.NumberFormat("en-IN");

export function formatDate(value: string | null): string {
  return value ? dateFormatter.format(new Date(`${value}T00:00:00Z`)) : "—";
}

export function formatShares(value: string | null): string {
  if (!value) return "—";
  const numeric = Number(value.replace(/,/g, ""));
  return Number.isFinite(numeric) ? `${numberFormatter.format(numeric)} shares` : value;
}

export function exchangeBadgeLabel(exchanges: IpoSource[], segment: IpoSegment): string {
  const suffix = segment === "sme" ? " SME" : "";
  return exchanges.map((exchange) => `${exchange.toUpperCase()}${suffix}`).join(", ");
}

export function segmentLabel(segment: IpoSegment): string {
  return SEGMENT_LABEL[segment];
}

const AVATAR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export function avatarClasses(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "");
  return letters.join("") || "?";
}

export function daysLeftLabel(days: number | null): string {
  if (days === null) return "";
  if (days <= 0) return "Closes today";
  if (days === 1) return "1 day left";
  return `${days} days left`;
}

export function indiaTodayIso(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts();
  const part = (type: string) => parts.find((item) => item.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function daysUntil(dateIso: string | null, todayIso: string): number | null {
  if (!dateIso) return null;
  const target = new Date(`${dateIso}T00:00:00Z`).getTime();
  const today = new Date(`${todayIso}T00:00:00Z`).getTime();
  if (Number.isNaN(target)) return null;
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
}

export function listingKeyFacts(listing: IpoListing) {
  return [
    { label: "Price band", value: listing.priceBand || "—" },
    { label: "Lot size", value: listing.lotSize ? `${listing.lotSize} shares` : "—" },
    { label: "Issue size", value: formatShares(listing.issueSize) },
  ];
}
