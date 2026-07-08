import type { Metadata } from "next";
import GetListedForm from "@/components/forms/GetListedForm";

export const metadata: Metadata = {
  title: "Get Listed — IPO Eligibility Form",
  description:
    "Check your company's eligibility for an SME IPO. Share your incorporation details, financials and fund-raising goals — our advisors will assess your readiness to get listed.",
};

export default function GetListedPage() {
  return (
    <main>
      <section className="relative bg-brand-navy py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.4) 0%,rgba(15,45,82,0.2) 100%)" }} aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          aria-hidden="true"
          style={{ backgroundImage: "radial-gradient(circle, #ECB85B 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Get Listed
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Eligibility for IPO
          </h1>
          <p className="font-sans text-base text-white/65 max-w-xl mx-auto leading-relaxed">
            Share your company&rsquo;s details and our advisors will assess your
            SME IPO eligibility — with an honest read on what&rsquo;s ready and
            what needs work.
          </p>
        </div>
      </section>
      <section className="bg-brand-cream py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <GetListedForm />
        </div>
      </section>
    </main>
  );
}
