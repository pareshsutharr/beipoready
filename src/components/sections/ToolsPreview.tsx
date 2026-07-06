import Link from "next/link";
import { ClipboardCheck, Calculator, Receipt, ListChecks, ArrowRight } from "lucide-react";

const TOOLS = [
  {
    icon: ClipboardCheck,
    title: "Are You IPO Ready?",
    description:
      "A short self-assessment that scores your readiness and emails you a tailored summary.",
    cta: "Take the IPO Readiness Check",
    href: "/ipo-readiness-tool",
  },
  {
    icon: Calculator,
    title: "Issue Size Calculator",
    description: "Estimate how much you can raise.",
    cta: "Calculate Now",
    href: "/issue-size-calculator",
  },
  {
    icon: Receipt,
    title: "Issue Cost Estimator",
    description: "Understand the cost of going public.",
    cta: "Coming soon",
    href: null,
  },
  {
    icon: ListChecks,
    title: "SME IPO Listing Checklist",
    description: "Download the step-by-step checklist.",
    cta: "Coming soon",
    href: null,
  },
];

export default function ToolsPreview() {
  return (
    <section
      className="relative w-full py-20 sm:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg,#070F1E 0%,#0F2D52 100%)" }}
      aria-labelledby="tools-heading"
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{ backgroundImage: "radial-gradient(circle, #ECB85B 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(236,184,91,0.3),transparent)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Plan Before You Commit</p>
          <h2 id="tools-heading" className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            See where you stand today — free
          </h2>
          <p className="text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">
            Free tools built for promoters and CFOs exploring the capital-markets path.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12" role="list">
          {TOOLS.map(({ icon: Icon, title, description, cta, href }) => (
            <li key={title}>
              <div
                className="flex flex-col h-full rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="mb-5 w-11 h-11 flex items-center justify-center rounded-xl"
                  style={{ background: "rgba(236,184,91,0.15)", border: "1px solid rgba(236,184,91,0.3)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#ECB85B" }} aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed flex-1 mb-6">{description}</p>
                {href ? (
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors duration-150 hover:text-white"
                    style={{ color: "#ECB85B" }}
                  >
                    {cta}
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="text-sm font-bold text-white/35">{cta}</span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Link
            href="/ipo-readiness-tool"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-brand-navy-dark cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            style={{
              background: "linear-gradient(135deg,#ECB85B,#FCD34D)",
              boxShadow: "0 0 28px rgba(236,184,91,0.4), 0 4px 16px rgba(0,0,0,0.12)",
            }}
          >
            Take the IPO Readiness Check
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
