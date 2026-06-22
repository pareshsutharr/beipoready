"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ClipboardCheck, Calculator, ArrowRight } from "lucide-react";

const TOOLS = [
  { icon: ClipboardCheck, eyebrow: "Free Assessment", title: "IPO Readiness Tool", description: "Answer 20 structured questions across financials, governance, operations, and compliance. Get an instant readiness score with a prioritised action plan tailored to your company.", cta: "Check Your Readiness", href: "/ipo-readiness-tool", accent: "#F59E0B" },
  { icon: Calculator,     eyebrow: "Free Calculator",  title: "Issue Size Calculator", description: "Input your revenue, PAT, and growth metrics to estimate a defensible IPO issue size and indicative price band — helping you plan the raise before you engage a merchant banker.", cta: "Calculate Now",       href: "/issue-size-calculator",  accent: "#3B82F6" },
] as const;

function ToolCard({ icon: Icon, eyebrow, title, description, cta, href, accent }: { icon: React.ElementType; eyebrow: string; title: string; description: string; cta: string; href: string; accent: string }) {
  return (
    <div
      className="tool-card group relative flex flex-col rounded-2xl p-8 overflow-hidden h-full"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s" }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = `rgba(255,255,255,0.08)`;
        el.style.borderColor = `${accent}40`;
        el.style.boxShadow = `0 20px 60px ${accent}18`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.background = "rgba(255,255,255,0.05)";
        el.style.borderColor = "rgba(255,255,255,0.1)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Corner glow */}
      <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
        style={{ background: `radial-gradient(circle, ${accent}30 0%, transparent 70%)` }} aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} aria-hidden="true" />

      <span className="inline-flex self-start text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-5 border"
        style={{ color: accent, background: `${accent}15`, borderColor: `${accent}30` }}>
        {eyebrow}
      </span>

      <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${accent}18`, boxShadow: `0 0 24px ${accent}20` }}>
        <Icon className="w-6 h-6" style={{ color: accent }} aria-hidden="true" />
      </div>

      <h3 className="font-serif text-2xl font-bold text-white mb-3 leading-snug">{title}</h3>
      <p className="text-sm sm:text-base text-white/60 leading-relaxed flex-1 mb-8">{description}</p>

      <Link
        href={href}
        className="group/btn inline-flex items-center justify-center gap-2 self-start px-6 py-3.5 rounded-xl font-bold text-brand-navy-dark cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", boxShadow: "0 0 20px rgba(245,158,11,0.35)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 32px rgba(245,158,11,0.55)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(245,158,11,0.35)"; }}
      >
        {cta}
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function ToolsPreview() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    import("gsap").then(({ gsap }) => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          const hd = secRef.current?.querySelector(".tp-head");
          if (hd) gsap.from(hd, { y: 30, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: hd, start: "top 85%" } });
          const cards = secRef.current ? Array.from(secRef.current.querySelectorAll(".tool-card")) : [];
          if (cards.length) gsap.from(cards, { y: 40, duration: 0.65, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: cards[0], start: "top 88%" } });
        }, secRef);
      });
    });
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={secRef} className="relative w-full py-24 sm:py-32 overflow-hidden" style={{ background: "linear-gradient(135deg,#070F1E 0%,#0F2D52 100%)" }} aria-labelledby="tools-heading">
      {/* Dot grid texture */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true"
        style={{ backgroundImage: "radial-gradient(circle, #F59E0B 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="tp-head text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Interactive Tools</p>
          <h2 id="tools-heading" className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">Know Where You Stand — For Free</h2>
          <p className="text-base sm:text-lg text-white/55 max-w-xl mx-auto leading-relaxed">Two free tools built for promoters and CFOs exploring the IPO path. No sign-up required.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TOOLS.map((t) => <ToolCard key={t.href} {...t} />)}
        </div>
      </div>
    </section>
  );
}
