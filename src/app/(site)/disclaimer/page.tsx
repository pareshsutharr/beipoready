import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Regulatory and investment disclaimers for Be IPO Ready — a SEBI-registered merchant banking advisory firm.",
};

export default function DisclaimerPage() {
  return (
    <main className="bg-brand-cream py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-2">Disclaimer</h1>
        <p className="font-sans text-sm text-slate-400 mb-10">Last updated: June 2026</p>

        <div className="font-sans text-slate-700 leading-relaxed space-y-8">

          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h2 className="font-serif text-lg font-bold text-amber-800 mb-2">Important Notice</h2>
            <p className="text-sm text-amber-700">
              This website and all information contained herein is for informational purposes only and
              does not constitute an offer to buy or sell any security, or a solicitation of any investment.
              Past performance is not indicative of future results.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">SEBI Registration</h2>
            <p>
              Be IPO Ready / Jainam Capital Advisors is registered with the Securities and Exchange Board
              of India (SEBI) as a Category I Merchant Banker. Our SEBI registration does not constitute
              an endorsement or recommendation of any specific investment by SEBI, nor does it guarantee
              the accuracy of information presented on this website.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">No Investment Advice</h2>
            <p>
              Nothing on this website — including the IPO Readiness Tool, Issue Size Calculator, blog
              articles, case studies, and any other content — constitutes financial, investment, tax,
              or legal advice. The information is general in nature and may not apply to your specific
              circumstances. You should consult with your own professional advisors before making any
              financial or investment decision.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">Tool Outputs are Indicative Only</h2>
            <p>
              The IPO Readiness Tool and Issue Size Calculator are designed to provide indicative
              assessments based on the information you input. They are not formal valuations, audits,
              or regulatory assessments. Results should not be relied upon as the sole basis for any
              business or investment decision.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">Forward-Looking Statements</h2>
            <p>
              Certain information on this website may contain forward-looking statements involving
              risks and uncertainties. Actual results, performance, or events may differ materially
              from those expressed or implied by such statements. We do not undertake any obligation
              to update or revise any forward-looking statements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">Accuracy of Information</h2>
            <p>
              While we make every effort to ensure the accuracy and currency of information on this
              website, we make no representations or warranties of any kind, express or implied, about
              the completeness, accuracy, reliability, suitability, or availability of the information.
              Any reliance you place on such information is therefore strictly at your own risk.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">SEBI Investor Grievance Redressal</h2>
            <p>
              For SEBI-related grievances, investors may contact SEBI at sebi.gov.in or call SEBI
              toll-free at 1800 22 7575 / 1800 266 7575. You may also submit grievances on SCORES
              (SEBI Complaints Redress System) at scores.sebi.gov.in.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-3">Contact</h2>
            <p>
              For any questions or concerns regarding this Disclaimer, please contact us at
              info@beipoready.com.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
