import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "End-to-end SME IPO advisory services — from readiness assessment and corporate governance to DRHP documentation, pre-IPO fundraising, and valuation.",
};

const SERVICES = [
  {
    slug: "sme-ipo-advisory",
    title: "SME IPO Advisory",
    tagline: "End-to-end guidance from decision to listing day",
    description:
      "Our flagship service covers the entire IPO lifecycle — structuring, SEBI filings, merchant banker coordination, road show preparation, and post-listing compliance — all from a single point of accountability.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    slug: "ipo-readiness-assessment",
    title: "IPO Readiness Assessment",
    tagline: "Know your real IPO score before you engage a banker",
    description:
      "A structured diagnostic across financial reporting, corporate governance, compliance history, and business fundamentals — with a written roadmap of gaps to close and a realistic listing timeline.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    slug: "pre-ipo-fundraising",
    title: "Pre-IPO Fundraising",
    tagline: "Bridge capital from the right investors before you list",
    description:
      "We connect growth-stage companies with high-net-worth individuals, family offices, and institutional investors for pre-IPO placements — structured to preserve listing optionality and meet SEBI lock-in requirements.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    slug: "ipo-documentation-compliance",
    title: "IPO Documentation & Compliance",
    tagline: "SEBI-grade documentation that passes scrutiny",
    description:
      "We draft and review DRHP, RHP, and all regulatory filings — ensuring SEBI ICDR compliance, accurate financial disclosures, and on-time submissions to NSE Emerge or BSE SME.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    slug: "valuation-capital-structuring",
    title: "Valuation & Capital Structuring",
    tagline: "Price your IPO to succeed — not just to list",
    description:
      "We build defensible valuation models using sector P/E benchmarks, DCF, and comparable company analysis — then advise on optimal offer price, dilution percentage, and share capital structure to attract institutional interest.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            What We Do
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Services Built for SME IPO Success
          </h1>
          <p className="font-sans text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            From your first readiness check to the listing bell — we cover every
            stage so you never have to stitch together multiple advisors mid-journey.
          </p>
        </div>
      </section>

      {/* ── Services grid ────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6">
            {SERVICES.map((service, idx) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group flex flex-col sm:flex-row items-start gap-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:border-brand-gold hover:shadow-md transition-all duration-200"
              >
                {/* Number + icon */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-serif text-3xl font-bold text-brand-gold/30 leading-none w-8 text-right">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy group-hover:bg-brand-gold/15 group-hover:text-brand-gold transition-colors">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-gold transition-colors">
                    {service.title}
                  </h2>
                  <p className="font-sans text-sm font-semibold text-brand-gold mb-3">{service.tagline}</p>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed">{service.description}</p>
                </div>

                {/* Arrow */}
                <div className="shrink-0 self-center text-slate-300 group-hover:text-brand-gold transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Not sure which service you need?
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Start with a free readiness check — we will recommend exactly what is right for your stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ipo-readiness-tool"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
            >
              Take the Free Readiness Check
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
