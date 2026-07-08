"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, X, Plus } from "lucide-react";

const STEPS = [
  {
    number: 1,
    label: "Discover & Assess",
    brief: "Understand your business, goals and capital efficiency.",
    description:
      "A deep-dive into your business model, financials and promoter goals to understand exactly where you stand today.",
    points: ["Business & financial deep-dive", "Promoter goal alignment", "Capital-efficiency review"],
  },
  {
    number: 2,
    label: "Diagnose & Plan",
    brief: "Identify gaps; build a roadmap and timeline.",
    description:
      "We benchmark you against listing requirements and investor expectations, then build a practical roadmap with clear timelines.",
    points: ["Eligibility gap analysis", "IPO-readiness roadmap", "Milestones & ownership"],
  },
  {
    number: 3,
    label: "Prepare & Strengthen",
    brief: "Implement fixes; tighten governance and systems.",
    description:
      "We fix what the market will question — reporting, governance and cap table — before bankers and auditors do.",
    points: ["Financial reporting clean-up", "Board & governance setup", "Cap-table restructuring"],
  },
  {
    number: 4,
    label: "Raise & Structure",
    brief: "Structure the raise; connect the right investors.",
    description:
      "We size and structure your raise, prepare investor-grade documentation and open the right doors for your stage.",
    points: ["Issue sizing & structuring", "Investor documentation", "PE, family office & HNI connects"],
  },
  {
    number: 5,
    label: "Execute & List",
    brief: "Coordinate due diligence, documentation and listing.",
    description:
      "We select and coordinate merchant bankers, registrars and counsel, and drive due diligence through to listing day.",
    points: ["Intermediary selection", "Due diligence & DRHP support", "Listing-day execution"],
  },
  {
    number: 6,
    label: "Grow Beyond Listing",
    brief: "Post-listing support so value becomes wealth.",
    description:
      "Post-listing support across compliance, investor relations and growth so pre-IPO value becomes post-listing wealth.",
    points: ["Compliance & disclosures", "Investor relations support", "Main Board migration path"],
  },
] as const;

type Step = (typeof STEPS)[number];

export default function ReadinessJourney() {
  const secRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const [activeStep, setActiveStep] = useState<Step | null>(null);

  const closePopup = useCallback(() => setActiveStep(null), []);

  useEffect(() => {
    if (!activeStep) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closePopup(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeStep, closePopup]);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
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
      }
    );
    return () => {
      cancelled = true;
      ctx?.revert();
    };
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
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">How We Work</p>
          <h2 id="journey-heading" className="font-heading text-3xl sm:text-4xl font-bold text-brand-navy mb-4">A clear path from where you are to publicly listed</h2>
        </div>

        {/* ── Desktop timeline ── */}
        <div className="jrn-desktop hidden lg:block relative mb-16">
          {/* Animated SVG connecting line */}
          <svg className="absolute top-[22px] left-[calc(10%-18px)] pointer-events-none" style={{ width: "80%", overflow: "visible" }} viewBox="0 0 800 4" preserveAspectRatio="none" aria-hidden="true">
            <path ref={lineRef} d="M0 2 L800 2" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <defs>
              <linearGradient id="lineGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="800" y2="0">
                <stop offset="0%"   stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="40%"  stopColor="#F59E0B" stopOpacity="1" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex items-start justify-between gap-3">
            {STEPS.map((step) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(step)}
                className="group flex flex-col items-center flex-1 min-w-0 cursor-pointer focus-visible:outline-none"
                aria-haspopup="dialog"
                aria-label={`${step.label} — view details`}
              >
                {/* Node */}
                <div
                  className="jrn-node relative w-11 h-11 rounded-full flex items-center justify-center mb-4 z-10 border-2 border-brand-gold group-hover:border-brand-gold-light group-focus-visible:border-brand-gold-light"
                  style={{ background: "linear-gradient(135deg,#0F2D52,#1E3A5F)", boxShadow: "0 0 0 4px rgba(245,158,11,0.15), 0 4px 16px rgba(245,158,11,0.3)" }}
                >
                  <span className="font-heading text-base font-bold text-brand-gold">{step.number}</span>
                </div>

                {/* Text */}
                <div className="jrn-label text-center px-2">
                  <p className="font-heading text-sm font-bold text-brand-navy leading-snug mb-1">{step.label}</p>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">{step.brief}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold group-hover:underline">
                    <Plus className="w-3 h-3" aria-hidden="true" />
                    View details
                  </span>
                </div>
              </button>
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
                  <span className="font-heading text-sm font-bold text-brand-gold">{step.number}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 mt-2" style={{ background: "linear-gradient(to bottom, rgba(245,158,11,0.5), transparent)", minHeight: "32px" }} aria-hidden="true" />
                )}
              </div>
              <div className="pb-10">
                <p className="font-heading text-base font-bold text-brand-navy leading-snug mb-1">{step.label}</p>
                <p className="text-sm text-slate-500 leading-relaxed mb-2">{step.brief}</p>
                <button
                  type="button"
                  onClick={() => setActiveStep(step)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-gold hover:underline cursor-pointer"
                  aria-haspopup="dialog"
                  aria-label={`${step.label} — view details`}
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  View details
                </button>
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

      {/* ── Step details popup ── */}
      {activeStep && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="jrn-popup-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(7,15,30,0.6)", backdropFilter: "blur(3px)" }}
            onClick={closePopup}
            aria-hidden="true"
          />

          {/* Card */}
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div
              className="flex items-center gap-4 px-6 py-5"
              style={{ background: "linear-gradient(135deg,#0F2D52,#1E3A5F)" }}
            >
              <div
                className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 border-brand-gold"
                style={{ boxShadow: "0 0 0 4px rgba(245,158,11,0.15)" }}
              >
                <span className="font-heading text-base font-bold text-brand-gold">{activeStep.number}</span>
              </div>
              <h3 id="jrn-popup-title" className="font-heading text-lg font-bold text-white leading-snug flex-1">
                {activeStep.label}
              </h3>
              <button
                type="button"
                onClick={closePopup}
                className="shrink-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{activeStep.description}</p>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold mb-3">What we do here</p>
              <ul className="space-y-2.5" role="list">
                {activeStep.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm font-medium text-slate-700 leading-snug">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
