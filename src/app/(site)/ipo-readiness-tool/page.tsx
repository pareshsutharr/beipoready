import type { Metadata } from "next";
import Image from "next/image";
import IpoReadinessQuiz from "@/components/tools/IpoReadinessQuiz";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "IPO Readiness Tool, 20-Question Assessment",
  description:
    "Answer 20 questions across five domains and get an SME IPO readiness score with practical recommendations in under 10 minutes.",
  path: "/ipo-readiness-tool",
  keywords: ["IPO readiness assessment", "SME IPO readiness score", "am I ready for IPO"],
});

export default function IpoReadinessToolPage() {
  return (
    <main>
      <section className="relative bg-brand-navy py-16 sm:py-20 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=600&fit=crop&q=85"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,15,30,0.65)_0%,rgba(15,45,82,0.55)_100%)]" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Online Tool
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
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
