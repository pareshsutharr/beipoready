import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock } from "lucide-react";
import NewsletterForm from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Webinars & Events",
  description:
    "Live sessions, panel discussions, and upcoming events on SME IPO readiness, SEBI compliance, and going public, hosted by Be IPO Ready advisors.",
};

export default function WebinarsEventsPage() {
  return (
    <>
      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=700&fit=crop&q=85" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Live &amp; On-Demand
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Webinars &amp; Events
          </h1>
          <p className="font-sans text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
            Live sessions and panel discussions on SME IPO readiness, SEBI
            compliance, and capital markets, hosted by advisors who work on
            listings every day.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-navy shadow-sm mb-6">
            <CalendarClock className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-4">
            No upcoming sessions right now
          </h2>
          <p className="font-sans text-base text-slate-600 leading-relaxed mb-8">
            We&rsquo;re lining up our next round of webinars on IPO readiness
            and SEBI compliance. Subscribe and we&rsquo;ll email you as soon as
            dates are confirmed.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
          <p className="font-sans text-xs text-slate-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <section className="bg-brand-navy py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">
            Can&rsquo;t wait for the next session?
          </h2>
          <p className="font-sans text-base text-white/65 mb-8 leading-relaxed">
            Talk to an advisor now and get a head start on your IPO readiness.
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
