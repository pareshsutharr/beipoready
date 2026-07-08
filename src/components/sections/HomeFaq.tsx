import Link from "next/link";
import FaqAccordion from "@/components/sections/FaqAccordion";

// On-page copy for the home FAQ block. Q8's answer needs BEIPOREADY's real
// regulatory standing before launch — placeholder kept in brackets.
const HOME_FAQS: { q: string; a: string }[] = [
  {
    q: "What does an IPO advisor do?",
    a: "Guides you end-to-end — eligibility, readiness, issue structuring, intermediary coordination, documentation and listing — on your side of the table throughout.",
  },
  {
    q: "How do I know if my company is IPO-ready?",
    a: "Readiness is about capital efficiency, financial and governance strength, and systems that withstand public scrutiny — not just revenue. Start with our free \"Are You IPO Ready?\" check, then we give you an honest assessment and roadmap.",
  },
  {
    q: "What's the difference between an SME IPO (NSE Emerge / BSE SME) and a Main Board IPO?",
    a: "SME platforms have lighter eligibility thresholds and suit smaller, growing companies; the Main Board has higher thresholds and broader participation. We advise on both and help you choose.",
  },
  {
    q: "We just need capital — do we have to go public?",
    a: "No. We raise growth capital through equity or debt from the right investors, and pursue a listing only when it's right for you.",
  },
  {
    q: "When should we start preparing for an IPO?",
    a: "Earlier than most founders think — the value that makes an IPO succeed is built over months and years.",
  },
  {
    q: "How long does the IPO process take?",
    a: "It depends on your starting point; readiness is usually the longest phase. We give a realistic timeline after the assessment.",
  },
  {
    q: "What does it cost to go public?",
    a: "It varies with issue size and intermediaries. Our issue cost estimator gives an early ballpark; we detail it during planning.",
  },
  {
    q: "Are you SEBI-registered / who do you work with?",
    a: "[State BEIPOREADY's regulatory standing and the SEBI-registered intermediaries coordinated with.]",
  },
  {
    q: "Where are you based and do you work across India?",
    a: "Based in Surat, Gujarat; we work with businesses across India. Initial conversations happen over a call.",
  },
];

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
