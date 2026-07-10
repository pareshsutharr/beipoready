import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import type { ArticleCard } from "@/lib/cms";
import { articleImageUrl } from "@/lib/article-images";

function ArticleCard({ article, featured = false }: { article: ArticleCard; featured?: boolean }) {
  return (
    <Link
      href={`/knowledge-center/${article.slug}`}
      className={`group grid h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-xl ${
        featured ? "min-h-[430px] grid-rows-[220px_1fr] lg:min-h-[500px] lg:grid-rows-[260px_1fr]" : "grid-rows-[136px_1fr]"
      }`}
    >
      <div className="relative overflow-hidden">
        <Image
          src={articleImageUrl(article)}
          alt=""
          fill
          sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/72 via-brand-navy/18 to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-brand-navy shadow-sm">
          <BookOpen className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          {article.category}
        </span>
      </div>

      <div className={featured ? "flex min-h-0 flex-col p-6 sm:p-7" : "flex min-h-0 flex-col p-5"}>
        <h3 className={`mb-3 font-heading font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-gold ${
          featured ? "text-2xl sm:text-3xl" : "text-lg"
        }`}>
          {article.title}
        </h3>
        <p className={`mb-5 leading-relaxed text-slate-600 ${featured ? "line-clamp-4 text-base" : "line-clamp-2 text-sm"}`}>
          {article.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {article.readTime}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-gold">
            Read insight
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function KnowledgeCorner({ articles }: { articles: ArticleCard[] }) {
  // Hide the section entirely until there is published content
  if (!articles.length) return null;

  const latest = articles.slice(0, 3);
  const [primary, ...supporting] = latest;

  return (
    <section className="w-full bg-white py-18 sm:py-24" aria-labelledby="knowledge-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Knowledge Corner
            </p>
            <h2 id="knowledge-heading" className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
              Clear thinking for founders navigating capital and public markets
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Practical explainers, regulatory context, and readiness guidance written for decision-makers.
            </p>
          </div>
          <Link
            href="/knowledge-center"
            className="group inline-flex w-fit items-center gap-2 rounded-lg border border-brand-navy/15 bg-brand-cream px-4 py-2.5 text-sm font-bold text-brand-navy shadow-sm transition-all duration-200 hover:border-brand-gold/60 hover:text-brand-gold"
          >
            Explore knowledge center
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {primary && (
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]" role="list">
            <li>
              <ArticleCard article={primary} featured />
            </li>
            <li>
              <div className="grid h-full grid-cols-1 gap-5">
                {supporting.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
}
