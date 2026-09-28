"use client";

import Image from "next/image";
import { startTransition, useEffect, useEffectEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type ServiceHeroSlide = {
  src: string;
  alt: string;
  label: string;
};

const AUTO_ROTATE_MS = 4200;

export default function ServiceHeroSlider({
  slides,
  accentColor,
  darkerColor,
}: {
  slides: ServiceHeroSlide[];
  accentColor: string;
  darkerColor: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const showRandomSlide = useEffectEvent(() => {
    if (slides.length < 2) return;

    setDirection(1);
    startTransition(() => {
      setActiveIndex((current) => {
        let next = Math.floor(Math.random() * slides.length);
        if (next === current) next = (current + 1) % slides.length;
        return next;
      });
    });
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || slides.length < 2) return;

    const timer = window.setInterval(showRandomSlide, AUTO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];

  return (
    <div className="relative h-[260px] w-full overflow-hidden rounded-[2rem] shadow-2xl sm:h-[320px] lg:h-[30vh]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeSlide.src}
          initial={{ opacity: 0, x: direction > 0 ? 36 : -36 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -36 : 36 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide.src}
            alt={activeSlide.alt}
            fill
            priority
            sizes="(min-width: 1024px) 420px, 90vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(180deg, transparent 0%, ${darkerColor}A8 100%)` }}
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute left-5 top-5">
        <span
          className="inline-flex rounded-full px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ background: "#FCD34D", color: darkerColor }}
        >
          {activeSlide.label}
        </span>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 p-2.5"
        style={{ background: `linear-gradient(90deg, ${accentColor} 0%, #FCD34D 100%)` }}
        aria-hidden="true"
      />

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-5 flex gap-2" aria-label="Fund-raising image slides">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => {
                setDirection(index >= activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              aria-label={`Show ${slide.label}`}
              className="h-2.5 rounded-full transition-all"
              style={{
                width: index === activeIndex ? "2rem" : "0.65rem",
                background: index === activeIndex ? "#FFFFFF" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
