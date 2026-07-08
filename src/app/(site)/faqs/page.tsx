import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion from "@/components/sections/FaqAccordion";
import { getPublishedFaqGroups } from "@/lib/cms";
import { HOME_FAQS } from "@/lib/home-faqs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQs — SME IPO Questions Answered",
  description:
    "Answers to the most common questions about SME IPOs — eligibility, process, costs, documentation, and post-listing compliance obligations.",
};

export default async function FAQsPage() {
  const publishedGroups = await getPublishedFaqGroups();
  const faqs = [{ category: "General", items: HOME_FAQS }, ...publishedGroups];

  return (
    <>
      <section className="relative bg-brand-navy py-16 sm:py-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&h=600&fit=crop&q=85" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Knowledge Base
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="font-sans text-base text-white/65 max-w-xl mx-auto leading-relaxed">
            Answers to the most common questions about SME IPOs, the listing
            process, costs, and post-listing obligations.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <FaqAccordion categories={faqs} />
        </div>
      </section>

      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-white mb-3">
            Still have questions?
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Our advisors are happy to answer specific questions about your company&rsquo;s
            situation — at no charge for the first conversation.
          </p>
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-brand-navy font-semibold rounded-lg shadow-md hover:bg-amber-400 transition-colors"
          >
            Talk to an Advisor
          </Link>
        </div>
      </section>
    </>
  );
}
