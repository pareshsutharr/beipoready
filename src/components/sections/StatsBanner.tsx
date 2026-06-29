import Image from "next/image";
import { TrendingUp, ShieldCheck, Activity } from "lucide-react";

const STATS = [
  {
    icon: TrendingUp,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    value: "$12B+",
    label: "Capital Raised",
  },
  {
    icon: ShieldCheck,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    value: "100%",
    label: "Governance Rating",
  },
  {
    icon: Activity,
    iconBg: "#0D4A6F",
    iconColor: "#FFFFFF",
    value: "3.2x",
    label: "Efficiency Multiplier",
  },
];

export default function StatsBanner() {
  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ background: "#FEFBF2", minHeight: "60vh" }}
      aria-label="Key metrics"
    >

      {/* Bounded max-width shell — decoratives + content all constrained here */}
      <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 flex flex-col items-center gap-10">

        {/* Opening quote — top left */}
        <Image
                 src="/blueshape-hq.png"
          alt="" aria-hidden="true"
          width={80} height={66}
          className="absolute top-8 left-6 pointer-events-none select-none"
        />

        {/* Blue triangle — upper right */}
        <Image
          src="/blueshape-hq.png"
          alt="" aria-hidden="true"
          width={190} height={100}
          className="absolute top-0 right-6 pointer-events-none select-none"
          // style={{ transform: "scaleX(-1)" }}
        />

        {/* Closing quote — bottom right */}
        <Image
          src="/whitepolo-hq.png"
          alt="" aria-hidden="true"
          width={80} height={66}
          className="absolute bottom-0 right-0 pointer-events-none select-none"
          style={{ transform: "rotate(180deg)" }}
        />

        {/* Orange triangle — bottom left */}
        <Image
          src="/Polygon 73-hq.png"
          alt="" aria-hidden="true"
          width={70} height={60}
          className="absolute bottom-[-50] left-0 pointer-events-none select-none"
          style={{ transform: "scaleX(1)" }}
        />

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center gap-10">

        {/* Heading */}
        <h2
          className="font-serif font-bold leading-snug text-center"
          style={{
            color: "#0D4A6F",
            fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)",
            maxWidth: "560px",
          }}
        >
          India&apos;s leading IPO advisor and growth capital expert
        </h2>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
          {STATS.map(({ icon: Icon, iconBg, iconColor, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-5 bg-white rounded-2xl"
              style={{
                padding: "1.25rem 1.5rem",
                boxShadow: "0 4px 24px rgba(13,74,111,0.09)",
              }}
            >
              <div
                className="shrink-0 flex items-center justify-center rounded-xl"
                style={{ width: 52, height: 52, background: iconBg }}
              >
                <Icon size={24} color={iconColor} strokeWidth={1.8} />
              </div>
              <div>
                <p
                  className="font-sans font-bold leading-none"
                  style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.25rem)", color: "#0D4A6F" }}
                >
                  {value}
                </p>
                <p
                  className="text-slate-500 font-medium mt-1 text-sm"
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>
    </section>
  );
}
