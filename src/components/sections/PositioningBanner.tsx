import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PositioningBanner() {
  return (
    <section
      className="relative w-full py-16 sm:py-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0F2D52 0%, #0D4A6F 100%)" }}
      aria-label="Positioning statement"
    >
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#ECB85B,transparent)" }} aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#ECB85B,transparent)" }} aria-hidden="true" />

      {/* Subtle upward-arrow motif */}
      <svg
        className="absolute right-6 bottom-0 h-full w-auto opacity-10 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <path d="M20 180 L100 60 L140 110 L190 20" stroke="#ECB85B" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 20 h40 v40" stroke="#ECB85B" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading font-bold text-white leading-tight tracking-tight mb-4"
          style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.9rem)" }}>
          India&rsquo;s Leading IPO Advisor and{" "}
          <span style={{ color: "#ECB85B" }}>Growth Capital Expert</span>
        </h2>
        <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Trusted by promoters across India to raise capital, prepare for the
          public markets, and list successfully.
        </p>
        <Link
          href="/get-listed"
          className="group mt-8 inline-flex items-center justify-center gap-2 rounded-lg font-bold text-[#0D4A6F] hover:opacity-90 active:scale-[.98] transition-all duration-150 cursor-pointer"
          style={{
            background: "#ECB85B",
            boxShadow: "0 4px 18px rgba(236,184,91,0.3)",
            padding: "clamp(0.6rem, 0.9vw, 0.875rem) clamp(1.4rem, 2vw, 1.9rem)",
            fontSize: "clamp(0.82rem, 1vw, 0.94rem)",
          }}
        >
          Get Listed, Check Your IPO Eligibility
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
