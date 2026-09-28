"use client";

import { useEffect, useRef, useState } from "react";
import { TrendingUp, Building2, Landmark, Clock } from "lucide-react";
import type { SiteStat } from "@/types";

const ICONS = [TrendingUp, Building2, Landmark, Clock];
const CARD_DELAYS = ["stats-delay-1", "stats-delay-2", "stats-delay-3", "stats-delay-4"];

function parseAnimatedValue(value: string) {
  const match = value.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return null;
  }

  const [, prefix, numericPart, suffix] = match;
  const decimals = numericPart.includes(".") ? numericPart.split(".")[1].length : 0;

  return {
    prefix,
    suffix,
    target: Number(numericPart),
    decimals,
  };
}

function formatAnimatedValue(value: string, progress: number) {
  const parsed = parseAnimatedValue(value);
  if (!parsed) {
    return value;
  }

  const currentValue = parsed.target * progress;
  const roundedValue =
    parsed.decimals > 0
      ? currentValue.toFixed(parsed.decimals)
      : Math.round(currentValue).toString();

  return `${parsed.prefix}${roundedValue}${parsed.suffix}`;
}

export default function StatsBanner({
  stats,
}: {
  stats: Pick<SiteStat, "label" | "value">[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sectionNode = sectionRef.current;
    if (!sectionNode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setHasEnteredView(true);
        observer.disconnect();
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(sectionNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const frameId = window.requestAnimationFrame(() => setProgress(1));
      return () => window.cancelAnimationFrame(frameId);
    }

    const durationMs = 1400;
    const start = window.performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const rawProgress = Math.min(elapsed / durationMs, 1);
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

      setProgress(easedProgress);

      if (rawProgress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [hasEnteredView]);

  if (!stats.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative w-full border-t border-t-[#F2EBDD] bg-white"
      aria-label="Key metrics"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {stats.slice(0, 4).map(({ value, label }, i) => {
            const Icon = ICONS[i % ICONS.length];
            const delayClass = CARD_DELAYS[i] ?? CARD_DELAYS[CARD_DELAYS.length - 1];

            return (
              <div
                key={label}
                className={`stats-card-in flex w-full max-w-[256px] items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-[0_4px_24px_rgba(13,74,111,0.07)] sm:w-[256px] sm:px-7 sm:py-7 ${
                  hasEnteredView ? `stats-card-visible ${delayClass}` : ""
                }`}
              >
                <div className="hidden h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-[#FEF3C7] sm:flex">
                  <Icon size={22} color="#D97706" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="font-sans text-[clamp(1.25rem,2.2vw,1.9rem)] font-bold leading-none text-[#0D4A6F]">
                    {formatAnimatedValue(value, progress)}
                  </p>
                  <p className="mt-1.5 text-xs font-medium leading-snug text-slate-500 sm:text-sm">
                    {label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
