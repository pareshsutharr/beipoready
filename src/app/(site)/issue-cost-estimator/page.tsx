import type { Metadata } from "next";
import IssueCostEstimator from "@/components/tools/IssueCostEstimator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "SME IPO Issue Cost Estimator, Instant Ballpark",
  description:
    "Estimate SME IPO costs instantly, including merchant banker, legal, marketing, market-making, and other listing expenses.",
  path: "/issue-cost-estimator",
  keywords: ["SME IPO cost calculator", "IPO cost of listing India", "merchant banker fees SME IPO"],
});

export default function IssueCostEstimatorPage() {
  return (
    <main>
      <section className="relative bg-brand-navy py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,15,30,0.4)_0%,rgba(15,45,82,0.2)_100%)]" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(circle,#ECB85B_1px,transparent_1px)] bg-[length:32px_32px]"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Online Tool
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            SME IPO Issue Cost Estimator
          </h1>
          <p className="font-sans text-base text-white/65 max-w-xl mx-auto leading-relaxed">
            Understand the cost of going public before you commit. Enter your
            planned issue size for an indicative, itemised cost range.
          </p>
        </div>
      </section>
      <section className="bg-brand-cream py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <IssueCostEstimator />
        </div>
      </section>
    </main>
  );
}
