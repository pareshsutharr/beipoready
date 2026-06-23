"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const LOGOS = [
  "/svgs/ADANIENSOL.NS_BIG.png",
  "/svgs/ADANIGREEN.NS.png",
  "/svgs/AXISBANK.BO.svg",
  "/svgs/BAJFINANCE.NS.svg",
  "/svgs/BEL.NS.svg",
  "/svgs/BHARTIARTL.NS.svg",
  "/svgs/COALINDIA.NS_BIG.svg",
  "/svgs/EICHERMOT.NS.svg",
  "/svgs/HDB.svg",
  "/svgs/HINDUNILVR.NS.svg",
  "/svgs/IBN.svg",
  "/svgs/INDIGO.NS.svg",
  "/svgs/INFY.svg",
  "/svgs/ITC.NS.D.svg",
  "/svgs/JSWSTEEL.NS.svg",
  "/svgs/M&M.NS.svg",
  "/svgs/NTPC.NS.svg",
  "/svgs/ONGC.NS_BIG.svg",
  "/svgs/RELIANCE.NS.svg",
  "/svgs/SBIN.NS.svg",
  "/svgs/SUNPHARMA.NS.svg",
  "/svgs/TCS.NS.svg",
  "/svgs/TITAN.NS.svg",
  "/svgs/VBL.NS_BIG.svg",
  "/svgs/WIT.svg",
];

const TOTAL_COLS = 50;

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const rows = new Array(75).fill(1);
  const cols = new Array(TOTAL_COLS).fill(1);

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="w-32 h-16 border-l border-slate-600 relative"
        >
          {cols.map((_, j) => {
            // Every box gets a deterministic logo from the cycle
            const logo = LOGOS[(i * TOTAL_COLS + j) % LOGOS.length];

            return (
              <motion.div
                key={`col` + j}
                className="group w-32 h-16 border-r border-t border-slate-600 relative"
              >
                {/* Grid cross markers */}
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-10 w-20 -top-[22px] -left-[42px] text-slate-600 stroke-[1px] pointer-events-none"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                ) : null}

                {/* Logo — hidden by default, revealed on hover */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <img
                    src={logo}
                    alt=""
                    aria-hidden="true"
                    className="w-20 h-12 object-contain"
                    style={{  }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
