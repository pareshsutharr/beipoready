import { X, Check } from "lucide-react";

const ROWS = [
  {
    before: "Growth capped by limited capital access",
    after: "Access to public and institutional capital",
  },
  {
    before: "Valuation known only to you",
    after: "Market-discovered, transparent valuation",
  },
  {
    before: "Wealth locked in the business",
    after: "Liquidity and wealth creation for promoters",
  },
  {
    before: "Limited brand credibility",
    after: "Public-market credibility with clients, banks & talent",
  },
  {
    before: "Ad-hoc governance",
    after: "Institutional-grade systems and governance",
  },
];

export default function BeforeAfter() {
  return (
    <section className="w-full py-20 sm:py-28" style={{ background: "#FEFBF2" }} aria-labelledby="before-after-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            The Cost of Staying Where You Are
          </p>
          <h2 id="before-after-heading" className="font-serif text-3xl sm:text-4xl font-bold text-[#0D4A6F] mb-5 max-w-3xl mx-auto leading-snug">
            The real question isn&rsquo;t &ldquo;why go public?&rdquo; — it&rsquo;s
            &ldquo;what is staying private costing you?&rdquo;
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Growth capital and a public listing don&rsquo;t just raise money — they
            unlock valuation, credibility, and liquidity. Here&rsquo;s the difference
            being IPO-ready makes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Before — muted */}
          <div className="rounded-2xl p-7 sm:p-8 border border-slate-200 bg-white">
            <h3 className="font-serif text-lg font-bold text-slate-500 mb-6">
              Staying as you are
            </h3>
            <ul className="space-y-4" role="list">
              {ROWS.map((row) => (
                <li key={row.before} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-slate-100">
                    <X className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  </span>
                  <span className="text-sm sm:text-[0.95rem] text-slate-500 leading-relaxed">{row.before}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After — brand colour */}
          <div
            className="rounded-2xl p-7 sm:p-8 text-white"
            style={{
              background: "linear-gradient(160deg, #0D4A6F 0%, #0F2D52 100%)",
              boxShadow: "0 16px 48px rgba(13,74,111,0.28)",
            }}
          >
            <h3 className="font-serif text-lg font-bold mb-6" style={{ color: "#ECB85B" }}>
              Being IPO Ready
            </h3>
            <ul className="space-y-4" role="list">
              {ROWS.map((row) => (
                <li key={row.after} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full" style={{ background: "rgba(236,184,91,0.2)" }}>
                    <Check className="w-3 h-3" style={{ color: "#ECB85B" }} aria-hidden="true" />
                  </span>
                  <span className="text-sm sm:text-[0.95rem] text-white/85 leading-relaxed">{row.after}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
