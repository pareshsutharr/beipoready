"use client";

import Image from "next/image";
import Link from "next/link";
import BellAnimation from "@/components/ui/BellAnimation";

const FLOAT_CARDS = [
  { top: "11%", left: "3%",  right: "auto", delay: "0s" },
  { top: "13%", left: "auto", right: "1%",  delay: "0.8s" },
  { top: "46%", left: "6%",  right: "auto", delay: "1.6s" },
];

const PANEL_H = "calc(100vh - 64px)";

export default function Hero() {
  return (
    <>
    <style>{`
      @keyframes floatCard {
        0%, 100% { transform: translateY(0px); }
        50%       { transform: translateY(-10px); }
      }
    `}</style>
    <section
      className="w-full relative overflow-hidden"
      style={{
        height: PANEL_H,
        minHeight: "560px",
        background: "linear-gradient(180deg, #ECB85B 0%, #FEFBF2 38%)",
      }}
      aria-label="Hero"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-20 flex flex-col lg:flex-row h-full"
      >

        {/* ── LEFT: text ── */}
        <div className="w-full lg:w-[50%] xl:w-[46%] flex flex-col justify-center py-10 sm:py-12 lg:py-0 relative z-10 shrink-0">
          <h1
            className="font-serif font-bold leading-tight tracking-tight mb-4 lg:mb-5"
            style={{
              fontSize: "clamp(1.65rem, 2.8vw, 3.2rem)",
              color: "#0D4A6F",
            }}
          >
            Your Architectural<br />
            Path to the Public Markets.
          </h1>

          <p
            className="leading-relaxed mb-7 lg:mb-9"
            style={{
              color: "#ECB85B",
              fontSize: "clamp(0.875rem, 1.15vw, 1.05rem)",
              maxWidth: "440px",
            }}
          >
            As an expert IPO consultant, we handhold companies through every
            stage of their journey from pre-IPO readiness and fund raising to
            IPO execution and post-listing support.
          </p>

          <div>
            <Link
              href="/ipo-readiness-tool"
              className="inline-flex items-center justify-center rounded-lg font-bold text-white hover:opacity-90 active:scale-[.98] transition-all duration-150 cursor-pointer"
              style={{
                background: "#0D4A6F",
                boxShadow: "0 4px 18px rgba(13,74,111,0.28)",
                padding: "clamp(0.6rem, 0.9vw, 0.875rem) clamp(1.6rem, 2.5vw, 2.25rem)",
                fontSize: "clamp(0.82rem, 1vw, 0.94rem)",
              }}
            >
              Start
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Bell + Persons + cards (lg+) ── */}
        <div
          className="hidden lg:block flex-1 relative"
          style={{ height: PANEL_H, minHeight: "560px" }}
        >
          {/* Floating stat cards */}
          {FLOAT_CARDS.map((pos, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-xl z-20"
              style={{
                top: pos.top,
                left: pos.left,
                right: pos.right,
                padding: "clamp(0.45rem, 0.6vh, 0.75rem) clamp(0.7rem, 1vw, 1.25rem)",
                boxShadow: "0 4px 22px rgba(13,74,111,0.12)",
                animation: `floatCard 3s ease-in-out infinite`,
                animationDelay: pos.delay,
              }}
            >
              <p
                className="font-bold text-[#0D4A6F] leading-tight"
                style={{ fontSize: "clamp(0.85rem, 1.4vh, 1.2rem)" }}
              >
                $12B+
              </p>
              <p
                className="text-slate-500 font-medium mt-0.5"
                style={{ fontSize: "clamp(0.6rem, 0.9vh, 0.72rem)" }}
              >
                Capital Raised
              </p>
            </div>
          ))}

          {/* Bell – animated, top 56% of panel height */}
          <BellAnimation
            className="absolute left-0 right-0"
            style={{ top: "-9.4%", height: "56%" }}
          />

          {/* Persons – bottom 52% of panel height, centered */}
          <div
            className="absolute left-0 right-0 flex justify-center bottom-0"
            style={{ height: "52%" }}
          >
            <Image
              src="/persons-hq.png"
              alt="Business professionals looking up at IPO bell"
              width={1929}
              height={1092}
              className="h-full w-auto object-contain"
              style={{ maxWidth: "640px" }}
            />
          </div>
        </div>

        {/* ── Mobile / Tablet stacked ── */}
        <div className="lg:hidden w-full flex flex-col items-center justify-center pb-6 gap-0">
          <Image
            src="/bellimage.png"
            alt="IPO Bell"
            width={300}
            height={300}
            className="w-40 sm:w-52 h-auto object-contain"
          />
          <Image
            src="/persons-hq.png"
            alt="Business professionals"
            width={1929}
            height={1092}
            className="w-64 sm:w-80 h-auto object-contain -mt-4"
          />
        </div>

      </div>
    </section>
    </>
  );
}
