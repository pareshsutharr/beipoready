import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, NotebookPen, FileSearch2, MonitorPlay, Clapperboard } from "lucide-react";
import NewsletterForm from "@/components/forms/NewsletterForm";
import SmeVsMainBoard from "@/components/sections/SmeVsMainBoard";
import { articleImageUrl } from "@/lib/article-images";
import { getPublishedArticles } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Knowledge Center",
  description:
    "In-depth guides, regulatory updates, and practical insights on SME IPOs, SEBI compliance, and capital markets, written by Be IPO Ready advisors.",
  path: "/knowledge-center",
  keywords: ["SME IPO guides", "SEBI compliance articles", "IPO knowledge center India"],
});

// The DB only has one regulation-flavoured category ("compliance"); it doubles
// as the "Regulatory Updates" bucket so the two tabs stay mutually exclusive
// without a schema change. Everything else falls under "Articles & Guides".
const REGULATORY_DB_CATEGORY = "Compliance";

const KNOWLEDGE_NAV = [
  { label: "Regulatory Updates", icon: FileCheck2, type: "regulatory" as const },
  { label: "Articles & Guides", icon: NotebookPen, type: "articles" as const },
  { label: "Case Studies", icon: FileSearch2, href: "/case-studies" },
  { label: "Webinars & Events", icon: MonitorPlay, href: "/webinars-events" },
  { label: "Video & Podcasts", icon: Clapperboard, href: "/video-podcasts" },
];

const SECTION_COPY = {
  regulatory: {
    label: "Regulatory Updates",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    empty: "No regulatory updates yet. Check back soon.",
  },
  articles: {
    label: "Articles & Guides",
    badgeClass: "bg-brand-gold/10 text-brand-navy border-brand-gold/30",
    empty: "No articles yet. Check back soon.",
  },
};

type Props = { searchParams: Promise<{ type?: string }> };

export default async function KnowledgeCenterPage({ searchParams }: Props) {
  const { type: rawType } = await searchParams;
  const activeType = rawType === "regulatory" ? "regulatory" : "articles";
  const copy = SECTION_COPY[activeType];

  const articles = await getPublishedArticles();
  const visibleArticles = articles.filter((article) =>
    activeType === "regulatory"
      ? article.category === REGULATORY_DB_CATEGORY
      : article.category !== REGULATORY_DB_CATEGORY
  );

  return (
    <>
      <section className="relative bg-brand-navy pt-20 pb-28 sm:pt-24 sm:pb-32 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&h=700&fit=crop&q=85" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Insights &amp; Guides
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Knowledge Center
          </h1>
          <p className="font-sans text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            Practical guides on SME IPOs, SEBI compliance, valuations, and
            corporate governance, written by advisors who have done this, not
            just written about it.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream pb-16 sm:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section nav: floats up over the hero, doubles as filter tabs (Regulatory
              Updates / Articles & Guides) and cross-links to the other content types. */}
          <nav aria-label="Knowledge Center sections" className="-mt-12 mb-12 sm:-mt-14">
            <div
              className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:justify-center"
            >
              {KNOWLEDGE_NAV.map((item) => {
                const isTab = "type" in item;
                const isActive = isTab && item.type === activeType;
                const href = isTab ? `/knowledge-center?type=${item.type}` : item.href!;
                return (
                  <Link
                    key={item.label}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 font-sans text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "bg-brand-navy text-white"
                        : "text-slate-600 hover:bg-brand-cream hover:text-brand-navy"
                    }`}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {visibleArticles.length === 0 && (
            <p className="font-sans text-sm text-slate-500 text-center py-12">{copy.empty}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge-center/${article.slug}`}
                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-brand-gold hover:shadow-md transition-all duration-200"
              >
                <div
                  className="h-44 bg-slate-200 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 origin-center"
                  style={{ backgroundImage: `url("${articleImageUrl(article)}")` }}
                  role="img"
                  aria-label={`${article.title} cover image`}
                />
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <span className={`font-sans text-xs font-semibold border rounded-full px-3 py-1 ${copy.badgeClass}`}>
                    {copy.label}
                  </span>
                  <span className="font-sans text-xs text-slate-400">{article.readTime}</span>
                </div>
                <div className="px-6 pb-6 flex-1 flex flex-col">
                  <h2 className="font-heading text-base font-bold text-brand-navy mb-3 leading-snug group-hover:text-brand-gold transition-colors">
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

      <SmeVsMainBoard />

      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Get New Guides in Your Inbox
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            We publish 2–3 new guides per month. No spam, just practical
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
