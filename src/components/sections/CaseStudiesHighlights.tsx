"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, BarChart3 } from "lucide-react";
import type { CaseStudyCard as CaseStudyCardType } from "@/lib/cms";

const INDUSTRY_COVER: Record<string, string> = {
  "Agro Processing": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop&q=80",
  "Engineering / B2B Tech": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=600&fit=crop&q=80",
  "Healthcare / Diagnostics": "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=600&fit=crop&q=80",
  "Finance": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=600&fit=crop&q=80",
  "Manufacturing": "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=600&fit=crop&q=80",
};
const DEFAULT_COVER = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=600&fit=crop&q=80";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function CaseStudySpotlightCard({ study }: { study: CaseStudyCardType }) {
  const coverImage = study.coverImageUrl ?? INDUSTRY_COVER[study.sector] ?? DEFAULT_COVER;

  return (
    <article
      className="relative z-20 mx-auto flex min-h-[470px] w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,45,82,0.14)]"
    >
      <div className="relative mx-2 mt-2 aspect-[1.45] overflow-hidden rounded-xl bg-brand-cream">
        <Image
          src={coverImage}
          alt=""
          fill
          sizes="430px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 font-heading text-xs font-bold text-brand-navy shadow-sm">
          {getInitials(study.company)}
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <span>{study.sector}</span>
          {study.readinessScore > 0 && (
            <>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1 text-brand-navy">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
              {study.readinessScore}/100
              </span>
            </>
          )}
        </div>

        <h3 className="font-heading text-xl font-bold leading-tight text-brand-navy sm:text-2xl">
          {study.company}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
          {study.outcome}
        </p>

        <Link
          href={`/case-studies/${study.slug}`}
          aria-label={`Read case study for ${study.company}`}
          className="mt-auto inline-flex w-fit items-center rounded-full bg-brand-navy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-gold hover:text-brand-navy"
        >
          Read case study
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function GhostCard({ study, side }: { study: CaseStudyCardType; side: "left" | "right" }) {
  const coverImage = study.coverImageUrl ?? INDUSTRY_COVER[study.sector] ?? DEFAULT_COVER;
  return (
    <div
      className={`pointer-events-none absolute top-14 hidden h-[420px] w-[300px] overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-45 shadow-[0_20px_54px_rgba(15,45,82,0.1)] lg:block ${
        side === "left" ? "left-1/2 -translate-x-[116%]" : "right-1/2 translate-x-[116%]"
      }`}
      aria-hidden="true"
    >
      <div className="relative h-40">
        <Image
          src={coverImage}
          alt=""
          fill
          sizes="300px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/25" aria-hidden="true" />
      </div>
      <div className="p-6">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
          <span className="line-clamp-1">{study.sector}</span>
          {study.readinessScore > 0 && (
            <>
              <span aria-hidden="true">•</span>
              <span>{study.readinessScore}/100</span>
            </>
          )}
        </div>
        <h3 className="line-clamp-2 font-heading text-xl font-bold leading-tight text-brand-navy">
          {study.company}
        </h3>
        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {study.outcome}
        </p>
        <span className="mt-6 inline-flex rounded-full bg-brand-navy/10 px-5 py-2 text-sm font-bold text-brand-navy">
          Read case study
        </span>
      </div>
    </div>
  );
}

export default function CaseStudiesHighlights({ caseStudies }: { caseStudies: CaseStudyCardType[] }) {
  if (!caseStudies.length) return null;

  const featured = caseStudies.slice(0, 7);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const activeStudy = featured[activeIndex];
  const previousStudy = featured[(activeIndex - 1 + featured.length) % featured.length];
  const nextStudy = featured[(activeIndex + 1) % featured.length];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isPaused || prefersReducedMotion || featured.length < 2) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((current) => (current + 1) % featured.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [featured.length, isPaused]);

  const goPrevious = () => {
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + featured.length) % featured.length);
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % featured.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <section className="w-full overflow-hidden bg-white py-16 sm:py-20" aria-labelledby="case-studies-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="mx-auto mb-4 inline-flex rounded-full bg-slate-100 px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-navy">
            Case Studies
          </p>
          <h2 id="case-studies-heading" className="font-heading text-3xl font-bold text-brand-navy sm:text-4xl">
            Real readiness. Real public-market outcomes.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Founder journeys shaped by governance, capital discipline, and IPO preparation that holds up under scrutiny.
          </p>
        </div>

        <div
          className="relative mx-auto min-h-[560px] max-w-5xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {featured.length > 1 && (
            <>
              <motion.div
                key={`left-${previousStudy.slug}`}
                initial={{ opacity: 0, x: direction > 0 ? -28 : -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <GhostCard study={previousStudy} side="left" />
              </motion.div>
              <motion.div
                key={`right-${nextStudy.slug}`}
                initial={{ opacity: 0, x: direction > 0 ? 8 : 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <GhostCard study={nextStudy} side="right" />
              </motion.div>
            </>
          )}

          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous case study"
            className="absolute left-0 top-[40%] z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-[0_10px_30px_rgba(15,45,82,0.1)] transition hover:-translate-y-0.5 hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
            disabled={featured.length < 2}
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link
            href="/case-studies"
            className="absolute right-0 top-0 z-30 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-navy shadow-sm transition hover:-translate-y-0.5 hover:text-brand-gold lg:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next case study"
            className="absolute right-0 top-[40%] z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-[0_10px_30px_rgba(15,45,82,0.1)] transition hover:-translate-y-0.5 hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-40 lg:flex"
            disabled={featured.length < 2}
          >
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <motion.div
            key={activeStudy.slug}
            initial={{ opacity: 0, x: direction * 42, scale: 0.985 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <CaseStudySpotlightCard study={activeStudy} />
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-3">
            {featured.map((study, index) => (
              <button
                key={study.slug}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show case study ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-3 w-3 rounded-full transition ${
                  index === activeIndex ? "bg-brand-gold ring-4 ring-brand-gold/15" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={goPrevious}
              aria-label="Previous case study"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              disabled={featured.length < 2}
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link
              href="/case-studies"
              className="inline-flex h-12 items-center rounded-full bg-brand-navy px-5 text-sm font-bold text-white"
            >
              View all
            </Link>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next case study"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-navy shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
              disabled={featured.length < 2}
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
