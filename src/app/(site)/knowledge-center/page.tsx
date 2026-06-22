import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/forms/NewsletterForm";
import { getPublishedArticles } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge Center",
  description:
    "In-depth guides, regulatory updates, and practical insights on SME IPOs, SEBI compliance, and capital markets — written by Be IPO Ready advisors.",
};

const CATEGORY_COLORS: Record<string, string> = {
  Regulation: "bg-blue-50 text-blue-700 border-blue-200",
  Documentation: "bg-slate-100 text-slate-700 border-slate-200",
  Fundraising: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Valuation: "bg-amber-50 text-amber-700 border-amber-200",
  Governance: "bg-purple-50 text-purple-700 border-purple-200",
  Compliance: "bg-rose-50 text-rose-700 border-rose-200",
};

export default async function KnowledgeCenterPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <section className="bg-brand-navy py-20 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Insights &amp; Guides
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Knowledge Center
          </h1>
          <p className="font-sans text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            Practical guides on SME IPOs, SEBI compliance, valuations, and
            corporate governance — written by advisors who have done this, not
            just written about it.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge-center/${article.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-brand-gold hover:shadow-md transition-all duration-200"
              >
                {article.coverImageUrl && (
                  <div
                    className="h-40 bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: `url("${article.coverImageUrl}")` }}
                    role="img"
                    aria-label={`${article.title} cover image`}
                  />
                )}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <span
                    className={`font-sans text-xs font-semibold border rounded-full px-3 py-1 ${
                      CATEGORY_COLORS[article.category] ?? "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {article.category}
                  </span>
                  <span className="font-sans text-xs text-slate-400">{article.readTime}</span>
                </div>
                <div className="px-6 pb-6 flex-1 flex flex-col">
                  <h2 className="font-serif text-base font-bold text-brand-navy mb-3 leading-snug group-hover:text-brand-gold transition-colors">
                    {article.title}
                  </h2>
                  <p className="font-sans text-sm text-slate-600 leading-relaxed flex-1">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-sans text-xs text-slate-400">{article.publishedAt}</span>
                    <span className="font-sans text-sm font-semibold text-brand-gold group-hover:underline">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Get New Guides in Your Inbox
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            We publish 2–3 new guides per month. No spam — just practical
            IPO insights from advisors in the trenches.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
          <p className="font-sans text-xs text-white/30 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </>
  );
}
