// ────────────────────────────────────────────────────────────────
// NSE EMERGE / BSE SME eligibility rules engine.
//
// Encodes the current listing criteria (post-2024 SEBI amendments:
// 20% OFS cap, GCP cap, FCFE test, RPT materiality threshold) as a
// set of small, independently testable rules. Each rule reads the
// questionnaire answers and returns a pass/fail/flag/pending result
// for one or both exchanges. This is an indicative readiness check,
// not a substitute for due diligence, see the disclaimer on the
// Get Listed page.
// ────────────────────────────────────────────────────────────────

import type { EligibilityCheckResult, RuleStatus } from "@/types";

export type Exchange = "nse" | "bse";

export type TrackRecord = "lt1" | "1to2" | "2to3" | "3plus";

export type EligibilityAnswers = {
  company: string;
  incDate: string;
  industry: string;
  converted: boolean | null;
  track: TrackRecord | null;
  promoterExp: boolean | null;
  appraised: boolean | null;
  fullFY: boolean | null;
  nameChange: boolean | null;
  nameRev: boolean | null;
  promoterChange: boolean | null;
  nw1: number | null;
  nw2: number | null;
  nta: number | null;
  opYears: number | null;
  opLatest: boolean | null;
  fcfeYears: number | null;
  leverage: number | null;
  financeCo: boolean | null;
  postCap: number | null;
  issueSize: number | null;
  ofsAmt: number | null;
  sellPct: number | null;
  gcp: number | null;
  objects: string[];
  objectOther: string;
  rejected: boolean | null;
  bifr: boolean | null;
  winding: boolean | null;
  defaults: boolean | null;
  pastDefault: boolean | null;
  regAction: boolean | null;
  criminal: boolean | null;
  litigation: boolean | null;
  rpt: boolean | null;
  audited: boolean | null;
};

export const EMPTY_ANSWERS: EligibilityAnswers = {
  company: "",
  incDate: "",
  industry: "",
  converted: null,
  track: null,
  promoterExp: null,
  appraised: null,
  fullFY: null,
  nameChange: null,
  nameRev: null,
  promoterChange: null,
  nw1: null,
  nw2: null,
  nta: null,
  opYears: null,
  opLatest: null,
  fcfeYears: null,
  leverage: null,
  financeCo: null,
  postCap: null,
  issueSize: null,
  ofsAmt: null,
  sellPct: null,
  gcp: null,
  objects: [],
  objectOther: "",
  rejected: null,
  bifr: null,
  winding: null,
  defaults: null,
  pastDefault: null,
  regAction: null,
  criminal: null,
  litigation: null,
  rpt: null,
  audited: null,
};

type RuleOutcome = { status: RuleStatus; message: string };

const PASS = (message: string): RuleOutcome => ({ status: "pass", message });
const FAIL = (message: string): RuleOutcome => ({ status: "fail", message });
const FLAG = (message: string): RuleOutcome => ({ status: "flag", message });
const PENDING: RuleOutcome = { status: "pending", message: "Not answered yet" };

type Rule = {
  id: string;
  label: string;
  exchanges: Exchange[];
  fn: (a: EligibilityAnswers) => RuleOutcome;
};

export const RULES: Rule[] = [
  {
    id: "cap",
    label: "Post-issue paid-up capital",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.postCap === null
        ? PENDING
        : a.postCap > 25
        ? FAIL("Above the ₹25 Cr SME ceiling — this is a Mainboard issue")
        : a.postCap < 1
        ? FAIL("Below the ₹1 Cr minimum for the SME platform")
        : PASS("Within the ₹1–25 Cr band"),
  },
  {
    id: "track-nse",
    label: "Track record",
    exchanges: ["nse"],
    fn: (a) => {
      if (!a.track) return PENDING;
      if (a.track === "3plus") return PASS("3+ years of operations");
      if (a.promoterExp === null) return PENDING;
      return a.promoterExp
        ? PASS("Qualifies through the promoters' 3-year record")
        : FAIL("Under 3 years, and the promoter route does not apply");
    },
  },
  {
    id: "track-bse",
    label: "Track record",
    exchanges: ["bse"],
    fn: (a) => {
      if (!a.track) return PENDING;
      if (a.track === "3plus") return PASS("3+ years of operations");
      if (a.appraised === null) return PENDING;
      if (a.appraised) {
        if (a.fullFY === null) return PENDING;
        return a.fullFY
          ? PASS("Qualifies through the appraised-project route")
          : FAIL("The appraised route still needs 1 full FY of operations and audited results");
      }
      return FAIL("Under 3 years, and the project is not appraised and funded");
    },
  },
  {
    id: "net-worth",
    label: "Net worth",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.nw1 === null || a.nw2 === null
        ? PENDING
        : a.nw1 >= 1 && a.nw2 >= 1
        ? PASS("At least ₹1 Cr in both preceding years")
        : FAIL("Needs to be positive and at least ₹1 Cr in each of the last two full years"),
  },
  {
    id: "nta",
    label: "Net tangible assets",
    exchanges: ["bse"],
    fn: (a) =>
      a.nta === null
        ? PENDING
        : a.nta >= 3
        ? PASS("₹3 Cr threshold met")
        : FAIL("BSE SME requires ₹3 Cr in the last full year"),
  },
  {
    id: "op-nse",
    label: "Operating profit",
    exchanges: ["nse"],
    fn: (a) =>
      a.opYears === null
        ? PENDING
        : a.opYears >= 2
        ? PASS("₹1 Cr EBDT in at least 2 of 3 years")
        : FAIL("Needs ₹1 Cr EBDT in any 2 of the last 3 years"),
  },
  {
    id: "op-bse",
    label: "Operating profit",
    exchanges: ["bse"],
    fn: (a) => {
      const appraisalRoute = a.track !== null && a.track !== "3plus" && a.appraised === true;
      if (appraisalRoute) {
        if (a.opLatest === null) return PENDING;
        return a.opLatest
          ? PASS("Positive operating profit in the last full year — enough on the appraised route")
          : FAIL("The appraised route still needs positive operating profit in one full preceding year");
      }
      if (a.opYears === null || a.opLatest === null) return PENDING;
      if (a.opYears < 2) return FAIL("Needs ₹1 Cr EBDT in 2 of the last 3 years");
      if (!a.opLatest) return FAIL("Also needs operating profit in the full year preceding the application");
      return PASS("₹1 Cr EBDT in 2 of 3 years, and profit in the latest year");
    },
  },
  {
    id: "fcfe",
    label: "Free cash flow to equity",
    exchanges: ["nse"],
    fn: (a) =>
      a.fcfeYears === null
        ? PENDING
        : a.fcfeYears >= 2
        ? PASS("FCFE in at least 2 of 3 years")
        : FAIL("NSE EMERGE requires FCFE in any 2 of the last 3 years"),
  },
  {
    id: "leverage",
    label: "Leverage ratio",
    exchanges: ["bse"],
    fn: (a) =>
      a.leverage === null
        ? PENDING
        : a.leverage <= 3
        ? PASS("Within the 3:1 cap")
        : a.financeCo
        ? FLAG("Above 3:1 — relaxation may be sought as a finance company")
        : FAIL("Above the 3:1 cap"),
  },
  {
    id: "name-change",
    label: "Name change",
    exchanges: ["bse"],
    fn: (a) => {
      if (a.nameChange === null) return PENDING;
      if (!a.nameChange) return PASS("No change in the last year");
      if (a.nameRev === null) return PENDING;
      return a.nameRev
        ? PASS("50% of revenue comes from the new-name activity")
        : FAIL("The new-name activity must contribute 50% of revenue in the preceding full year");
    },
  },
  {
    id: "promoter-change",
    label: "Change in promoters",
    exchanges: ["bse"],
    fn: (a) =>
      a.promoterChange === null
        ? PENDING
        : !a.promoterChange
        ? PASS("Promoters unchanged for a year")
        : FAIL("BSE SME does not allow a promoter change in the year before the application"),
  },
  {
    id: "rejected",
    label: "Prior rejection",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.rejected === null
        ? PENDING
        : !a.rejected
        ? PASS("No rejection in the last 6 months")
        : FAIL("A fresh application is barred for 6 complete months after a rejection"),
  },
  {
    id: "bifr",
    label: "BIFR / insolvency",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.bifr === null ? PENDING : !a.bifr ? PASS("Clean") : FAIL("A BIFR reference or admitted IBC proceeding bars the listing"),
  },
  {
    id: "winding",
    label: "Winding-up petition",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.winding === null
        ? PENDING
        : !a.winding
        ? PASS("None admitted")
        : FAIL("An admitted winding-up petition bars the listing"),
  },
  {
    id: "defaults",
    label: "Pending defaults",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.defaults === null
        ? PENDING
        : !a.defaults
        ? PASS("No pending defaults")
        : FAIL("Pending defaults to debenture, bond or deposit holders must be cleared first"),
  },
  {
    id: "ofs",
    label: "Offer for sale",
    exchanges: ["nse", "bse"],
    fn: (a) => {
      if (a.issueSize === null || a.ofsAmt === null || !a.issueSize) return PENDING;
      const pct = (a.ofsAmt / a.issueSize) * 100;
      if (pct > 20) return FAIL(`OFS is ${pct.toFixed(1)}% of the issue — the cap is 20%`);
      if (a.sellPct !== null && a.sellPct > 50) return FAIL("A selling shareholder cannot offer more than 50% of their holding");
      return PASS(`OFS at ${pct.toFixed(1)}% of the issue`);
    },
  },
  {
    id: "gcp",
    label: "General corporate purposes",
    exchanges: ["nse", "bse"],
    fn: (a) => {
      if (a.gcp === null || a.issueSize === null || !a.issueSize) return PENDING;
      const cap = Math.min(a.issueSize * 0.15, 10);
      return a.gcp <= cap
        ? PASS(`Within the ₹${cap.toFixed(2)} Cr cap`)
        : FAIL(`Exceeds the cap of ₹${cap.toFixed(2)} Cr (lower of 15% or ₹10 Cr)`);
    },
  },
  {
    id: "audited",
    label: "Audited financials",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.audited === null
        ? PENDING
        : a.audited
        ? PASS("Available for the last 3 years")
        : FAIL("Restated, consolidated accounts for 3 years are needed before drafting the DRHP"),
  },
  {
    id: "reg-action",
    label: "Regulatory action",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.regAction === null
        ? PENDING
        : !a.regAction
        ? PASS("Nothing to report")
        : FLAG("Not a bar — but it must be disclosed in the offer document"),
  },
  {
    id: "past-default",
    label: "Past defaults",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.pastDefault === null
        ? PENDING
        : !a.pastDefault
        ? PASS("Nothing to report")
        : FLAG("Disclose 3 years of defaults in the offer document"),
  },
  {
    id: "criminal",
    label: "Directors' record",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.criminal === null
        ? PENDING
        : !a.criminal
        ? PASS("Nothing to report")
        : FLAG("Disclose the charge and its effect on the business — expect exchange scrutiny"),
  },
  {
    id: "litigation",
    label: "Material litigation",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.litigation === null
        ? PENDING
        : !a.litigation
        ? PASS("Nothing to report")
        : FLAG("Nature and status of each litigation must be disclosed"),
  },
  {
    id: "rpt",
    label: "Related party transactions",
    exchanges: ["nse", "bse"],
    fn: (a) =>
      a.rpt === null
        ? PENDING
        : a.rpt
        ? PASS("Mainboard RPT norms can be adopted")
        : FLAG("We will help you put the RPT policy and thresholds in place"),
  },
];

export function evaluateEligibility(a: EligibilityAnswers): EligibilityCheckResult[] {
  return RULES.map((r) => {
    const out = r.fn(a);
    return { id: r.id, label: r.label, exchanges: r.exchanges, status: out.status, message: out.message };
  });
}

export function summarizeExchange(
  results: EligibilityCheckResult[],
  exchange: Exchange
): { status: RuleStatus; why: string } {
  const set = results.filter((r) => r.exchanges.includes(exchange));
  const fails = set.filter((r) => r.status === "fail");
  const pending = set.filter((r) => r.status === "pending");
  const flags = set.filter((r) => r.status === "flag");

  if (fails.length) return { status: "fail", why: `${fails.length} criterion${fails.length > 1 ? "a" : ""} not met` };
  if (pending.length === set.length) return { status: "pending", why: "Answer the questions to see your status" };
  if (pending.length) return { status: "pending", why: `${pending.length} answer${pending.length > 1 ? "s" : ""} still needed` };
  if (flags.length) return { status: "flag", why: `Criteria met · ${flags.length} disclosure${flags.length > 1 ? "s" : ""} to make` };
  return { status: "pass", why: "All criteria met on the answers given" };
}

export function operationalYearsFromDate(incDate: string): number | null {
  if (!incDate) return null;
  const d = new Date(incDate);
  if (Number.isNaN(d.getTime())) return null;
  const years = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
  return years < 0 ? null : Math.floor(years);
}
