"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="w-full relative overflow-hidden h-[calc(100vh-64px)] min-h-[560px] bg-[#FEFBF2]"
      aria-label="Hero"
    >
      {/* ── RIGHT: team photo, left edge dissolves into the background (lg+) ── */}
      {/* Left edge tracks the centered max-w-7xl container (1280px wide, image
          starts 424px in), so the text/image geometry is identical on every
          screen width instead of drifting over the copy on large monitors. */}
      <div className="hero-img-merge hidden lg:block absolute inset-y-0">
        <Image
          src="/svgs/heroimg.png"
            // src="/heroaboutimg.png"
          alt="The Be IPO Ready advisory team collaborating in the office"
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[78%_center]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-20 flex flex-col lg:flex-row h-full relative">

        {/* ── LEFT: animated text ── */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-center py-10 sm:py-12 lg:py-8 relative z-10 shrink-0">
          <p className="hero-copy-in hero-delay-1 text-xs font-bold uppercase tracking-[0.18em] text-[#B9822E] mb-4">
            India&rsquo;s Leading IPO Advisor &amp; Growth Capital Expert
          </p>

          <h1 className="hero-copy-in hero-delay-2 font-heading font-bold leading-tight tracking-tight mb-4 lg:mb-5 text-[clamp(1.75rem,3vw,2.85rem)] text-[#0D4A6F]">
            <span className="block">From Growth Capital</span>
            <span className="block">to a Confident</span>
            <span className="block text-[#ECB85B]">IPO Listing</span>
          </h1>

          <p className="hero-copy-in hero-delay-3 leading-relaxed mb-7 lg:mb-9 text-[#475569] text-[clamp(0.9rem,1.15vw,1.05rem)] max-w-[460px]">
            We help ambitious Indian businesses raise the right capital,
            improve valuation readiness, and list successfully on NSE Emerge,
            BSE SME, and the Main Board.
          </p>

          <div className="hero-copy-in hero-delay-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-lg font-bold text-white hover:opacity-90 active:scale-[.98] transition-all duration-150 cursor-pointer bg-[#0D4A6F] shadow-[0_4px_18px_rgba(13,74,111,0.28)] [padding:clamp(0.6rem,0.9vw,0.875rem)_clamp(1.4rem,2vw,1.9rem)] text-[clamp(0.82rem,1vw,0.94rem)]"
            >
              Book an <br/> IPO Readiness Call
            </Link>
            <Link
              href="/ipo-readiness-tool"
              className="inline-flex items-center justify-center rounded-lg font-bold text-[#0D4A6F] border border-[#0D4A6F]/30 hover:bg-[#0D4A6F]/5 active:scale-[.98] transition-all duration-150 cursor-pointer [padding:clamp(0.6rem,0.9vw,0.875rem)_clamp(1.2rem,1.8vw,1.6rem)] text-[clamp(0.82rem,1vw,0.94rem)]"
            >
              Are You IPO Ready?<br/>2-Minute Check
            </Link>
          </div>
        </div>

        {/* ── Mobile / Tablet: photo below text, soft-blended top & bottom ── */}
        <div className="lg:hidden relative flex-1 min-h-[240px] -mx-4 sm:-mx-6 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]">
          <div className="hero-img-merge-mobile absolute inset-0">
            <Image
              src="/svgs/heroimg.png"
              alt="The Be IPO Ready advisory team collaborating in the office"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[60%_center]"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
