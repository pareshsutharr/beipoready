"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Indicative industry cost ranges for an SME IPO, in ₹ Lakhs.
 * `pctOfIssue` components scale with issue size; the rest are broadly fixed.
 * These are directional ballparks only — actuals depend on intermediaries,
 * issue structure and timeline.
 */
const FIXED_COSTS = [
  { label: "Legal counsel & due diligence", low: 10, high: 20 },
  { label: "Auditor fees & financial restatement", low: 5, high: 15 },
  { label: "Registrar & share transfer agent", low: 2, high: 5 },
  { label: "Exchange, SEBI & regulatory fees", low: 3, high: 8 },
  { label: "Marketing, advertising & roadshows", low: 10, high: 25 },
  { label: "Printing, stationery & miscellaneous", low: 3, high: 7 },
  { label: "Market making (3-year obligation)", low: 8, high: 15 },
];

const LM_PCT_LOW = 0.025; // lead manager fees, % of issue size
const LM_PCT_HIGH = 0.04;
const LM_MIN_LAKHS = 25;

function fmtLakhs(lakhs: number) {
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
  return `₹${Math.round(lakhs)} L`;
}

export default function IssueCostEstimator() {
  const [issueSize, setIssueSize] = useState(""); // ₹ Crore
  const [showResult, setShowResult] = useState(false);

  // "email me this breakdown" lead capture
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success">("idle");
  const [leadError, setLeadError] = useState<string | null>(null);

  const size = parseFloat(issueSize);
  const isValid = !Number.isNaN(size) && size > 0;

  const sizeLakhs = isValid ? size * 100 : 0;
  const lmLow = Math.max(LM_MIN_LAKHS, sizeLakhs * LM_PCT_LOW);
  const lmHigh = Math.max(LM_MIN_LAKHS, sizeLakhs * LM_PCT_HIGH);
  const rows = [
    { label: "Merchant banker / lead manager fees", low: lmLow, high: lmHigh },
    ...FIXED_COSTS,
  ];
  const totalLow = rows.reduce((n, r) => n + r.low, 0);
  const totalHigh = rows.reduce((n, r) => n + r.high, 0);

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setLeadError(null);
    if (!name.trim()) { setLeadError("Name is required."); return; }
    if (!EMAIL_RE.test(email.trim())) { setLeadError("Enter a valid email address."); return; }

    setLeadStatus("loading");
    const supabase = createClient();
    // No .select() after .insert(); anon visitors can submit leads but cannot read them.
    const { error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim(),
      message: `Issue cost estimate requested for issue size ₹${size} Cr (indicative total ${fmtLakhs(totalLow)}–${fmtLakhs(totalHigh)}).`,
      source: "issue-cost-estimator",
    });
    if (error) {
      setLeadError("Something went wrong. Please try again or email us directly.");
      setLeadStatus("idle");
      return;
    }
    setLeadStatus("success");
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
      <h2 className="font-serif text-xl font-bold text-brand-navy mb-6">
        Estimate Your Issue Cost
      </h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="ice-size" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
            Planned Issue Size (₹ Crore) <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="ice-size"
            type="number"
            min="1"
            step="0.5"
            value={issueSize}
            onChange={(e) => { setIssueSize(e.target.value); setShowResult(false); }}
            placeholder="e.g. 20"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
          />
          <p className="font-sans text-xs text-slate-400 mt-1">
            Not sure how much you can raise? Try the{" "}
            <Link href="/issue-size-calculator" className="text-brand-gold font-semibold hover:underline">
              Issue Size Calculator
            </Link>{" "}
            first.
          </p>
        </div>

        <button
          onClick={() => setShowResult(true)}
          disabled={!isValid}
          className="w-full py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold cursor-pointer"
        >
          Estimate Cost →
        </button>
      </div>

      {showResult && isValid && (
        <div className="mt-8">
          <h3 className="font-serif text-lg font-bold text-brand-navy mb-4">
            Indicative cost for a ₹{size} Cr SME IPO
          </h3>

          <div className="overflow-hidden rounded-xl border border-slate-200 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-navy">
                  <th scope="col" className="px-4 py-3 text-left font-bold text-white">Cost component</th>
                  <th scope="col" className="px-4 py-3 text-right font-bold text-white whitespace-nowrap">Indicative range</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} style={{ background: i % 2 ? "#FEFBF2" : "#fff" }}>
                    <td className="px-4 py-3 text-slate-600">{r.label}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-medium whitespace-nowrap">
                      {fmtLakhs(r.low)} – {fmtLakhs(r.high)}
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-brand-gold/40" style={{ background: "#FEF3C7" }}>
                  <td className="px-4 py-3 font-bold text-brand-navy">Estimated total</td>
                  <td className="px-4 py-3 text-right font-bold text-brand-navy whitespace-nowrap">
                    {fmtLakhs(totalLow)} – {fmtLakhs(totalHigh)}
                  </td>
                </tr>
                <tr style={{ background: "#FEF3C7" }}>
                  <td className="px-4 py-3 text-slate-600">As a share of issue size</td>
                  <td className="px-4 py-3 text-right text-slate-700 font-medium whitespace-nowrap">
                    {((totalLow / sizeLakhs) * 100).toFixed(1)}% – {((totalHigh / sizeLakhs) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
            <strong className="text-slate-500">Note:</strong> These are indicative
            industry ranges for SME IPOs, not quotations. Actual costs depend on
            your intermediaries, issue structure, marketing plan and timeline. We
            detail the full cost plan during planning.
          </p>

          {/* Email the breakdown → lead capture */}
          {leadStatus === "success" ? (
            <div className="rounded-xl border border-brand-gold/30 bg-brand-gold/10 px-4 py-4 text-center">
              <p className="font-sans text-sm font-semibold text-brand-navy">
                Thank you! An advisor will send your detailed cost plan within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={submitLead} className="rounded-xl border border-slate-200 bg-brand-cream/60 p-5">
              <p className="font-sans text-sm font-semibold text-brand-navy mb-3">
                Want an exact cost plan for your company? Get it by email — free.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  aria-label="Your name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                />
                <input
                  aria-label="Your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
                />
              </div>
              {leadError && (
                <p className="font-sans text-xs text-red-600 mb-3" role="alert">{leadError}</p>
              )}
              <button
                type="submit"
                disabled={leadStatus === "loading"}
                className="w-full py-3 bg-brand-navy text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {leadStatus === "loading" ? "Sending…" : "Send Me the Detailed Cost Plan"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
