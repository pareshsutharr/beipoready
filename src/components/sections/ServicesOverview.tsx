import Link from "next/link";
import { Banknote, TrendingUp, LineChart, Scale, ChevronDown, ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    icon: Banknote,
    title: "Fund Raising",
    brief: "Structured equity and debt capital to fuel your expansion.",
    detailed:
      "Structured equity and debt capitalization solutions engineered to facilitate corporate expansion. We help growth-stage businesses secure capital from a curated network of investors, VC funds, private equity, family offices, HNIs, NBFCs and banks, managing the process end-to-end.",
    deliverables: [
      "Investment teaser & pitch deck",
      "Financial model",
      "Investor outreach & shortlisting",
      "Term sheet negotiation",
      "Closing & documentation",
    ],
    href: "/services/fund-raising",
  },
  {
    icon: TrendingUp,
    title: "Pre-IPO Advisory",
    brief: "Get market-ready 12–24 months before your listing.",
    detailed:
      "Strategic market positioning and capitalization initiatives executed within the twelve to twenty-four months preceding a public listing, governance, structure, financial reporting, and a Pre-IPO capital raise from institutional-quality investors.",
    deliverables: [
      "IPO readiness diagnostic",
      "Corporate & financial restructuring",
      "Pre-IPO capital raise",
      "IPO runway preparation",
    ],
    href: "/services/pre-ipo-advisory",
  },
  {
    icon: LineChart,
    title: "SME IPO Advisory",
    brief: "End-to-end execution for NSE Emerge & BSE SME listing.",
    detailed:
      "Comprehensive consultation and execution management for public listing on the NSE Emerge or BSE SME platforms, from eligibility evaluation and DRHP filing to marketing, the listing bell, and post-listing compliance.",
    deliverables: [
      "Eligibility & readiness check",
      "DRHP preparation & filing",
      "Issue marketing & investor outreach",
      "Listing & post-listing compliance",
    ],
    href: "/services/sme-ipo-advisory",
  },
  {
    icon: Scale,
    title: "Valuation & Capital Structuring",
    brief: "Know what you're worth; structure capital to match.",
    detailed:
      "Professional business valuation analysis and the design of an optimized capital stack, multi-method valuation blended with strategic capital-structure advice, so you can negotiate with confidence.",
    deliverables: [
      "Multi-method valuation report",
      "Capital structure review",
      "Debt refinancing support",
      "Cap table & instrument structuring",
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
