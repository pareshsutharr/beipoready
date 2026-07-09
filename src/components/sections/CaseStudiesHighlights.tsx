import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3 } from "lucide-react";
import type { CaseStudyCard as CaseStudyCardType } from "@/lib/cms";

const INDUSTRY_COVER: Record<string, string> = {
  "Agro Processing":       "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=260&fit=crop&q=80",
  "Engineering / B2B Tech":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=260&fit=crop&q=80",
  "Healthcare / Diagnostics":"https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=260&fit=crop&q=80",
  "Finance":               "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=260&fit=crop&q=80",
  "Manufacturing":         "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=260&fit=crop&q=80",
};
const DEFAULT_COVER = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=260&fit=crop&q=80";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function CaseStudyPreview({ study }: { study: CaseStudyCardType }) {
  const coverImage = study.coverImageUrl ?? INDUSTRY_COVER[study.sector] ?? DEFAULT_COVER;
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className="group grid h-full grid-rows-[120px_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-gold/60 hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <Image
          src={coverImage}
          alt=""
          aria-hidden="true"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-brand-navy/30" aria-hidden="true" />
        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/25 bg-brand-navy/90 shadow-sm">
          <span className="font-heading text-xs font-bold text-brand-gold">{getInitials(study.company)}</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-gold">
            {study.sector}
          </p>
          {study.readinessScore > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-cream px-2 py-1 text-xs font-bold text-brand-navy">
              <BarChart3 className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
              {study.readinessScore}/100
            </span>
          )}
        </div>
        <h3 className="mb-2 font-heading text-lg font-bold leading-snug text-brand-navy transition-colors group-hover:text-brand-gold">
          {study.company}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm font-medium leading-relaxed text-slate-600">
          {study.outcome}
        </p>
        <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-brand-navy transition-colors group-hover:text-brand-gold">
          Read case study
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export default function CaseStudiesHighlights({ caseStudies }: { caseStudies: CaseStudyCardType[] }) {
  if (!caseStudies.length) return null;

  const featured = caseStudies.slice(0, 3);

  return (
    <section className="w-full bg-brand-cream py-14 sm:py-16" aria-labelledby="case-studies-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
              Case Studies
            </p>
            <h2 id="case-studies-heading" className="font-heading text-2xl font-bold text-brand-navy sm:text-3xl">
              IPO readiness work, shown through real client journeys
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="group inline-flex items-center gap-2 text-sm font-bold text-brand-navy transition-colors duration-200 hover:text-brand-gold"
          >
            View all case studies
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-3" role="list">
          {featured.map((study) => (
            <li key={study.slug}>
              <CaseStudyPreview study={study} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
