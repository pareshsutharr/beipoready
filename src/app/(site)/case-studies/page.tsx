import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCaseStudies } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real SME IPO success stories — how Be IPO Ready guided companies across manufacturing, tech, and healthcare to successful listings on NSE Emerge and BSE SME.",
};

export default async function CaseStudiesPage() {
  const caseStudies = await getPublishedCaseStudies();

  return (
    <>
      <section className="bg-brand-navy py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Track Record
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
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
                {cs.coverImageUrl && (
                  <div
                    className="h-48 bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: `url("${cs.coverImageUrl}")` }}
                    role="img"
                    aria-label={`${cs.company} cover image`}
                  />
                )}
                <div className="bg-brand-navy/5 border-b border-slate-100 px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-gold">{cs.sector}</span>
                    <h2 className="font-serif text-lg font-bold text-brand-navy mt-0.5 group-hover:text-brand-gold transition-colors">
                      {cs.company}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-xs text-slate-500">IPO Readiness Score</p>
                    <p className="font-serif text-2xl font-bold text-brand-gold">{cs.readinessScore}<span className="text-sm text-slate-400">/100</span></p>
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
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
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
