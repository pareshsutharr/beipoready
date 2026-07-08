import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ArticleCard } from "@/lib/cms";
import { articleImageUrl } from "@/lib/article-images";

export default function KnowledgeCorner({ articles }: { articles: ArticleCard[] }) {
  // Hide the section entirely until there is published content
  if (!articles.length) return null;

  const latest = articles.slice(0, 3);

  return (
    <section className="w-full py-20 sm:py-28" style={{ background: "#FFF" }} aria-labelledby="knowledge-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Knowledge Corner</p>
          <h2 id="knowledge-heading" className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F]">
            Insights for founders navigating capital and the markets
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" role="list">
          {latest.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/knowledge-center/${article.slug}`}
                className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-brand-gold/50 transition-colors duration-200 cursor-pointer"
                style={{ boxShadow: "0 2px 12px rgba(13,74,111,0.05)" }}
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={articleImageUrl(article)}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                    {article.category}
                  </p>
                  <h3 className="font-heading text-lg font-bold text-[#0D4A6F] leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">
                    {article.publishedAt} · {article.readTime}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Link
            href="/knowledge-center"
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#0D4A6F] hover:text-brand-gold transition-colors duration-200"
          >
            Explore the Knowledge Center
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
