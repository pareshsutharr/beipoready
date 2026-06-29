"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import type { TestimonialCard as TestimonialCardType } from "@/lib/cms";

const INDUSTRY_COVER: Record<string, string> = {
  "Agro Processing":       "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=260&fit=crop&q=80",
  "Engineering / B2B Tech":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=260&fit=crop&q=80",
  "Healthcare / Diagnostics":"https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=260&fit=crop&q=80",
  "Finance":               "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=260&fit=crop&q=80",
  "Manufacturing":         "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=260&fit=crop&q=80",
};
const DEFAULT_COVER = "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=260&fit=crop&q=80";

interface CardProps { company: string; industry: string; outcome: string; quote: string; attribution: string; slug: string; imageUrl: string | null; }

function CaseStudyCard({ company, industry, outcome, quote, attribution, slug, imageUrl }: CardProps) {
  const coverImage = INDUSTRY_COVER[industry] ?? DEFAULT_COVER;
  return (
    <div
      className="case-card group flex flex-col rounded-2xl overflow-hidden h-full"
      style={{ background: "#fff", border: "1px solid #e2e8f0", transition: "box-shadow 0.3s, border-color 0.3s, transform 0.3s" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "0 20px 60px -12px rgba(15,45,82,0.18), 0 4px 16px rgba(0,0,0,0.06)";
        el.style.borderColor = "rgba(245,158,11,0.45)";
        el.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "none";
        el.style.borderColor = "#e2e8f0";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Cover image */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden">
        <img
          src={coverImage}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(15,45,82,0.55))" }} />
        {/* Industry badge pinned over image */}
        <span className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-wider text-white bg-brand-gold/90 px-2.5 py-1 rounded-full">
          {industry}
        </span>
        {/* Company logo if provided */}
        {imageUrl && (
          <div className="absolute top-3 right-3 h-10 w-10 rounded-lg border border-white/30 bg-white/90 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url("${imageUrl}")` }} role="img" aria-label={`${company} logo`} />
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">

        <h3 className="mb-3 font-serif text-xl font-bold leading-snug text-brand-navy">{company}</h3>

        <p className="mb-5 rounded-lg border border-brand-navy/8 bg-brand-cream px-3.5 py-2.5 text-[0.95rem] font-semibold leading-snug text-brand-navy/70">
          {outcome}
        </p>

        <blockquote className="flex-1 mb-5">
          <Quote className="w-5 h-5 text-brand-gold/50 mb-2" aria-hidden="true" />
          <p className="text-[0.95rem] italic leading-relaxed text-slate-500">&ldquo;{quote}&rdquo;</p>
          <footer className="mt-2 text-xs text-slate-400 font-medium not-italic">— {attribution}</footer>
        </blockquote>

        <Link href={`/case-studies/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-gold hover:text-amber-600 transition-colors duration-150 group/link">
          Read Case Study
          <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover/link:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function CaseStudiesHighlights({ testimonials }: { testimonials: TestimonialCardType[] }) {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          const hd = secRef.current?.querySelector(".cs-head");
          if (hd) gsap.from(hd, { y: 30, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: hd, start: "top 85%" } });
          const cards = secRef.current ? Array.from(secRef.current.querySelectorAll(".case-card")) : [];
          if (cards.length) gsap.from(cards, { y: 40, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: cards[0], start: "top 88%" } });
        }, secRef);
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={secRef} className="flex h-[55vh] max-h-[55vh] w-full items-center overflow-hidden bg-white" aria-labelledby="case-studies-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="cs-head text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Client Outcomes</p>
          <h2 id="case-studies-heading" className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-4">Success Stories</h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">Real companies that went from pre-IPO uncertainty to successful listings with our advisory support.</p>
        </div>

        <ul className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3" role="list">
          {testimonials.map((t) => (
            <li key={`${t.client_name}-${t.company_name ?? t.case_study_slug ?? "t"}`} className="flex">
              <CaseStudyCard
                company={t.company_name ?? t.client_name}
                industry={t.industry ?? "Client Outcome"}
                outcome={t.outcome ?? "IPO readiness engagement"}
                quote={t.quote}
                imageUrl={t.image_url}
                attribution={t.client_title ? `${t.client_name}, ${t.client_title}` : t.client_name}
                slug={t.case_study_slug ?? "rajpur-agro-nse-emerge"}
              />
            </li>
          ))}
        </ul>

        <div className="text-center">
          <Link href="/case-studies" className="group inline-flex items-center gap-2 text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors duration-200">
            View All Case Studies
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
