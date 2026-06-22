"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const INDUSTRY_PE: Record<string, number> = {
  "IT / Software Services": 28,
  "FMCG / Consumer Goods": 32,
  "Pharma / Healthcare": 30,
  "Manufacturing / Engineering": 15,
  "Infrastructure / EPC": 12,
  "Textile / Apparel": 12,
  "Financial Services / NBFC": 18,
  "Retail / E-commerce": 20,
  "Agro / Food Processing": 14,
  "Renewable Energy": 22,
  "Chemicals / Specialty": 18,
  "Other": 15,
};

type Phase = "calc" | "lead" | "result";

interface Result {
  pe: number;
  marketCapLow: number;
  marketCapHigh: number;
  issueLow: number;
  issueHigh: number;
}

export default function IssueSizeCalculator() {
  const [pat, setPat] = useState("");
  const [industry, setIndustry] = useState("");
  const [cagr, setCagr] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [phase, setPhase] = useState<Phase>("calc");

  // Lead form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function calculate() {
    const patNum = parseFloat(pat);
    const cagrNum = parseFloat(cagr) || 0;
    const basePe = INDUSTRY_PE[industry];

    if (!patNum || patNum <= 0 || !basePe) return;

    // Growth premium on top of sector P/E
    let growthPremium = 0;
    if (cagrNum >= 30) growthPremium = 0.25;
    else if (cagrNum >= 20) growthPremium = 0.15;
    else if (cagrNum >= 10) growthPremium = 0.05;

    const adjustedPe = basePe * (1 + growthPremium);
    const marketCapBase = patNum * adjustedPe;

    setResult({
      pe: Math.round(adjustedPe * 10) / 10,
      marketCapLow: Math.round(marketCapBase * 0.9 * 10) / 10,
      marketCapHigh: Math.round(marketCapBase * 1.1 * 10) / 10,
      issueLow: Math.round(marketCapBase * 0.9 * 0.20 * 10) / 10,  // 20% dilution
      issueHigh: Math.round(marketCapBase * 1.1 * 0.30 * 10) / 10, // 30% dilution
    });
    setPhase("lead");
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const issueSummary = result
      ? `Issue Size Est: ₹${result.issueLow}–₹${result.issueHigh} Cr | Market Cap Est: ₹${result.marketCapLow}–₹${result.marketCapHigh} Cr | Sector PE: ${result.pe}x | Industry: ${industry} | PAT: ₹${pat} Cr | CAGR: ${cagr}%`
      : "";

    const { error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || null,
      company_name: company.trim() || null,
      source: "issue-size-calculator",
      message: issueSummary,
    });

    setSubmitting(false);
    if (error) {
      setSubmitError("Something went wrong. Please try again.");
      return;
    }
    setPhase("result");
  }

  // ── Calculator ─────────────────────────────────────────────────────────────
  if (phase === "calc") {
    const isValid = parseFloat(pat) > 0 && industry !== "" && INDUSTRY_PE[industry] != null;

    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="font-serif text-xl font-bold text-brand-navy mb-6">
          Enter Your Details
        </h2>

        <div className="space-y-5">
          {/* PAT */}
          <div>
            <label htmlFor="calc-pat" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
              Latest Annual PAT (₹ Crore) <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="calc-pat"
              type="number"
              min="0"
              step="0.1"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="e.g. 4.5"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
            <p className="font-sans text-xs text-slate-400 mt-1">
              Profit After Tax for the most recently completed financial year
            </p>
          </div>

          {/* Industry */}
          <div>
            <label htmlFor="calc-industry" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
              Industry Sector <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <select
                id="calc-industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm appearance-none bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="">Select your sector…</option>
                {Object.keys(INDUSTRY_PE).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {industry && (
              <p className="font-sans text-xs text-slate-400 mt-1">
                Base sector P/E: {INDUSTRY_PE[industry]}×
              </p>
            )}
          </div>

          {/* CAGR */}
          <div>
            <label htmlFor="calc-cagr" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
              3-Year Revenue CAGR (%)
              <span className="ml-2 font-normal text-slate-400">Optional — used for growth premium</span>
            </label>
            <input
              id="calc-cagr"
              type="number"
              min="-100"
              max="200"
              step="1"
              value={cagr}
              onChange={(e) => setCagr(e.target.value)}
              placeholder="e.g. 22"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>

          <button
            onClick={calculate}
            disabled={!isValid}
            className="w-full py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Calculate Issue Size →
          </button>
        </div>

        {/* Methodology note */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="font-sans text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-500">Methodology:</strong> Estimated market capitalisation is calculated as PAT × sector P/E (with growth premium for high-CAGR companies). Issue size assumes 20–30% primary dilution. This is a directional estimate only — not a formal valuation.
          </p>
        </div>
      </div>
    );
  }

  // ── Lead capture ──────────────────────────────────────────────────────────
  if (phase === "lead") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/15 border border-brand-gold/25 mb-3">
            <svg className="w-6 h-6 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M9 14h.01M12 14h.01M15 14h.01" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-navy mb-1">
            Your estimate is ready
          </h2>
          <p className="font-sans text-sm text-slate-500">
            Enter your details to see the full breakdown, including market cap range and valuation rationale.
          </p>
        </div>

        <form onSubmit={handleLeadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="isc-name" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Name <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="isc-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold" />
            </div>
            <div>
              <label htmlFor="isc-company" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Company
              </label>
              <input id="isc-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="isc-email" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input id="isc-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold" />
            </div>
            <div>
              <label htmlFor="isc-phone" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Phone
              </label>
              <input id="isc-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold" />
            </div>
          </div>

          {submitError && (
            <p className="font-sans text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            {submitting ? "Submitting…" : "Show My Issue Size Estimate →"}
          </button>
        </form>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Main result card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-brand-navy px-6 sm:px-8 py-5">
          <p className="font-sans text-xs text-white/50 uppercase tracking-widest mb-1">
            Estimated IPO Issue Size
          </p>
          <p className="font-serif text-3xl sm:text-4xl font-bold text-white">
            ₹{result.issueLow} – ₹{result.issueHigh} Crore
          </p>
          <p className="font-sans text-sm text-brand-gold mt-1">
            Based on {result.pe}× P/E · {industry}
          </p>
        </div>
        <div className="px-6 sm:px-8 py-6 grid grid-cols-2 gap-6">
          <div>
            <p className="font-sans text-xs text-slate-400 mb-1">Indicative Market Cap Range</p>
            <p className="font-serif text-xl font-bold text-brand-navy">
              ₹{result.marketCapLow} – ₹{result.marketCapHigh} Cr
            </p>
          </div>
          <div>
            <p className="font-sans text-xs text-slate-400 mb-1">Dilution Assumed</p>
            <p className="font-serif text-xl font-bold text-brand-navy">20% – 30%</p>
          </div>
          <div>
            <p className="font-sans text-xs text-slate-400 mb-1">PAT Used</p>
            <p className="font-serif text-xl font-bold text-brand-navy">₹{pat} Crore</p>
          </div>
          <div>
            <p className="font-sans text-xs text-slate-400 mb-1">Adjusted P/E Applied</p>
            <p className="font-serif text-xl font-bold text-brand-navy">{result.pe}×</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-sans text-xs text-amber-700 leading-relaxed">
          <strong>Disclaimer:</strong> This is an indicative estimate based on sector median P/E multiples and assumed dilution ranges. It is not a formal valuation, investment recommendation, or SEBI-compliant pricing opinion. Actual IPO pricing depends on audited financials, market conditions, investor demand, and lead manager assessment.
        </p>
      </div>

      {/* CTA */}
      <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="font-serif text-xl font-bold text-white mb-3">
          Want a formal valuation analysis?
        </h2>
        <p className="font-sans text-sm text-white/65 mb-6 leading-relaxed">
          Our Valuation &amp; Capital Structuring service builds a full DCF model,
          peer comparable table, and price band recommendation that you can
          defend to SEBI and investors.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors"
          >
            Book a Free Consultation
          </Link>
          <Link
            href="/services/valuation-capital-structuring"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            View Valuation Service
          </Link>
        </div>
      </div>
    </div>
  );
}
