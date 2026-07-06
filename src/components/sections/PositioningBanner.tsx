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
        <h2 className="font-serif font-bold text-white leading-tight tracking-tight mb-4"
          style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.9rem)" }}>
          India&rsquo;s Leading IPO Advisor and{" "}
          <span style={{ color: "#ECB85B" }}>Growth Capital Expert</span>
        </h2>
        <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Trusted by promoters across India to raise capital, prepare for the
          public markets, and list successfully.
        </p>
      </div>
    </section>
  );
}
