"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PHASES: { phase: string; items: string[] }[] = [
  {
    phase: "1 — Check Your Eligibility",
    items: [
      "At least 3 years of operational track record",
      "Positive net worth and net tangible assets of at least ₹1.5 Cr",
      "Distributable profits in at least 2 of the last 3 financial years",
      "Post-issue paid-up capital within the ₹25 Cr SME platform limit",
      "No wilful-defaulter status or insolvency proceedings",
      "Functional company website",
    ],
  },
  {
    phase: "2 — Get IPO-Ready",
    items: [
      "Audited financials for the last 3 years, restated where needed",
      "Statutory auditor holds a valid peer review certificate",
      "Clean up related party transactions and inter-corporate loans",
      "Simplify and document the cap table",
      "Convert to a public limited company",
      "Appoint independent directors and constitute board committees",
      "Appoint a qualified Company Secretary",
    ],
  },
  {
    phase: "3 — Appoint Intermediaries",
    items: [
      "Select and mandate a SEBI-registered merchant banker (lead manager)",
      "Appoint legal counsel for the issue",
      "Appoint a registrar & share transfer agent (RTA)",
      "Sign the market maker agreement",
      "Admit securities with NSDL and CDSL (demat)",
    ],
  },
  {
    phase: "4 — Documentation & Filing",
    items: [
      "Complete due diligence with the lead manager",
      "Draft the DRHP with specific, quantified risk factors",
      "Disclose all related party transactions in the standard format",
      "Justify each object of the issue with supporting documents",
      "File the DRHP with the exchange and respond to queries",
      "Receive in-principle approval; file the RHP with the ROC",
    ],
  },
  {
    phase: "5 — Issue & Listing",
    items: [
      "Finalise issue price / price band and issue structure",
      "Run marketing, advertising and investor roadshows",
      "Open and close the issue; complete the basis of allotment",
      "Obtain the listing approval and trade on listing day",
    ],
  },
  {
    phase: "6 — Post-Listing",
    items: [
      "Meet continuous disclosure obligations (SEBI LODR)",
      "Maintain the 3-year market making arrangement",
      "Run a structured investor relations programme",
      "Plan migration to the Main Board as the company grows",
    ],
  },
];

const TOTAL_ITEMS = PHASES.reduce((n, p) => n + p.items.length, 0);

export default function SmeIpoChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [leadStatus, setLeadStatus] = useState<"idle" | "loading" | "success">("idle");
  const [leadError, setLeadError] = useState<string | null>(null);

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / TOTAL_ITEMS) * 100);

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
      message: `Requested the SME IPO Listing Checklist (self-assessed progress: ${done}/${TOTAL_ITEMS}).`,
      source: "sme-ipo-checklist",
    });
    if (error) {
      setLeadError("Something went wrong. Please try again or email us directly.");
      setLeadStatus("idle");
      return;
    }
    setLeadStatus("success");
  }

  return (
    <div>
      <style>{`
        @media print {
          header, footer, .no-print { display: none !important; }
        }
      `}</style>

      {/* Progress + print */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center gap-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mb-6">
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-2">
            <p className="font-sans text-sm font-semibold text-brand-navy">
              Your progress
            </p>
            <p className="font-sans text-xs text-slate-500">
              {done} of {TOTAL_ITEMS} steps
            </p>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: "linear-gradient(90deg,#ECB85B,#FCD34D)" }}
            />
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-brand-navy/25 text-brand-navy text-sm font-bold hover:bg-brand-navy hover:text-white transition-colors duration-200 cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" aria-hidden="true" />
          Print / Save as PDF
        </button>
      </div>

      {/* Checklist */}
      <div className="space-y-6">
        {PHASES.map(({ phase, items }) => (
          <section key={phase} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7">
            <h2 className="font-heading text-lg font-bold text-brand-navy mb-4">
              Phase {phase}
            </h2>
            <ul className="space-y-3" role="list">
              {items.map((item) => {
                const id = `${phase}::${item}`;
                return (
                  <li key={item}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={!!checked[id]}
                        onChange={(e) =>
                          setChecked((c) => ({ ...c, [id]: e.target.checked }))
                        }
                        className="mt-0.5 w-4.5 h-4.5 shrink-0 rounded border-slate-300 accent-[#ECB85B] cursor-pointer"
                      />
                      <span
                        className={`font-sans text-sm leading-relaxed transition-colors ${
                          checked[id] ? "text-slate-400 line-through" : "text-slate-600 group-hover:text-slate-800"
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {/* Email-gated copy → lead capture */}
      <div className="no-print mt-8">
        {leadStatus === "success" ? (
          <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/10 px-6 py-6 text-center">
            <p className="font-heading text-lg font-bold text-brand-navy mb-1">
              The checklist is on its way!
            </p>
            <p className="font-sans text-sm text-slate-600">
              An advisor will email it to you within one business day — along
              with an honest read on where your company stands.
            </p>
          </div>
        ) : (
          <form onSubmit={submitLead} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-7">
            <h2 className="font-heading text-lg font-bold text-brand-navy mb-1">
              Get the checklist in your inbox — free
            </h2>
            <p className="font-sans text-sm text-slate-500 mb-4">
              We&rsquo;ll email you the full checklist so you can work through it
              with your team.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                aria-label="Your name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              />
              <input
                aria-label="Your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
            {leadError && (
              <p className="font-sans text-xs text-red-600 mb-3" role="alert">{leadError}</p>
            )}
            <button
              type="submit"
              disabled={leadStatus === "loading"}
              className="w-full sm:w-auto px-8 py-3 bg-brand-gold text-brand-navy font-semibold rounded-lg text-sm hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {leadStatus === "loading" ? "Sending…" : "Email Me the Checklist"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
