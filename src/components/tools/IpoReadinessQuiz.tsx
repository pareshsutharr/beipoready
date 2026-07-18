"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type Option = { label: string; score: number };
type Question = { id: string; text: string; options: Option[] };
type Section = { title: string; questions: Question[] };

const SECTIONS: Section[] = [
  {
    title: "Financial Health",
    questions: [
      {
        id: "revenue",
        text: "What is your company's annual revenue (latest full financial year)?",
        options: [
          { label: "Below ₹10 Crore", score: 0 },
          { label: "₹10 – ₹25 Crore", score: 1 },
          { label: "₹25 – ₹100 Crore", score: 2 },
          { label: "Above ₹100 Crore", score: 3 },
        ],
      },
      {
        id: "profitability",
        text: "What best describes your company's profitability track record?",
        options: [
          { label: "Loss-making in 2 of the last 3 years", score: 0 },
          { label: "Breakeven, barely profitable", score: 1 },
          { label: "Profitable but PAT margin below 5%", score: 2 },
          { label: "Consistently profitable (PAT margin 5%+) for 3+ years", score: 3 },
        ],
      },
      {
        id: "growth",
        text: "What has been your 3-year revenue CAGR?",
        options: [
          { label: "Negative or flat (below 0%)", score: 0 },
          { label: "0% – 10%", score: 1 },
          { label: "10% – 25%", score: 2 },
          { label: "Above 25%", score: 3 },
        ],
      },
      {
        id: "debt",
        text: "What is your company's current debt situation?",
        options: [
          { label: "High leverage, Debt/Equity above 2×", score: 0 },
          { label: "Moderate, Debt/Equity 1–2×", score: 1 },
          { label: "Low leverage, Debt/Equity below 1×", score: 2 },
          { label: "Debt-free or near debt-free", score: 3 },
        ],
      },
    ],
  },
  {
    title: "Corporate Governance",
    questions: [
      {
        id: "board",
        text: "What is the current composition of your board of directors?",
        options: [
          { label: "Promoter directors only, no independent directors", score: 0 },
          { label: "1 independent director appointed", score: 1 },
          { label: "2 independent directors + Audit Committee constituted", score: 2 },
          { label: "2+ IDs, all mandatory committees, and board minutes maintained", score: 3 },
        ],
      },
      {
        id: "auditor",
        text: "Who is your current statutory auditor?",
        options: [
          { label: "Small local CA, not peer-review certified", score: 0 },
          { label: "CA firm with valid peer review certificate", score: 1 },
          { label: "Mid-size regional firm with IPO experience", score: 2 },
          { label: "Big-4 or Top-10 national CA firm", score: 3 },
        ],
      },
      {
        id: "cs",
        text: "Does your company have a qualified Company Secretary?",
        options: [
          { label: "No Company Secretary appointed", score: 0 },
          { label: "Part-time or retainer CS", score: 1 },
          { label: "Full-time qualified CS in employment", score: 2 },
          { label: "Full-time CS + secretarial audit conducted for 2+ years", score: 3 },
        ],
      },
      {
        id: "compliance",
        text: "How is your ROC / MCA compliance history?",
        options: [
          { label: "Multiple filing defaults or penalties in last 3 years", score: 0 },
          { label: "1–2 minor defaults, since rectified", score: 1 },
          { label: "Clean record for the last 1 year", score: 2 },
          { label: "Spotless compliance history for 3+ years", score: 3 },
        ],
      },
    ],
  },
  {
    title: "Operations & Systems",
    questions: [
      {
        id: "erp",
        text: "How does your company manage financial reporting?",
        options: [
          { label: "Manual or Excel-based, no accounting software", score: 0 },
          { label: "Basic accounting software (Tally etc.)", score: 1 },
          { label: "ERP partially implemented", score: 2 },
          { label: "Full ERP with real-time financial reporting", score: 3 },
        ],
      },
      {
        id: "audit",
        text: "What internal audit / internal control framework is in place?",
        options: [
          { label: "No internal audit, no documented controls", score: 0 },
          { label: "Ad-hoc reviews only", score: 1 },
          { label: "Annual external internal audit conducted", score: 2 },
          { label: "Quarterly internal audit + management action tracking", score: 3 },
        ],
      },
      {
        id: "rpt",
        text: "How significant are related party transactions in your company?",
        options: [
          { label: "Large RPTs, some undisclosed or not at arm's length", score: 0 },
          { label: "Significant RPTs but disclosed in accounts", score: 1 },
          { label: "Minor RPTs, all at arm's length and disclosed", score: 2 },
          { label: "No material RPTs", score: 3 },
        ],
      },
      {
        id: "working_capital",
        text: "How would you describe your working capital management?",
        options: [
          { label: "Negative, company frequently stretches creditor payments", score: 0 },
          { label: "Seasonal stress, cash flow tight in certain months", score: 1 },
          { label: "Manageable, no significant stress", score: 2 },
          { label: "Healthy, positive cash conversion cycle, low receivables", score: 3 },
        ],
      },
    ],
  },
  {
    title: "Business & Market Position",
    questions: [
      {
        id: "concentration",
        text: "What is your customer/revenue concentration?",
        options: [
          { label: "Top 3 customers = 70%+ of revenue", score: 0 },
          { label: "Top 3 customers = 50–70% of revenue", score: 1 },
          { label: "Top 3 customers = 30–50% of revenue", score: 2 },
          { label: "Top 3 customers below 30%, well diversified", score: 3 },
        ],
      },
      {
        id: "moat",
        text: "What competitive advantage / moat does your company have?",
        options: [
          { label: "None identified, competing on price only", score: 0 },
          { label: "Marginal, some differentiation", score: 1 },
          { label: "Moderate, brand, technology, or process advantage", score: 2 },
          { label: "Strong, IP, exclusive contracts, network effects, or regulatory moat", score: 3 },
        ],
      },
      {
        id: "industry",
        text: "How would you characterise your industry's growth outlook?",
        options: [
          { label: "Declining or structurally challenged", score: 0 },
          { label: "Flat, low single-digit growth", score: 1 },
          { label: "Growing, 10–20% industry CAGR", score: 2 },
          { label: "High growth, 20%+ CAGR with tailwinds", score: 3 },
        ],
      },
      {
        id: "visibility",
        text: "How visible / recurring is your revenue?",
        options: [
          { label: "Spot / project-based, no forward visibility", score: 0 },
          { label: "Short-term contracts (under 6 months)", score: 1 },
          { label: "Annual contracts with good renewal rate", score: 2 },
          { label: "Multi-year contracts or strongly recurring SaaS/subscription model", score: 3 },
        ],
      },
    ],
  },
  {
    title: "Promoters & Management",
    questions: [
      {
        id: "promoter_exp",
        text: "How long have promoters been in this industry?",
        options: [
          { label: "Under 5 years", score: 0 },
          { label: "5–10 years", score: 1 },
          { label: "10–20 years", score: 2 },
          { label: "20+ years, deep domain expertise", score: 3 },
        ],
      },
      {
        id: "team",
        text: "How deep is your management team?",
        options: [
          { label: "Single founder-dependent, no second line", score: 0 },
          { label: "2–3 key people but no formal structure", score: 1 },
          { label: "Mid-management layer with functional heads", score: 2 },
          { label: "Full C-suite in place, not founder-dependent", score: 3 },
        ],
      },
      {
        id: "dilution",
        text: "How clear are promoters about post-IPO dilution?",
        options: [
          { label: "Promoters are resistant to dilution", score: 0 },
          { label: "Open in principle but no clear plan", score: 1 },
          { label: "Comfortable with 25–30% dilution for the right valuation", score: 2 },
          { label: "Clear dilution plan with offer structure already modelled", score: 3 },
        ],
      },
      {
        id: "fundraising",
        text: "Has the company raised external capital before?",
        options: [
          { label: "No, entirely promoter-funded", score: 0 },
          { label: "Informal / angel / friends & family round", score: 1 },
          { label: "Formal VC or PE round completed", score: 2 },
          { label: "Multiple rounds, experienced with investor diligence processes", score: 3 },
        ],
      },
    ],
  },
];

const MAX_SCORE = SECTIONS.reduce((sum, s) => sum + s.questions.length * 3, 0); // 60

function getLabel(pct: number): { label: string; color: string; bg: string; description: string } {
  if (pct >= 90) return { label: "IPO Ready", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", description: "Your company appears ready to engage a merchant banker and begin the IPO process now." };
  if (pct >= 75) return { label: "Almost Ready", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", description: "You are 6–12 months from IPO readiness. A focused advisory engagement can close the remaining gaps." };
  if (pct >= 55) return { label: "Getting Ready", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", description: "You have the fundamentals but significant gaps remain. A structured 12–18 month programme will get you there." };
  if (pct >= 35) return { label: "Foundation Building", color: "text-orange-700", bg: "bg-orange-50 border-orange-200", description: "Core structural work is needed first. An 18–24 month roadmap is realistic before engaging a merchant banker." };
  return { label: "Early Stage", color: "text-red-700", bg: "bg-red-50 border-red-200", description: "Focus on building the financial, governance, and operational foundations before beginning the IPO process." };
}

type Phase = "quiz" | "lead" | "results";

export default function IpoReadinessQuiz() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState(0);

  const section = SECTIONS[currentSection];
  const sectionAnswered = section.questions.every((q) => answers[q.id] !== undefined);

  const totalAnswered = Object.keys(answers).length;
  const totalQuestions = SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
  const progressPct = Math.round((totalAnswered / totalQuestions) * 100);

  function nextSection() {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection((s) => s + 1);
    } else {
      const raw = Object.values(answers).reduce((a, b) => a + b, 0);
      setFinalScore(Math.round((raw / MAX_SCORE) * 100));
      setPhase("lead");
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      company_name: company.trim() || null,
      source: "readiness-tool",
      message: `IPO Readiness Score: ${(finalScore / 10).toFixed(1)}/10`,
    });

    setSubmitting(false);
    if (error) {
      setSubmitError("Something went wrong. Please try again or contact us directly.");
      return;
    }
    setPhase("results");
  }

  // ── Quiz phase ────────────────────────────────────────────────────────────
  if (phase === "quiz") {
    return (
      <div>
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs text-slate-500">
              Section {currentSection + 1} of {SECTIONS.length}: <strong>{section.title}</strong>
            </span>
            <span className="font-sans text-xs text-slate-400">{progressPct}% complete</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Section dots */}
          <div className="flex gap-2 mt-3">
            {SECTIONS.map((s, i) => (
              <div
                key={s.title}
                className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                  i < currentSection
                    ? "bg-brand-gold"
                    : i === currentSection
                    ? "bg-brand-gold/50"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Section card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="font-heading text-xl font-bold text-brand-navy mb-6">{section.title}</h2>

          <div className="space-y-8">
            {section.questions.map((q, qi) => (
              <div key={q.id}>
                <p className="font-sans text-sm font-semibold text-slate-800 mb-3">
                  <span className="text-brand-gold mr-2">{currentSection * 4 + qi + 1}.</span>
                  {q.text}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === opt.score;
                    return (
                      <button
                        key={oi}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.score }))}
                        className={`w-full text-left px-4 py-3 rounded-lg border font-sans text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${
                          selected
                            ? "border-brand-gold bg-brand-gold/10 text-brand-navy font-semibold"
                            : "border-slate-200 text-slate-700 hover:border-brand-gold/50 hover:bg-brand-gold/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => currentSection > 0 && setCurrentSection((s) => s - 1)}
              disabled={currentSection === 0}
              className="font-sans text-sm text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous Section
            </button>
            <button
              onClick={nextSection}
              disabled={!sectionAnswered}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {currentSection < SECTIONS.length - 1 ? "Next Section →" : "See My Results →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Lead capture phase ────────────────────────────────────────────────────
  if (phase === "lead") {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold/25 mb-4">
            <svg className="w-7 h-7 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-2">
            Assessment Complete!
          </h2>
          <p className="font-sans text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            Enter your details to see your personalised IPO Readiness Score and
            recommendations. We will also follow up with a consultation offer.
          </p>
        </div>

        <form onSubmit={handleLeadSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <label htmlFor="rl-name" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
              Full Name <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="rl-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
          <div>
            <label htmlFor="rl-email" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
              Business Email <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="rl-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="rl-phone" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Phone <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="rl-phone"
                type="tel"
                required
                minLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
            <div>
              <label htmlFor="rl-company" className="block font-sans text-sm font-medium text-slate-700 mb-1.5">
                Company Name
              </label>
              <input
                id="rl-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              />
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
            {submitting ? "Submitting…" : "Show My IPO Readiness Score →"}
          </button>
          <p className="font-sans text-xs text-slate-400 text-center">
            We respect your privacy. No spam, just your results and a follow-up offer.
          </p>
        </form>
      </div>
    );
  }

  // ── Results phase ─────────────────────────────────────────────────────────
  const label = getLabel(finalScore);
  const sectionScores = SECTIONS.map((s) => ({
    title: s.title,
    score: s.questions.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0),
    max: s.questions.length * 3,
  }));

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 text-center">
        <p className="font-sans text-sm font-semibold uppercase tracking-widest text-slate-400 mb-4">
          Your IPO Readiness Score
        </p>
        <div className="relative inline-flex items-center justify-center w-36 h-36 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#EAAF47"
              strokeWidth="3"
              strokeDasharray={`${(finalScore / 100) * 100} 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-4xl font-bold text-brand-navy">{(finalScore / 10).toFixed(1)}</span>
            <span className="font-sans text-xs text-slate-400">/10</span>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${label.bg} ${label.color} mb-4`}>
          {label.label}
        </div>
        <p className="font-sans text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          {label.description}
        </p>
      </div>

      {/* Section breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="font-heading text-lg font-bold text-brand-navy mb-5">Score by Domain</h2>
        <div className="space-y-4">
          {sectionScores.map((s) => {
            const pct = Math.round((s.score / s.max) * 100);
            return (
              <div key={s.title}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-sans text-sm text-slate-700">{s.title}</span>
                  <span className="font-sans text-sm font-semibold text-brand-navy">{pct}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pct >= 75 ? "bg-emerald-400" : pct >= 50 ? "bg-brand-gold" : "bg-red-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-center">
        <h2 className="font-heading text-xl font-bold text-white mb-3">
          Get a Detailed Action Plan
        </h2>
        <p className="font-sans text-sm text-white/65 mb-6 leading-relaxed">
          Our advisors can walk you through every gap in your score and build a
          specific 12–18 month roadmap to IPO readiness, at no cost for the
          first consultation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors"
          >
            Book a Consultation
          </Link>
          <Link
            href="/services/pre-ipo-advisory"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-lg text-sm hover:bg-white/10 transition-colors"
          >
            Learn About Pre-IPO Advisory
          </Link>
        </div>
      </div>
    </div>
  );
}
