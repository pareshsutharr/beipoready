import type { Metadata } from "next";
import IssueSizeCalculator from "@/components/tools/IssueSizeCalculator";

export const metadata: Metadata = {
  title: "SME IPO Issue Size Calculator — Free Estimate",
  description:
    "Get an indicative IPO issue size estimate based on your PAT, industry sector, and growth rate. Uses sector P/E benchmarks. Free, instant, no sign-up.",
};

export default function IssueSizeCalculatorPage() {
  return (
    <main>
      <section className="relative bg-brand-navy py-16 sm:py-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=600&fit=crop&q=85" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Free Tool
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            SME IPO Issue Size Calculator
          </h1>
          <p className="font-sans text-base text-white/65 max-w-xl mx-auto leading-relaxed">
            Get an indicative estimate of your company&rsquo;s IPO issue size based
            on sector P/E benchmarks and your profitability. Takes 2 minutes.
          </p>
        </div>
      </section>
      <section className="bg-brand-cream py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <IssueSizeCalculator />
        </div>
      </section>
    </main>
  );
}
