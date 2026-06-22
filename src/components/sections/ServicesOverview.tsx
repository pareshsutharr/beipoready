"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Building2, ClipboardList, TrendingUp, FileCheck, BarChart3, ArrowUpRight } from "lucide-react";

const SERVICES = [
  { icon: Building2,    title: "SME IPO Advisory",                description: "End-to-end strategic guidance for growth-stage companies navigating the SME Exchange listing process — from eligibility checks to post-listing compliance.",                                              href: "/services/sme-ipo-advisory",              accent: "#F59E0B" },
  { icon: ClipboardList, title: "IPO Readiness Assessment",        description: "A structured diagnostic that benchmarks your financials, governance, and operations against exchange listing norms so you know exactly where you stand.",                                                      href: "/services/ipo-readiness-assessment",       accent: "#3B82F6" },
  { icon: TrendingUp,   title: "Pre-IPO Fundraising",             description: "Connecting promoters with the right angel investors, family offices, and PE funds to build a credible capital story ahead of the public offering.",                                                          href: "/services/pre-ipo-fundraising",            accent: "#10B981" },
  { icon: FileCheck,    title: "IPO Documentation & Compliance",  description: "Preparation and review of Draft Red Herring Prospectus, legal disclosures, and ongoing SEBI filings — ensuring nothing slips through the regulatory net.",                                               href: "/services/ipo-documentation-compliance",   accent: "#8B5CF6" },
  { icon: BarChart3,    title: "Valuation & Capital Structuring", description: "Independent business valuations and optimal capital mix advice that position your company attractively for institutional investors and retail subscribers alike.", href: "/services/valuation-capital-structuring",  accent: "#F59E0B" },
] as const;

function ServiceCard({ icon: Icon, title, description, href, accent }: { icon: React.ElementType; title: string; description: string; href: string; accent: string }) {
  return (
    <div
      className="service-card group relative flex flex-col rounded-2xl p-7 h-full overflow-hidden cursor-pointer"
      style={{ background: "#fff", border: "1px solid #e2e8f0", transition: "box-shadow 0.3s, border-color 0.3s, transform 0.3s" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 20px 60px -12px ${accent}30, 0 8px 24px rgba(0,0,0,0.1)`;
        el.style.borderColor = `${accent}50`;
        el.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.borderColor = "#e2e8f0";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Hover gradient strip */}
      <div className="absolute top-0 inset-x-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-full"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} aria-hidden="true" />

      {/* Icon */}
      <div
        className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
        style={{ background: `${accent}14` }}
      >
        <Icon className="w-6 h-6 transition-colors duration-300" style={{ color: accent }} aria-hidden="true" />
      </div>

      <h3 className="font-serif text-lg font-bold text-slate-900 mb-2.5 leading-snug">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-6">{description}</p>

      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 group/link"
        style={{ color: accent }}
        aria-label={`Learn more about ${title}`}
      >
        Learn More
        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function ServicesOverview() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          const hd = secRef.current?.querySelector(".sv-head");
          if (hd) gsap.from(hd, { y: 30, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: hd, start: "top 85%" } });

          const cards = secRef.current ? Array.from(secRef.current.querySelectorAll(".service-card")) : [];
          if (cards.length) {
            gsap.from(cards, { y: 40, duration: 0.6, stagger: 0.08, ease: "power3.out",
              scrollTrigger: { trigger: cards[0], start: "top 88%" } });
          }
        }, secRef);
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={secRef} className="w-full py-24 sm:py-32 bg-brand-cream" aria-labelledby="services-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sv-head text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">What We Do</p>
          <h2 id="services-heading" className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-4">Our Services</h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Specialist advisory across every milestone on the path from private company to listed enterprise.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {SERVICES.map((s) => <li key={s.href} className="flex"><ServiceCard {...s} /></li>)}
        </ul>

        <div className="mt-12 text-center">
          <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-navy/20 text-brand-navy text-sm font-bold hover:bg-brand-navy hover:text-white transition-all duration-300 cursor-pointer">
            View All Services <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
