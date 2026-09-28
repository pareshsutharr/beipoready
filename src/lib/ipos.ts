import fs from "node:fs/promises";
import path from "node:path";

export type IpoStatus = "upcoming" | "live" | "closed";
export type IpoSource = "nse" | "bse";
export type IpoSegment = "mainboard" | "sme";

export type IpoRecord = {
  id: string;
  source: IpoSource;
  name: string;
  symbol: string | null;
  platform: string | null;
  openDate: string | null;
  closeDate: string | null;
  priceBand: string | null;
  lotSize: string | null;
  issueSize: string | null;
  issueSizeUnit: "shares" | null;
  status: IpoStatus;
  sourceUrl: string;
};

export type IpoPayload = {
  updatedAt: string | null;
  sources: { nse: number; bse: number };
  records: IpoRecord[];
};

/** One IPO as a single company-level listing, merged across every exchange it trades on. */
export type IpoListing = {
  /** Stable slug used for routing, e.g. /ipo-market/leap-india */
  id: string;
  name: string;
  segment: IpoSegment;
  exchanges: IpoSource[];
  openDate: string | null;
  closeDate: string | null;
  priceBand: string | null;
  lotSize: string | null;
  issueSize: string | null;
  issueSizeUnit: "shares" | null;
  status: IpoStatus;
  sources: Partial<Record<IpoSource, { symbol: string | null; platform: string | null; sourceUrl: string }>>;
};

export type IpoListingPayload = {
  updatedAt: string | null;
  listings: IpoListing[];
};

const EMPTY: IpoPayload = { updatedAt: null, sources: { nse: 0, bse: 0 }, records: [] };
const DATA_FILE = path.join(process.cwd(), "data", "ipos.json");

export async function getIpos(): Promise<IpoPayload> {
  try {
    const text = await fs.readFile(DATA_FILE, "utf8");
    const payload = JSON.parse(text) as Partial<IpoPayload>;
    if (!Array.isArray(payload.records)) return EMPTY;
    return {
      updatedAt: typeof payload.updatedAt === "string" ? payload.updatedAt : null,
      sources: { nse: Number(payload.sources?.nse) || 0, bse: Number(payload.sources?.bse) || 0 },
      records: payload.records as IpoRecord[],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return EMPTY;
    throw error;
  }
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\blimited\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string): string {
  if (value !== value.toUpperCase()) return value.trim();
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function firstNonEmpty<T>(values: (T | null | undefined)[]): T | null {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return null;
}

const STATUS_RANK: Record<IpoStatus, number> = { live: 0, upcoming: 1, closed: 2 };

/** Groups per-exchange scrape records into one card-worthy listing per company. */
export function mergeIpoRecords(records: IpoRecord[]): IpoListing[] {
  const groups = new Map<string, IpoRecord[]>();

  for (const record of records) {
    const key = (record.symbol || record.name).toUpperCase().replace(/\s+/g, " ").trim();
    const group = groups.get(key);
    if (group) group.push(record);
    else groups.set(key, [record]);
  }

  const seenSlugs = new Map<string, number>();

  const listings = Array.from(groups.values()).map((group) => {
    const nse = group.find((record) => record.source === "nse");
    const bse = group.find((record) => record.source === "bse");
    const exchanges = Array.from(new Set(group.map((record) => record.source))).sort() as IpoSource[];
    const segment: IpoSegment = group.some((record) => (record.platform || "").toUpperCase() === "SME")
      ? "sme"
      : "mainboard";
    const status = group.reduce<IpoStatus>(
      (best, record) => (STATUS_RANK[record.status] < STATUS_RANK[best] ? record.status : best),
      group[0].status
    );

    const name = titleCase(firstNonEmpty([nse?.name, bse?.name, group[0].name]) as string);
    const baseSlug = slugify(firstNonEmpty([nse?.symbol, bse?.symbol]) as string || name) || "ipo";
    const occurrence = seenSlugs.get(baseSlug) ?? 0;
    seenSlugs.set(baseSlug, occurrence + 1);
    const id = occurrence === 0 ? baseSlug : `${baseSlug}-${occurrence + 1}`;

    const sources: IpoListing["sources"] = {};
    for (const record of group) {
      sources[record.source] = { symbol: record.symbol, platform: record.platform, sourceUrl: record.sourceUrl };
    }

    return {
      id,
      name,
      segment,
      exchanges,
      openDate: firstNonEmpty([nse?.openDate, bse?.openDate]),
      closeDate: firstNonEmpty([nse?.closeDate, bse?.closeDate]),
      priceBand: firstNonEmpty([bse?.priceBand, nse?.priceBand]),
      lotSize: firstNonEmpty([bse?.lotSize, nse?.lotSize]),
      issueSize: firstNonEmpty([bse?.issueSize, nse?.issueSize]),
      issueSizeUnit: firstNonEmpty([bse?.issueSizeUnit, nse?.issueSizeUnit]),
      status,
      sources,
    } satisfies IpoListing;
  });

  return listings.sort((a, b) => {
    if (STATUS_RANK[a.status] !== STATUS_RANK[b.status]) return STATUS_RANK[a.status] - STATUS_RANK[b.status];
    return (a.openDate || "").localeCompare(b.openDate || "") * -1;
  });
}

export async function getIpoListings(): Promise<IpoListingPayload> {
  const payload = await getIpos();
  return { updatedAt: payload.updatedAt, listings: mergeIpoRecords(payload.records) };
}

export function getIpoListingBySlug(listings: IpoListing[], slug: string): IpoListing | null {
  return listings.find((listing) => listing.id === slug) ?? null;
}
