import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Be IPO Ready — SEBI-registered SME IPO advisors with 15+ years of combined experience guiding Indian companies to successful public listings.",
};

const VALUES = [
  {
    title: "Transparency First",
    body: "We tell you the truth about your IPO readiness, even when it means recommending you wait. No false promises, no inflated timelines.",
  },
  {
    title: "Regulatory Precision",
    body: "As SEBI-registered advisors and ICAI members, we hold ourselves to the highest standards of compliance in every engagement.",
  },
  {
    title: "End-to-End Ownership",
    body: "We stay with you from the first readiness assessment through listing day — one relationship, not a handoff chain.",
  },
  {
    title: "SME-First Mindset",
    body: "We built this firm for growth-stage companies, not large-cap corporates. Our processes, pricing, and timelines reflect that.",
  },
];

const CREDENTIALS = [
  { label: "SEBI Registered", sublabel: "Category I Merchant Banker" },
  { label: "ICAI Member", sublabel: "Institute of Chartered Accountants of India" },
  { label: "NSE / BSE Empanelled", sublabel: "Recognised on both SME exchanges" },
];

const TEAM_EXPERTISE = [
  {
    title: "Capital Markets",
    body: "IPO structuring, exchange coordination, offer planning, and investor-facing readiness.",
  },
  {
    title: "Financial Reporting",
    body: "Audit preparation, restatement support, working-capital analysis, and disclosure quality.",
  },
  {
    title: "Governance & Compliance",
    body: "Board readiness, committee setup, policy documentation, and post-listing obligations.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Built for the Ambition of India&rsquo;s Growth Companies
          </h1>
          <p className="font-sans text-lg text-white/65 leading-relaxed max-w-2xl mx-auto">
            Be IPO Ready was founded by capital market professionals who saw
            too many deserving SMEs stumble at the listing stage — not for lack
            of business merit, but for lack of the right guidance.
          </p>
        </div>
      </section>

      {/* ── Mission ──────────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
                Our Mission
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-5 leading-tight">
                Democratising Access to India&rsquo;s Capital Markets
              </h2>
              <p className="font-sans text-base text-slate-600 leading-relaxed mb-4">
                SEBI&rsquo;s SME Exchange platforms — NSE Emerge and BSE SME — have
                unlocked public capital for hundreds of Indian businesses. But
                the journey from &ldquo;we want to list&rdquo; to &ldquo;we are listed&rdquo;
                is filled with regulatory, financial, and governance hurdles
                that catch unprepared companies off-guard.
              </p>
              <p className="font-sans text-base text-slate-600 leading-relaxed">
                We exist to close that gap. Our team of chartered accountants,
                company secretaries, and capital market specialists work
                alongside promoters and CFOs to build the foundations that
                institutional investors and regulators expect — then guide every
                step to a successful listing.
              </p>
            </div>

            {/* Credentials */}
            <div className="flex flex-col gap-4">
              {CREDENTIALS.map((cred) => (
                <div
                  key={cred.label}
                  className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-gold/15 border border-brand-gold/25 shrink-0">
                    <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold text-brand-navy">{cred.label}</p>
                    <p className="font-sans text-sm text-slate-500">{cred.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
              What Guides Us
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy leading-tight">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="bg-brand-cream rounded-xl border border-slate-200 p-6"
              >
                <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">{v.title}</h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            The Team
          </p>
          <h2 className="font-serif text-3xl font-bold text-brand-navy mb-4 leading-tight">
            Experienced Capital Market Professionals
          </h2>
          <p className="font-sans text-base text-slate-600 max-w-xl mx-auto leading-relaxed mb-10">
            Our core team combines deep expertise in investment banking, chartered
            accountancy, company secretarial practice, and regulatory compliance —
            all focused exclusively on the SME IPO space.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM_EXPERTISE.map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                <div className="w-12 h-12 flex items-center justify-center bg-brand-navy/5 border border-brand-navy/10 rounded-xl mx-auto mb-4">
                  <span className="font-serif text-xl font-bold text-brand-gold">
                    {item.title.charAt(0)}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Ready to Start the Conversation?
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Book a free 30-minute discovery call — no commitment, no cost.
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
          >
            Book a Free Call
          </Link>
        </div>
      </section>
    </>
  );
}
