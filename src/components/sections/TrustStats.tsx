"use client";

import { useEffect, useRef } from "react";

type Stat = { value: string; label: string };

function parseNum(raw: string) {
  const m = raw.match(/^([₹$€£]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  return { pre: m[1] ?? "", num: parseFloat(m[2] ?? "0"), suf: m[3] ?? "" };
}

function StatCard({ value, label, index }: { value: string; label: string; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const parsed = parseNum(value);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          /* card slide-up */
          gsap.from(cardRef.current, {
            y: 32, duration: 0.6,
            delay: index * 0.08, ease: "power3.out",
            scrollTrigger: { trigger: cardRef.current, start: "top 90%" },
          });

          /* counter */
          if (parsed && numRef.current) {
            const o = { v: 0 };
            gsap.to(o, {
              v: parsed.num, duration: 2.2, ease: "power2.out",
              delay: index * 0.1,
              scrollTrigger: { trigger: cardRef.current, start: "top 88%" },
              onUpdate() {
                if (numRef.current) {
                  const d = parsed.num % 1 === 0 ? Math.round(o.v).toString() : o.v.toFixed(1);
                  numRef.current.textContent = parsed.pre + d + parsed.suf;
                }
              },
            });
          }
        }, cardRef);
      });
    });
    return () => ctx?.revert();
  }, [index, parsed]);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col items-center text-center p-7 rounded-2xl group cursor-default"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(245,158,11,0.08)";
        el.style.borderColor = "rgba(245,158,11,0.3)";
        el.style.boxShadow = "0 8px 32px rgba(245,158,11,0.12)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(90deg,transparent,#F59E0B,transparent)" }} aria-hidden="true" />

      <span
        ref={numRef}
        className="font-serif text-4xl sm:text-5xl font-bold tracking-tight leading-none mb-3"
        style={{
          background: "linear-gradient(135deg, #F59E0B, #FCD34D)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {parsed ? parsed.pre + "0" + parsed.suf : value}
      </span>

      <span className="text-sm sm:text-base text-slate-400 font-medium leading-snug max-w-[150px]">
        {label}
      </span>
    </div>
  );
}

export default function TrustStats({ stats }: { stats: Stat[] }) {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          if (headRef.current) {
            gsap.from(headRef.current, {
              y: 24, duration: 0.7, ease: "power3.out",
              scrollTrigger: { trigger: headRef.current, start: "top 85%" },
            });
          }
        });
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section
      className="relative w-full py-24 sm:py-28 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #070F1E 0%, #0F2D52 100%)" }}
      aria-label="Key statistics"
    >
      {/* Radial glow */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)" }} aria-hidden="true" />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[200px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.1) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">By the Numbers</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Proven Results Across Every Engagement</h2>
        </div>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => <StatCard key={s.label} value={s.value} label={s.label} index={i} />)}
        </dl>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.2),transparent)" }} aria-hidden="true" />
    </section>
  );
}
