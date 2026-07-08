import Link from "next/link";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { HOME_FAQS } from "@/lib/home-faqs";

export default function HomeFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section className="w-full py-20 sm:py-28 bg-white" aria-labelledby="faq-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
            Frequently Asked Questions
          </p>
          <h2 id="faq-heading" className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F]">
            Questions founders ask us most
          </h2>
        </div>

        <FaqAccordion categories={[{ category: "", items: HOME_FAQS }]} />

        <p className="text-center text-sm text-slate-500 mt-10">
          Have a different question?{" "}
          <Link href="/faqs" className="font-bold text-brand-gold hover:underline">
            Browse all FAQs
          </Link>{" "}
          or{" "}
          <Link href="/contact-us" className="font-bold text-brand-gold hover:underline">
            talk to us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
