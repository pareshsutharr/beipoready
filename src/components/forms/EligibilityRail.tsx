"use client";

import type { EligibilityCheckResult, RuleStatus } from "@/types";
import type { Exchange } from "@/lib/eligibility-rules";
import { summarizeExchange } from "@/lib/eligibility-rules";

const EX_LABEL: Record<Exchange, string> = { nse: "NSE EMERGE", bse: "BSE SME" };

const STATE_LABEL: Record<RuleStatus, string> = {
  pass: "Criteria met",
  fail: "Not eligible yet",
  flag: "Met, with disclosures",
  pending: "In progress",
};

const VERDICT_BOX: Record<RuleStatus, string> = {
  pass: "border-emerald-200 bg-emerald-50",
  fail: "border-red-200 bg-red-50",
  flag: "border-amber-200 bg-amber-50",
  pending: "border-slate-200 bg-slate-50",
};

const VERDICT_TEXT: Record<RuleStatus, string> = {
  pass: "text-emerald-700",
  fail: "text-red-700",
  flag: "text-amber-700",
  pending: "text-slate-500",
};

const DOT: Record<RuleStatus, string> = {
  pass: "bg-emerald-500",
  fail: "bg-red-500",
  flag: "bg-amber-500",
  pending: "bg-slate-300",
};

const ORDER: Record<RuleStatus, number> = { fail: 0, flag: 1, pending: 2, pass: 3 };

export default function EligibilityRail({
  results,
  answered,
  total,
}: {
  results: EligibilityCheckResult[];
  answered: number;
  total: number;
}) {
  const progressPct = total > 0 ? Math.round((answered / total) * 100) : 0;
  const nse = summarizeExchange(results, "nse");
  const bse = summarizeExchange(results, "bse");

  const shown = [...results]
    .filter((r) => r.status !== "pending")
    .sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden lg:sticky lg:top-20">
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400">
          Live eligibility
        </h3>
        <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-brand-gold rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="font-sans text-xs text-slate-400 mt-2 block">
          {answered} of {total} answered
        </span>
      </div>

      <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
        {([nse, bse] as const).map((v, i) => (
          <div key={i} className="p-4">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {EX_LABEL[i === 0 ? "nse" : "bse"]}
            </p>
            <p className={`font-heading font-bold text-sm mt-1.5 leading-tight ${VERDICT_TEXT[v.status]}`}>
              {STATE_LABEL[v.status]}
            </p>
            <p className="font-sans text-xs text-slate-500 mt-1 leading-snug">{v.why}</p>
          </div>
        ))}
      </div>

      <div className="max-h-[46vh] overflow-y-auto">
        {shown.length ? (
          shown.map((r) => (
            <div key={r.id} className="flex gap-2.5 px-5 py-2.5 border-b border-slate-100 last:border-b-0">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${DOT[r.status]}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="font-sans text-xs font-semibold text-slate-700 leading-snug">
                  {r.label}{" "}
                  <span className="font-normal text-slate-400">
                    ({r.exchanges.map((e) => EX_LABEL[e]).join(" · ")})
                  </span>
                </p>
                <p className="font-sans text-xs text-slate-500 mt-0.5 leading-snug">{r.message}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="px-5 py-6 font-sans text-xs text-slate-400 text-center">
            Your results will appear here as you answer.
          </p>
        )}
      </div>

      {results.some((r) => r.status !== "pending") && (
        <div className={`px-5 py-3 border-t ${VERDICT_BOX[nse.status === "fail" || bse.status === "fail" ? "fail" : nse.status === "pending" || bse.status === "pending" ? "pending" : "pass"]}`}>
          <p className="font-sans text-[11px] text-slate-500 leading-snug">
            Indicative only. Our team confirms every criterion against your audited records.
          </p>
        </div>
      )}
    </div>
  );
}
