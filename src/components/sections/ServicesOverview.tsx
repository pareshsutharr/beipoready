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

const COMPARISON = [
  {
    label: "Best suited for",
    sme: "Smaller, growing companies",
    main: "Larger, established companies",
  },
  {
    label: "Eligibility",
    sme: "Lighter thresholds — post-issue paid-up capital up to ₹25 Cr",
    main: "Higher thresholds for profitability, net worth and capital",
  },
  {
    label: "Typical issue size",
    sme: "Smaller issues",
    main: "Larger issues",
  },
  {
    label: "Investor base",
    sme: "Retail & HNI participation with mandatory market making",
    main: "Broad institutional and retail participation",
  },
  {
    label: "Path forward",
    sme: "Can migrate to the Main Board as the company grows",
    main: "Direct access to the widest market",
  },
];

export default function ServicesOverview() {
  return (
    <section className="w-full py-20 sm:py-28 bg-white" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Our Services</p>
          <h2 id="services-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#0D4A6F] mb-4">
            End-to-end advisory, built around your goals
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16" role="list">
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
                    <h3 className="font-serif text-lg font-bold text-[#0D4A6F] leading-snug mb-1">{title}</h3>
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

        {/* SME vs Main Board comparison */}
        <div className="max-w-4xl mx-auto">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0D4A6F] text-center mb-6">
            SME IPO vs Main Board IPO — which path fits you?
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr style={{ background: "#0D4A6F" }}>
                  <th scope="col" className="px-5 py-3.5 font-bold text-white/70 w-[26%]"></th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-white">
                    SME IPO <span className="font-medium text-white/60">(NSE Emerge / BSE SME)</span>
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-white">Main Board IPO</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.label} style={{ background: i % 2 ? "#FEFBF2" : "#fff" }}>
                    <th scope="row" className="px-5 py-4 font-bold text-[#0D4A6F] align-top">{row.label}</th>
                    <td className="px-5 py-4 text-slate-600 align-top">{row.sme}</td>
                    <td className="px-5 py-4 text-slate-600 align-top">{row.main}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-slate-500 mt-5">
            Not sure which applies to you?{" "}
            <Link href="/contact-us" className="font-bold text-brand-gold hover:underline">
              Book a Free IPO Readiness Call
            </Link>{" "}
            and we&rsquo;ll help you choose.
          </p>
        </div>
      </div>
    </section>
  );
}
