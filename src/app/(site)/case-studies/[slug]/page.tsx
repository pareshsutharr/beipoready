import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudyBySlug } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return {};
  return {
    title: `Case Study: ${cs.company}`,
    description: `${cs.company} — ${cs.issueSize} IPO on ${cs.exchange}, ${cs.subscription} oversubscribed. ${cs.summary.slice(0, 100)}...`,
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Case Studies
          </Link>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { label: "Sector", value: cs.sector },
              { label: "Exchange", value: cs.exchange },
              { label: "Issue Size", value: cs.issueSize },
              { label: "Subscription", value: cs.subscription },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                <p className="font-sans text-xs text-white/50">{stat.label}</p>
                <p className="font-serif text-sm font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">Case Study</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            {cs.company}
          </h1>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {cs.coverImageUrl && (
            <div
              className="h-72 rounded-2xl border border-slate-200 bg-slate-200 bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url("${cs.coverImageUrl}")` }}
              role="img"
              aria-label={`${cs.company} cover image`}
            />
          )}

          <div>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">Overview</h2>
            <p className="font-sans text-base text-slate-700 leading-relaxed">{cs.summary}</p>
          </div>

          <div className="border-l-4 border-brand-gold pl-6">
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">The Challenge</h2>
            <p className="font-sans text-base text-slate-700 leading-relaxed">{cs.challenge}</p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-4">Our Approach</h2>
            <ul className="space-y-3">
              {cs.approach.map((step, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-sm text-slate-700">
                  <span className="font-serif text-brand-gold font-bold shrink-0 w-5">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">The Result</h2>
            <p className="font-sans text-base text-slate-700 leading-relaxed">{cs.result}</p>
          </div>

          {/* Quote */}
          <blockquote className="bg-brand-navy rounded-2xl p-8">
            <p className="font-serif text-lg text-white/90 leading-relaxed mb-4 italic">&ldquo;{cs.quote}&rdquo;</p>
            <cite className="font-sans text-sm text-brand-gold not-italic">{cs.quotePerson}</cite>
          </blockquote>

        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-navy mb-4">
            See where your company stands
          </h2>
          <p className="font-sans text-base text-slate-600 mb-8 leading-relaxed">
            Take the same readiness assessment that Rajpur Agro, TechnoSynth,
            and HealthPlus used — free, online, and in under 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ipo-readiness-tool"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
            >
              Take the Free Readiness Check
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-brand-navy/20 text-brand-navy font-semibold rounded-lg hover:bg-brand-navy/5 transition-colors"
            >
              Talk to an Advisor
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
