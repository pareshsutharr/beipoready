"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function BellAnimation({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const bellRef  = useRef<HTMLDivElement>(null);
  const sparkRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let swingTl: any;
    let interval: ReturnType<typeof setInterval>;

    import("gsap").then(({ gsap }) => {
      const bell = bellRef.current;
      if (!bell) return;

      // Swing, pivots from top like a real bell
      swingTl = gsap.timeline({ repeat: -1 });
      swingTl
        .to(bell, { rotation: 18,  duration: 0.5, ease: "sine.inOut" })
        .to(bell, { rotation: -18, duration: 1.0, ease: "sine.inOut" })
        .to(bell, { rotation: 14,  duration: 0.9, ease: "sine.inOut" })
        .to(bell, { rotation: -14, duration: 0.9, ease: "sine.inOut" })
        .to(bell, { rotation: 10,  duration: 0.8, ease: "sine.inOut" })
        .to(bell, { rotation: -10, duration: 0.8, ease: "sine.inOut" })
        .to(bell, { rotation: 6,   duration: 0.7, ease: "sine.inOut" })
        .to(bell, { rotation: -6,  duration: 0.7, ease: "sine.inOut" })
        .to(bell, { rotation: 0,   duration: 0.5, ease: "sine.inOut" })
        .to(bell, { rotation: 0,   duration: 1.2 }); // rest pause

      function burstSparks() {
        sparkRefs.current.forEach((s, i) => {
          if (!s) return;
          const angle = (i / 6) * 360;
          const rad   = (angle * Math.PI) / 180;
          const dist  = 55 + Math.random() * 45;
          gsap.fromTo(
            s,
            { x: 0, y: 0, opacity: 1, scale: 1 },
            {
              x: Math.cos(rad) * dist,
              y: Math.sin(rad) * dist,
              opacity: 0,
              scale: 0.2,
              duration: 0.65 + Math.random() * 0.35,
              ease: "power2.out",
              delay: i * 0.05,
            }
          );
        });
      }

      // First burst at start of first swing, then every full cycle
      gsap.delayedCall(0.5, burstSparks);
      interval = setInterval(burstSparks, 7100);
    });

    return () => {
      clearInterval(interval);
      swingTl?.kill();
    };
  }, []);

  return (
    <div className={`relative ${className ?? ""}`} style={style}>
      {/* Bell, transform-origin: center top so it pivots at the chain */}
      <div
        ref={bellRef}
        className="w-full h-full flex justify-center items-start"
        style={{ transformOrigin: "center top" }}
      >
        <Image
          src="/bellimage.png"
          alt="IPO Bell"
          width={520}
          height={520}
          className="h-full w-auto object-contain"
          style={{
            maxWidth: "500px",
            filter: "drop-shadow(0 18px 36px rgba(236,184,91,0.38))",
          }}
          priority
        />
      </div>

      {/* Spark particles, centered at bell body */}
      <div
        className="absolute pointer-events-none"
        style={{ top: "55%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={(el) => { sparkRefs.current[i] = el; }}
            className="absolute rounded-full opacity-0"
            style={{ width: 8, height: 8, background: "#ECB85B", top: 0, left: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
