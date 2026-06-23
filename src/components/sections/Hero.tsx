"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UserAvatars } from "@/components/ui/user-avatars";

const STATS = [
  { num: "50+",      label: "SME IPOs Successfully Advised" },
  { num: "₹500Cr+",  label: "Pre-IPO Capital Raised" },
  { num: "95%",      label: "Client Satisfaction Rate" },
  { num: "10+",      label: "Years of Capital Markets Experience" },
];

const FOUNDER_USERS = [
  { id: 1, name: "Rajesh Kumar", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
  { id: 2, name: "Priya Mehta",  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
  { id: 3, name: "Amit Shah",    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
];

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
      {/* ── LEFT: amber/gold content panel ── */}
      <div
        className="flex items-center w-full lg:w-[54%] shrink-0"
        style={{ background: "linear-gradient(135deg,#0F2D52 0%,#1B4F8A 100%)" }}
      >
        <div
          ref={leftRef}
          className="w-full px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-20"
          style={{ maxWidth: "640px" }}
        >
          {/* Headline */}
          <h1
            className="anim font-serif font-bold leading-[1.13] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.9rem, 3.2vw, 3.25rem)", color: "#ffffff" }}
          >
            Your Architectural Path to the{" "}
            <span className="relative inline-block">
              Public Markets
              <span
                className="absolute left-0 -bottom-0.5 right-0 h-[3px] rounded-full"
                style={{ background: "#F59E0B" }}
                aria-hidden="true"
              />
            </span>
            .
          </h1>

          {/* Sub */}
          <p className="anim text-base sm:text-lg leading-relaxed mb-9 max-w-[500px]" style={{ color: "rgba(255,255,255,0.70)" }}>
            We don&apos;t just consult; we architect the structural integrity of your equity
            for a seamless IPO transition.
          </p>

          {/* CTA + Trusted by Founders */}
          <div className="anim flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-3">
            <Link
              href="/ipo-readiness-tool"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold hover:opacity-90 active:scale-[.98] transition-all duration-150 cursor-pointer text-[15px] whitespace-nowrap"
              style={{ background: "#F59E0B", color: "#0F2D52", boxShadow: "0 4px 22px rgba(245,158,11,0.45)" }}
            >
              Start Assessment
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <div className="flex items-center gap-3">
                <UserAvatars
                  users={FOUNDER_USERS}
                  size={40}
                  overlap={55}
                  maxVisible={3}
                  tooltipPlacement="top"
                />
                <span className="text-sm font-semibold text-white">Trusted by Founders</span>
              </div>
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
