import Link from "next/link";
import { Banknote, ClipboardCheck, LineChart, Scale, ChevronDown, ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    icon: Banknote,
    title: "Fundraising & Growth Capital",
    brief: "Structure your raise and connect with the right investors.",
    detailed:
      "We define how much capital you need and why, choose between equity and debt, prepare investor-ready materials (models, information memoranda, growth story), and introduce you to institutional investors, PE, family offices, HNIs and lenders aligned to your stage.",
    deliverables: [
      "Capital requirement structuring",
      "Equity & debt strategy",
      "Investor documentation",
      "Investor introductions",
      "Negotiation support",
    ],
    href: "/services/pre-ipo-fundraising",
  },
  {
    icon: ClipboardCheck,
    title: "Pre-IPO Advisory & IPO Readiness",
    brief: "Build the value and discipline that make a listing succeed.",
    detailed:
      "We assess capital efficiency, review financials and governance, recommend corrective actions, clean up the cap table, and put the right people, processes and systems in place — so you approach the market from strength.",
    deliverables: [
      "Capital-efficiency assessment",
      "Financial & governance review",
      "Restructuring guidance",
      "IPO-readiness roadmap",
      "Expert & investor connects",
    ],
    href: "/services/ipo-readiness-assessment",
  },
  {
    icon: LineChart,
    title: "IPO Advisory (NSE Emerge, BSE SME & Main Board)",
    brief: "Manage the full path from eligibility to listing.",
    detailed:
      "We check eligibility, size and structure the issue, select and coordinate merchant bankers, registrars and legal counsel, support due diligence and documentation, and steer you to a successful listing and beyond.",
    deliverables: [
      "Eligibility assessment",
      "Issue sizing & structuring",
      "Intermediary selection & coordination",
      "Due diligence & documentation support",
      "Listing & post-listing guidance",
    ],
    href: "/services/sme-ipo-advisory",
  },
  {
    icon: Scale,
    title: "Corporate Advisory & Valuation",
    brief: "Know what you're worth; make sound capital decisions.",
    detailed:
      "Independent valuations, corporate and capital-structure advisory, and transaction guidance — clarity to negotiate and grow with confidence.",
    deliverables: [
      "Business valuation",
      "Corporate & strategic advisory",
      "Capital-structure guidance",
      "Transaction advisory",
    ],
    href: "/services/valuation-capital-structuring",
  },
];

export default function ServicesOverview() {
  return (
    <section className="w-full py-20 sm:py-28 bg-white" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Our Services</p>
          <h2 id="services-heading" className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F] mb-4">
            End-to-end advisory, built around your goals
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5" role="list">
          {SERVICES.map(({ icon: Icon, title, brief, detailed, deliverables, href }) => (
            <li key={title}>
              <div
                className="flex flex-col h-full rounded-2xl bg-white border border-slate-200 p-7"
                style={{ boxShadow: "0 2px 12px rgba(13,74,111,0.05)" }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="shrink-0 w-12 h-12 flex items-center justify-center rounded-xl"
                    style={{ background: "rgba(13,74,111,0.07)" }}
                  >
                    <Icon className="w-6 h-6 text-[#0D4A6F]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#0D4A6F] leading-snug mb-1">{title}</h3>
                    <p className="text-sm font-medium text-slate-600">{brief}</p>
                  </div>
                </div>

                <details className="group flex-1">
                  <summary className="flex items-center gap-1.5 text-sm font-bold text-brand-gold cursor-pointer list-none select-none">
                    What&rsquo;s included
                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <div className="pt-4">
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">{detailed}</p>
                    <ul className="flex flex-wrap gap-2" role="list">
                      {deliverables.map((d) => (
                        <li
                          key={d}
                          className="text-xs font-medium text-[#0D4A6F] rounded-full px-3 py-1.5"
                          style={{ background: "#FEF3C7" }}
                        >
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>

                <Link
                  href={href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#0D4A6F] hover:text-brand-gold transition-colors duration-150 self-start"
                >
                  Explore this service
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
