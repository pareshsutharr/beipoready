import type { Metadata } from "next";
import IpoReadinessQuiz from "@/components/tools/IpoReadinessQuiz";

export const metadata: Metadata = {
  title: "IPO Readiness Tool — Free 20-Question Assessment",
  description:
    "Find out if your company is ready for an SME IPO. Answer 20 questions across 5 domains and get a personalised readiness score with recommendations — free, in under 10 minutes.",
};

export default function IpoReadinessToolPage() {
  return (
    <main>
      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Free Tool
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            IPO Readiness Assessment
          </h1>
          <p className="font-sans text-base text-white/65 max-w-xl mx-auto leading-relaxed">
            20 questions across 5 domains. A personalised readiness score.
            Specific recommendations for your company&rsquo;s situation.
            Takes under 10 minutes.
          </p>
        </div>
      </section>
      <section className="bg-brand-cream py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <IpoReadinessQuiz />
        </div>
      </section>
    </main>
  );
}
