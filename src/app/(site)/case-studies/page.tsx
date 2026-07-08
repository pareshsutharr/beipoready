import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCaseStudies } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real SME IPO success stories — how Be IPO Ready guided companies across manufacturing, tech, and healthcare to successful listings on NSE Emerge and BSE SME.",
};

function getInitials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

const SECTOR_IMAGES: Record<string, string> = {
  "Agro Processing":        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop&q=80",
  "Engineering / B2B Tech": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=400&fit=crop&q=80",
  "Healthcare / Diagnostics":"https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=1200&h=400&fit=crop&q=80",
  "Manufacturing":           "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=400&fit=crop&q=80",
  "Finance":                 "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=400&fit=crop&q=80",
};
const DEFAULT_SECTOR_IMAGE = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=400&fit=crop&q=80";

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=700&fit=crop&q=85" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Track Record
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Companies We&rsquo;ve Taken Public
          </h1>
          <p className="font-sans text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            Every company here started with real challenges — governance gaps,
            audit issues, or financial inconsistencies. Here is how we resolved
            them and got to listing.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-sans text-xs text-slate-400 mb-8 text-center">
            Note: Identifying details may be changed to protect client confidentiality.
          </p>
          <div className="grid grid-cols-1 gap-8">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-brand-gold hover:shadow-md transition-all duration-200"
              >
                <div className="relative h-52 overflow-hidden" aria-label={`${cs.company} cover image`}>
                  <img
                    src={cs.coverImageUrl ?? SECTOR_IMAGES[cs.sector] ?? DEFAULT_SECTOR_IMAGE}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(15,45,82,0.5))" }} aria-hidden="true" />
                  {/* Company logo monogram */}
                  <div className="absolute top-3 right-3 w-12 h-12 rounded-xl flex items-center justify-center shadow-xl"
                    style={{ background: "rgba(15,45,82,0.92)", border: "1.5px solid rgba(245,158,11,0.45)", backdropFilter: "blur(4px)" }}>
                    <span className="font-heading text-sm font-bold" style={{ color: "#F59E0B" }}>{getInitials(cs.company)}</span>
                  </div>
                  {/* Sector badge */}
                  <span className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-wide text-white bg-brand-gold/85 px-2.5 py-1 rounded-full">{cs.sector}</span>
                </div>
                <div className="bg-brand-navy/5 border-b border-slate-100 px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-brand-navy group-hover:text-brand-gold transition-colors">
                      {cs.company}
                    </h2>
                    <p className="font-sans text-xs text-slate-400 mt-0.5">{cs.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-xs text-slate-500">IPO Readiness Score</p>
                    <p className="font-heading text-2xl font-bold text-brand-gold">{cs.readinessScore}<span className="text-sm text-slate-400">/100</span></p>
                  </div>
                </div>

                <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Outcome</p>
                    <p className="font-sans text-sm text-slate-700 leading-relaxed">{cs.outcome}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">The Challenge</p>
                    <p className="font-sans text-sm text-slate-700 leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">The Result</p>
                    <p className="font-sans text-sm text-slate-700 leading-relaxed">{cs.result}</p>
                  </div>
                </div>

                <div className="px-8 pb-5 text-right">
                  <span className="font-sans text-sm font-semibold text-brand-gold group-hover:underline">
                    Read full case study →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Could your company be next?
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Take our free IPO Readiness Check and find out where you stand today.
          </p>
          <Link
            href="/ipo-readiness-tool"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
          >
            Take the Readiness Check
          </Link>
        </div>
      </section>
    </>
  );
}
