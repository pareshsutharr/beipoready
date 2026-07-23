export default function VisualQuote() {
  return (
    <section
      className="relative w-full h-[340px] sm:h-[400px] flex items-center justify-center overflow-hidden"
      aria-label="IPO advisory visual"
    >
      {/* Background stock photo, financial district / exchange trading floor */}
      <img
        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=800&fit=crop&q=85"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark navy gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(7,15,30,0.85) 0%, rgba(15,45,82,0.80) 100%)" }}
        aria-hidden="true"
      />

      {/* Gold top & bottom edge lines */}
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#F59E0B,transparent)" }} aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#F59E0B,transparent)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-10 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-gold mb-5">Our Philosophy</p>
        <blockquote className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[1.2] mb-6">
          &ldquo;We don&apos;t just prepare companies for an IPO.{" "}
          <span style={{ color: "#F59E0B" }}>We build them to deserve one.</span>&rdquo;
        </blockquote>
        <p className="text-sm text-white/60 font-medium tracking-wide">
         , Be IPO Ready Advisory Team
        </p>
      </div>
    </section>
  );
}
