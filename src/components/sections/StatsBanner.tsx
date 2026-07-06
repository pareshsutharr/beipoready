import { TrendingUp, Building2, Landmark, Clock } from "lucide-react";
import type { SiteStat } from "@/types";

const ICONS = [TrendingUp, Building2, Landmark, Clock];

export default function StatsBanner({
  stats,
}: {
  stats: Pick<SiteStat, "label" | "value">[];
}) {
  if (!stats.length) return null;

  return (
    <section
      className="relative w-full"
      style={{ background: "#FEFBF2" }}
      aria-label="Key metrics"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16 -mt-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.slice(0, 4).map(({ value, label }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={label}
                className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4"
                style={{ boxShadow: "0 4px 24px rgba(13,74,111,0.09)" }}
              >
                <div
                  className="shrink-0 hidden sm:flex items-center justify-center rounded-xl"
                  style={{ width: 46, height: 46, background: "#FEF3C7" }}
                >
                  <Icon size={22} color="#D97706" strokeWidth={1.8} />
                </div>
                <div>
                  <p
                    className="font-sans font-bold leading-none"
                    style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.9rem)", color: "#0D4A6F" }}
                  >
                    {value}
                  </p>
                  <p className="text-slate-500 font-medium mt-1.5 text-xs sm:text-sm leading-snug">
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
