"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import type { TestimonialCard as TestimonialCardType } from "@/lib/cms";

interface CardProps { company: string; industry: string; outcome: string; quote: string; attribution: string; slug: string; imageUrl: string | null; }

function CaseStudyCard({ company, industry, outcome, quote, attribution, slug, imageUrl }: CardProps) {
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
      {/* Top gradient stripe */}
      <div className="h-1 w-full group-hover:h-1.5 transition-all duration-300"
        style={{ background: "linear-gradient(90deg, #F59E0B, #0F2D52)" }} aria-hidden="true" />

      <div className="flex flex-col flex-1 p-7">
        {imageUrl && (
          <div className="mb-5 h-16 w-16 rounded-xl border border-slate-100 bg-slate-50 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url("${imageUrl}")` }} role="img" aria-label={`${company} logo`} />
        )}

        <span className="inline-block self-start text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full mb-4">
          {industry}
        </span>

        <h3 className="font-serif text-lg font-bold text-brand-navy mb-2 leading-snug">{company}</h3>

        <p className="text-sm font-semibold text-brand-navy/70 bg-brand-cream rounded-lg px-3 py-2 mb-5 leading-snug border border-brand-navy/8">
          {outcome}
        </p>

        <blockquote className="flex-1 mb-5">
          <Quote className="w-5 h-5 text-brand-gold/50 mb-2" aria-hidden="true" />
          <p className="text-sm text-slate-500 leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
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
    <section ref={secRef} className="w-full py-24 sm:py-32 bg-white" aria-labelledby="case-studies-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cs-head text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Client Outcomes</p>
          <h2 id="case-studies-heading" className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-4">Success Stories</h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">Real companies that went from pre-IPO uncertainty to successful listings with our advisory support.</p>
        </div>

        <ul className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12" role="list">
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
