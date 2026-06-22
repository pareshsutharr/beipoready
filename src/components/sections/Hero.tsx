"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Shield, Award, CheckCircle2, ArrowRight } from "lucide-react";

const STATS = [
  { num: "50+",      label: "SME IPOs Successfully Advised" },
  { num: "₹500Cr+",  label: "Pre-IPO Capital Raised" },
  { num: "95%",      label: "Client Satisfaction Rate" },
  { num: "10+",      label: "Years of Capital Markets Experience" },
];

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm whitespace-nowrap">
      <span className="text-yellow-500">{icon}</span>
      {label}
    </div>
  );
}

export default function Hero() {
  const leftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    import("gsap").then(({ gsap }) => {
      ctx = gsap.context(() => {
        const els = leftRef.current
          ? Array.from(leftRef.current.querySelectorAll(".anim"))
          : [];
        if (els.length) {
          gsap.from(els, {
            y: 28,
            duration: 0.65,
            stagger: 0.11,
            ease: "power3.out",
            delay: 0.05,
          });
        }
      }, leftRef);
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section
      className="w-full flex"
      style={{ minHeight: "calc(100vh - 96px)" }}
      aria-label="Hero"
    >
      {/* ── LEFT: navy content panel ── */}
      <div
        className="flex items-center w-full lg:w-[54%] shrink-0"
        style={{ background: "linear-gradient(135deg,#0F2D52 0%,#1B4F8A 100%)" }}
      >
        <div
          ref={leftRef}
          className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-20"
          style={{ maxWidth: "640px" }}
        >
          {/* Eyebrow */}
          <div
            className="anim inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-7"
            style={{ background: "#F59E0B", color: "#0F2D52" }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            India&apos;s Premier SME IPO Advisory
          </div>

          {/* Headline */}
          <h1
            className="anim font-serif font-bold text-white leading-[1.13] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 3.25rem)" }}
          >
            Your Trusted Partner in{" "}
            <span className="relative inline-block">
              IPO Readiness
              <span
                className="absolute left-0 -bottom-0.5 right-0 h-[3px] rounded-full"
                style={{ background: "#F59E0B" }}
                aria-hidden="true"
              />
            </span>
            {" "}&amp;{" "}
            <span style={{ color: "#F59E0B" }}>Pre&#8209;IPO</span>{" "}
            Value Creation
          </h1>

          {/* Sub */}
          <p className="anim text-base sm:text-lg text-white/70 leading-relaxed mb-9 max-w-[500px]">
            We guide growth-stage SMEs through every stage of the public listing journey —
            from pre-IPO fundraising and valuation to readiness assessments, documentation,
            and a confident market debut.
          </p>

          {/* CTAs */}
          <div className="anim flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-9">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl font-bold text-[#0F2D52] hover:opacity-90 active:scale-[.98] transition-all duration-150 cursor-pointer text-[15px] whitespace-nowrap"
              style={{ background: "#F59E0B", boxShadow: "0 4px 22px rgba(245,158,11,0.45)" }}
            >
              Book a Free Call
            </Link>
            <Link
              href="/ipo-readiness-tool"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white border-2 border-white/30 hover:border-white/70 hover:bg-white/10 transition-all duration-200 cursor-pointer text-[15px] whitespace-nowrap"
            >
              Check IPO Readiness
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Trust badges */}
          <div className="anim flex flex-wrap gap-2">
            <TrustBadge icon={<Shield className="w-3.5 h-3.5" />} label="SEBI Registered" />
            <TrustBadge icon={<Award className="w-3.5 h-3.5" />} label="ICAI Member" />
            <TrustBadge icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="50+ SMEs Advised" />
          </div>
        </div>
      </div>

      {/* ── DIAGONAL SEPARATOR (visual only — never overlaps content) ── */}
      <div className="hidden lg:block relative w-14 shrink-0 overflow-hidden" aria-hidden="true">
        {/* Navy fill (left triangle) */}
        <div
          className="absolute inset-0"
          style={{ background: "#1B4F8A", clipPath: "polygon(0 0, 55% 0, 0 100%)" }}
        />
        {/* Gold stripe */}
        <div
          className="absolute inset-0"
          style={{ background: "#F59E0B", clipPath: "polygon(55% 0, 75% 0, 20% 100%, 0 100%)" }}
        />
        {/* White fill (right triangle) */}
        <div
          className="absolute inset-0"
          style={{ background: "#ffffff", clipPath: "polygon(75% 0, 100% 0, 100% 100%, 20% 100%)" }}
        />
      </div>

      {/* ── RIGHT: stat cards ── */}
      <div className="hidden lg:flex flex-1 bg-white items-center justify-center px-10 xl:px-16">
        <div className="w-full max-w-sm space-y-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-slate-100"
              style={{ boxShadow: "0 2px 16px rgba(15,45,82,0.08)" }}
            >
              <span
                className="font-serif text-3xl font-bold shrink-0 leading-none"
                style={{ color: "#0F2D52" }}
              >
                {s.num}
              </span>
              <span className="text-sm text-slate-600 font-medium leading-snug">{s.label}</span>
            </div>
          ))}

          {/* Bottom CTA card */}
          <Link
            href="/ipo-readiness-tool"
            className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4 group cursor-pointer transition-all duration-200 hover:opacity-95"
            style={{ background: "linear-gradient(135deg,#0F2D52,#1B4F8A)", boxShadow: "0 4px 20px rgba(15,45,82,0.25)" }}
          >
            <div>
              <p className="text-white font-bold text-sm leading-snug">Free IPO Readiness Check</p>
              <p className="text-white/60 text-xs mt-0.5">Answer 20 questions. Get your score instantly.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-yellow-400 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
