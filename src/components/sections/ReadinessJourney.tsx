"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { number: 1, label: "Readiness Assessment",      description: "Benchmark your financials, governance, and operations against SME listing norms." },
  { number: 2, label: "Pre-IPO Preparation",       description: "Strengthen weak areas, restructure if needed, and build institutional-grade processes." },
  { number: 3, label: "Documentation & Compliance",description: "Prepare DRHP, statutory filings, and SEBI submissions with zero gaps." },
  { number: 4, label: "Valuation & Fundraising",   description: "Set a defensible price band and secure pre-IPO capital from aligned investors." },
  { number: 5, label: "Listing",                   description: "Execute a confident market debut with full regulatory clearance and investor readiness." },
] as const;

export default function ReadinessJourney() {
  const secRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          /* heading */
          const hd = secRef.current?.querySelector(".jrn-head");
          if (hd) gsap.from(hd, { y: 30, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: hd, start: "top 85%" } });

          /* SVG line draw */
          if (lineRef.current) {
            const len = lineRef.current.getTotalLength();
            gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(lineRef.current, {
              strokeDashoffset: 0, duration: 2, ease: "power2.inOut",
              scrollTrigger: { trigger: ".jrn-desktop", start: "top 80%" },
            });
          }

          /* desktop nodes pop in */
          gsap.from(".jrn-node", {
            scale: 0, duration: 0.4, stagger: 0.15, ease: "back.out(2)",
            scrollTrigger: { trigger: ".jrn-desktop", start: "top 80%" },
          });
          gsap.from(".jrn-label", {
            y: 16, duration: 0.4, stagger: 0.15, delay: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: ".jrn-desktop", start: "top 80%" },
          });

          /* mobile steps */
          gsap.from(".jrn-mob-step", {
            x: -30, duration: 0.5, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: ".jrn-mobile", start: "top 85%" },
          });

          /* CTA */
          const cta = secRef.current?.querySelector(".jrn-cta");
          if (cta) gsap.from(cta, { y: 20, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: cta, start: "top 92%" } });
        }, secRef);
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={secRef} className="w-full py-24 sm:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg,#F0F6FF 0%,#ffffff 100%)" }} aria-labelledby="journey-heading">

      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(15,45,82,0.06) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="jrn-head text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">The Process</p>
          <h2 id="journey-heading" className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-4">Your IPO Readiness Journey</h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            A structured, five-stage path that takes you from where you are today to a confident listing on the SME Exchange.
          </p>
        </div>

        {/* ── Desktop timeline ── */}
        <div className="jrn-desktop hidden lg:block relative mb-16">
          {/* Animated SVG connecting line */}
          <svg className="absolute top-[22px] left-[calc(10%-18px)] pointer-events-none" style={{ width: "80%", overflow: "visible" }} viewBox="0 0 800 4" preserveAspectRatio="none" aria-hidden="true">
            <path ref={lineRef} d="M0 2 L800 2" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="40%"  stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-start justify-between gap-3">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1 min-w-0">
                {/* Node */}
                <div
                  className="jrn-node relative w-11 h-11 rounded-full flex items-center justify-center mb-4 z-10 border-2 border-brand-gold"
                  style={{ background: "linear-gradient(135deg,#0F2D52,#1E3A5F)", boxShadow: "0 0 0 4px rgba(245,158,11,0.15), 0 4px 16px rgba(245,158,11,0.3)" }}
                >
                  <span className="font-serif text-base font-bold text-brand-gold">{step.number}</span>
                </div>

                {/* Text */}
                <div className="jrn-label text-center px-2">
                  <p className="font-serif text-sm font-bold text-brand-navy leading-snug mb-1">{step.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile timeline ── */}
        <div className="jrn-mobile lg:hidden flex flex-col mb-14">
          {STEPS.map((step, i) => (
            <div key={step.number} className="jrn-mob-step flex gap-5">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-brand-gold shrink-0 z-10"
                  style={{ background: "linear-gradient(135deg,#0F2D52,#1E3A5F)", boxShadow: "0 0 0 3px rgba(245,158,11,0.15)" }}
                >
                  <span className="font-serif text-sm font-bold text-brand-gold">{step.number}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 mt-2" style={{ background: "linear-gradient(to bottom, rgba(245,158,11,0.5), transparent)", minHeight: "32px" }} aria-hidden="true" />
                )}
              </div>
              <div className="pb-10">
                <p className="font-serif text-base font-bold text-brand-navy leading-snug mb-1">{step.label}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="jrn-cta text-center">
          <Link
            href="/ipo-readiness-tool"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-brand-navy-dark cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", boxShadow: "0 0 28px rgba(245,158,11,0.4), 0 4px 16px rgba(0,0,0,0.12)", transition: "box-shadow 0.3s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 40px rgba(245,158,11,0.6), 0 8px 24px rgba(0,0,0,0.15)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 28px rgba(245,158,11,0.4), 0 4px 16px rgba(0,0,0,0.12)"; }}
          >
            Check Your Readiness Score
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
