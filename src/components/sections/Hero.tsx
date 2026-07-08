"use client";

import Image from "next/image";
import Link from "next/link";

const PANEL_H = "calc(100vh - 64px)";

const HEADLINE_LINES = [
  { text: "From Growth Capital", accent: false },
  { text: "to a Confident", accent: false },
  { text: "Public Listing", accent: true },
];

const LETTER_STAGGER = 0.032; // seconds per letter
const HEADLINE_LETTERS = HEADLINE_LINES.reduce(
  (n, l) => n + l.text.replace(/ /g, "").length,
  0
);
const AFTER_HEADLINE = 0.35 + HEADLINE_LETTERS * LETTER_STAGGER;

function AnimatedHeadline() {
  let letterIndex = 0;
  return (
    <h1
      className="font-heading font-bold leading-tight tracking-tight mb-4 lg:mb-5"
      style={{ fontSize: "clamp(1.75rem, 3vw, 2.85rem)", color: "#0D4A6F" }}
    >
      {HEADLINE_LINES.map((line, li) => (
        <span key={li} className="block">
          {line.text.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, ci) => {
                const delay = 0.35 + letterIndex++ * LETTER_STAGGER;
                return (
                  <span
                    key={ci}
                    className="hero-letter inline-block"
                    style={{
                      animationDelay: `${delay}s`,
                      color: line.accent ? "#ECB85B" : undefined,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
              {wi < line.text.split(" ").length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  return (
    <>
    <style>{`
      @keyframes heroLetterIn {
        from { opacity: 0; transform: translateX(-0.55em); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes heroFadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .hero-letter {
        opacity: 0;
        animation: heroLetterIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .hero-fade {
        opacity: 0;
        animation: heroFadeUp 0.6s ease-out both;
      }
      /* 40/60 split: text owns the left 40% of the viewport, the photo the
         right 55%, at every desktop width. The left ~30% of the photo fades
         so the seam stays soft without ghosting over the copy. */
      .hero-img-merge {
        -webkit-mask-image: linear-gradient(to left, transparent 0%, black 7%, black 68%, transparent 97%);
                mask-image: linear-gradient(to left, transparent 0%, black 7%, black 68%, transparent 97%);
        left: 45%;
        right: 0;
      }
      .hero-img-merge-mobile {
        -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 28%, black 82%, transparent 100%);
                mask-image: linear-gradient(to bottom, transparent 0%, black 28%, black 82%, transparent 100%);
      }
      @media (prefers-reduced-motion: reduce) {
        .hero-letter, .hero-fade {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
    <section
      className="w-full relative overflow-hidden"
      style={{
        height: PANEL_H,
        minHeight: "560px",
        background: "#FEFBF2",
      }}
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
          preload
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[78%_center]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-20 flex flex-col lg:flex-row h-full relative">

        {/* ── LEFT: animated text ── */}
        <div className="w-full lg:w-[46%] xl:w-[44%] flex flex-col justify-center py-10 sm:py-12 lg:py-8 relative z-10 shrink-0">
          <p
            className="hero-fade text-xs font-bold uppercase tracking-[0.18em] text-[#B9822E] mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            India&rsquo;s Leading IPO Advisor &amp; Growth Capital Expert
          </p>

          <AnimatedHeadline />

          <p
            className="hero-fade leading-relaxed mb-7 lg:mb-9"
            style={{
              color: "#475569",
              fontSize: "clamp(0.9rem, 1.15vw, 1.05rem)",
              maxWidth: "460px",
              animationDelay: `${AFTER_HEADLINE}s`,
            }}
          >
            We help ambitious Indian businesses raise the right capital, get
            truly IPO-ready, and list successfully on NSE Emerge, BSE SME, and
            the Main Board.
          </p>

          <div
            className="hero-fade flex flex-col sm:flex-row sm:items-center gap-3"
            style={{ animationDelay: `${AFTER_HEADLINE + 0.15}s` }}
          >
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-lg font-bold text-white hover:opacity-90 active:scale-[.98] transition-all duration-150 cursor-pointer"
              style={{
                background: "#0D4A6F",
                boxShadow: "0 4px 18px rgba(13,74,111,0.28)",
                padding: "clamp(0.6rem, 0.9vw, 0.875rem) clamp(1.4rem, 2vw, 1.9rem)",
                fontSize: "clamp(0.82rem, 1vw, 0.94rem)",
              }}
            >
              Book a Free <br/> IPO Readiness Call
            </Link>
            <Link
              href="/ipo-readiness-tool"
              className="inline-flex items-center justify-center rounded-lg font-bold text-[#0D4A6F] border border-[#0D4A6F]/30 hover:bg-[#0D4A6F]/5 active:scale-[.98] transition-all duration-150 cursor-pointer"
              style={{
                padding: "clamp(0.6rem, 0.9vw, 0.875rem) clamp(1.2rem, 1.8vw, 1.6rem)",
                fontSize: "clamp(0.82rem, 1vw, 0.94rem)",
              }}
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
              sizes="100vw"
              className="object-cover object-[60%_center]"
            />
          </div>
        </div>

      </div>
    </section>
    </>
  );
}
