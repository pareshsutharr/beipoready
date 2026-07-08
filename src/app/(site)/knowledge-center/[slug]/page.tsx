import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/lib/cms";

const CATEGORY_IMAGES: Record<string, string> = {
  Regulation:    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&h=600&fit=crop&q=85",
  Documentation: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=600&fit=crop&q=85",
  Fundraising:   "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&h=600&fit=crop&q=85",
  Valuation:     "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=600&fit=crop&q=85",
  Governance:    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=600&fit=crop&q=85",
  Compliance:    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=600&fit=crop&q=85",
};
const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=600&fit=crop&q=85";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
  };
}

function renderMarkdown(body: string): ReactNode[] {
  const lines = body.split("\n");
  const elements: ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="font-heading text-xl font-bold text-brand-navy mt-10 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="font-heading text-lg font-bold text-brand-navy mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key++} className="font-sans text-sm text-slate-700 leading-relaxed ml-4 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (line.trim() !== "") {
      elements.push(
        <p key={key++} className="font-sans text-base text-slate-700 leading-relaxed">
          {line}
        </p>
      );
    }
  }

  return elements;
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <main>
      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <img src={article.coverImageUrl ?? CATEGORY_IMAGES[article.category] ?? DEFAULT_ARTICLE_IMAGE} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/knowledge-center"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Knowledge Center
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-brand-gold bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1">
              {article.category}
            </span>
            <span className="font-sans text-xs text-white/40">{article.readTime}</span>
            <span className="font-sans text-xs text-white/40">{article.publishedAt}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
            {article.title}
          </h1>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {article.coverImageUrl && (
            <div
              className="mb-10 h-72 rounded-2xl border border-slate-200 bg-slate-200 bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url("${article.coverImageUrl}")` }}
              role="img"
              aria-label={`${article.title} cover image`}
            />
          )}
          <div className="space-y-4">
            {renderMarkdown(article.body)}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-white mb-4">
            Apply This to Your Company
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Our advisors can walk you through each of these points in the context
            of your specific business — at no cost for the first session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
            >
              Book a Free Consultation
            </Link>
            <Link
              href="/knowledge-center"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
