import Link from "next/link";
import { Banknote, ClipboardCheck, LineChart, ArrowRight, ArrowUpRight } from "lucide-react";

const PILLARS = [
  {
    icon: Banknote,
    title: "Fundraising & Growth Capital",
    text: "Raise the right capital, on the right terms, from the right investors.",
    href: "/services/pre-ipo-fundraising",
  },
  {
    icon: ClipboardCheck,
    title: "Pre-IPO Advisory",
    text: "Get truly IPO-ready before you file: financials, governance, capital efficiency.",
    href: "/services/ipo-readiness-assessment",
  },
  {
    icon: LineChart,
    title: "IPO Advisory",
    text: "Go public with confidence, end-to-end, on SME or Main Board.",
    href: "/services/sme-ipo-advisory",
  },
];

export default function WhatWeDo() {
  return (
    <section className="w-full py-20 sm:py-28 bg-white" aria-labelledby="what-we-do-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">What We Do</p>
          <h2 id="what-we-do-heading" className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F] mb-5">
            One partner across your entire capital journey
          </h2>
          <p className="text-base sm:text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed">
            Most businesses don&rsquo;t fail at going public because of a weak idea — they
            fail because they weren&rsquo;t prepared. BEIPOREADY is a specialist
            capital-markets advisory firm that partners with promoters and management
            teams across three connected stages: raising growth capital, becoming
            IPO-ready, and executing a successful listing. We don&rsquo;t just advise on
            the transaction — we build the value that makes it succeed.
          </p>
        </div>

        {/* Journey flow: Fundraising → Pre-IPO → IPO */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-5 mb-12 flex-wrap"
          aria-label="Capital journey: Fundraising to Pre-IPO to IPO"
        >
          {["Fundraising", "Pre-IPO", "IPO"].map((stage, i) => (
            <div key={stage} className="flex items-center gap-3 sm:gap-5">
              {i > 0 && <ArrowRight className="w-5 h-5 text-brand-gold" aria-hidden="true" />}
              <span
                className="inline-flex items-center rounded-full px-5 py-2 text-sm font-bold"
                style={{
                  color: "#0D4A6F",
                  background: "#FEF3C7",
                  border: "1px solid rgba(217,119,6,0.25)",
                }}
              >
                {stage}
              </span>
            </div>
          ))}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" role="list">
          {PILLARS.map(({ icon: Icon, title, text, href }) => (
            <li key={title} className="flex">
              <Link
                href={href}
                className="group flex flex-col w-full rounded-2xl bg-white p-7 border border-slate-200 hover:border-brand-gold/50 transition-colors duration-200 cursor-pointer"
                style={{ boxShadow: "0 2px 12px rgba(13,74,111,0.05)" }}
              >
                <div
                  className="mb-5 w-12 h-12 flex items-center justify-center rounded-xl"
                  style={{ background: "rgba(13,74,111,0.07)" }}
                >
                  <Icon className="w-6 h-6 text-[#0D4A6F]" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-[#0D4A6F] mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{text}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-gold">
                  Learn More
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-center font-heading text-lg sm:text-xl italic text-[#0D4A6F]">
          Value creation before IPO, wealth creation post listing.
        </p>
      </div>
    </section>
  );
}
