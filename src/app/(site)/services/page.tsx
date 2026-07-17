import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Banknote, TrendingUp, LineChart, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Strategic capital-markets advisory, Fund Raising, Pre-IPO Advisory, SME IPO Advisory, and Valuation & Corporate Restructuring for growth-stage and listing-bound companies.",
};

const SERVICES = [
  {
    slug: "fund-raising",
    title: "Fund Raising",
    tagline: "Structured equity and Equity Related Instruments capitalization solutions engineered to facilitate corporate expansion",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=320&h=200&fit=crop&q=80",
    description:
      "We help growth-stage businesses secure equity capital from a curated network of investors, VC funds, private equity, family offices, HNIs, NBFCs, and banks, managing the process end-to-end, from investment story to closing.",
    icon: <Banknote className="w-6 h-6" aria-hidden="true" />,
  },
  {
    slug: "pre-ipo-advisory",
    title: "Pre-IPO Advisory",
    tagline: "Strategic market positioning and capitalization initiatives 12–24 months before a public listing",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=320&h=200&fit=crop&q=80",
    description:
      "We ready your company for public markets, governance, capital structure, financial reporting, while helping you secure Pre-IPO funding from institutional investors, family offices, and HNIs ahead of listing day.",
    icon: <TrendingUp className="w-6 h-6" aria-hidden="true" />,
  },
  {
    slug: "sme-ipo-advisory",
    title: "SME IPO Advisory",
    tagline: "Comprehensive consultation and execution management for NSE Emerge or BSE SME listing",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=320&h=200&fit=crop&q=80",
    description:
      "Your primary strategic partner and coordinator across the entire SME IPO journey, from eligibility evaluation and DRHP filing to marketing, the listing bell, and post-listing compliance.",
    icon: <LineChart className="w-6 h-6" aria-hidden="true" />,
  },
  {
    slug: "valuation-corporate-restructuring",
    title: "Valuation & Corporate Restructuring",
    tagline: "Professional business valuation analysis and the design of an optimized capital stack",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=320&h=200&fit=crop&q=80",
    description:
      "A professionally backed, defensible answer to what your business is worth, blending multi-method valuation with strategic capital-structure advice so you can negotiate with confidence.",
    icon: <Scale className="w-6 h-6" aria-hidden="true" />,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&q=85" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            What We Do
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Services Built for SME IPO Success
          </h1>
          <p className="font-sans text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            From your first readiness check to the listing bell, we cover every
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
                className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-brand-gold hover:shadow-md sm:grid-cols-[220px_1fr]"
              >
                {/* Thumbnail image */}
                <div className="relative min-h-44 w-full overflow-hidden bg-slate-100 sm:h-full sm:min-h-[210px]">
                  <Image
                    src={service.image}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 640px) 220px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 60%, rgba(255,255,255,0.08))" }} aria-hidden="true" />
                </div>

                {/* Number + icon + content */}
                <div className="flex min-w-0 flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-heading text-3xl font-bold text-brand-gold/30 leading-none w-8 text-right">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy group-hover:bg-brand-gold/15 group-hover:text-brand-gold transition-colors">
                      {service.icon}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="font-heading text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-gold transition-colors">
                      {service.title}
                    </h2>
                    <p className="font-sans text-sm font-semibold text-brand-gold mb-3">{service.tagline}</p>
                    <p className="font-sans text-sm text-slate-600 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="shrink-0 self-center text-slate-300 group-hover:text-brand-gold transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Not sure which service you need?
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Start with a readiness check, we will recommend exactly what is right for your stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ipo-readiness-tool"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
            >
              Take the Readiness Check
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
