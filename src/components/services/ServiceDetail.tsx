import { CheckCircle2, Clock } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import FaqAccordion from "@/components/sections/FaqAccordion";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import type { ClientLogoCard } from "@/lib/cms";

export type ServiceStage = {
  stage: string;
  timeframe: string;
  items: string[];
  deliverables: string[];
};

export type ServiceApproachItem = { title: string; text: string };
export type ServiceFaq = { q: string; a: string };

export type ServiceData = {
  slug: string;
  title: string;
  tagline: string;
  overview: string[];
  whoItsFor: string[];
  process: ServiceStage[];
  timeline: string;
  approach: ServiceApproachItem[];
  faq: ServiceFaq[];
};

export default function ServiceDetail({
  service,
  clients,
}: {
  service: ServiceData;
  clients: ClientLogoCard[];
}) {
  return (
    <>
      {/* ── Overview + Who It's For ──────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-10">
            {service.overview.map((p, i) => (
              <p key={i} className="font-sans text-sm sm:text-base text-slate-700 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-6">Who It&rsquo;s For</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.whoItsFor.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 font-sans text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3.5"
              >
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process & Deliverables ───────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-10 text-center">
            Process &amp; Deliverables
          </h2>

          <ol className="relative">
            {service.process.map((stage, i) => (
              <li key={stage.stage} className="relative pl-14 pb-10 last:pb-0">
                {i < service.process.length - 1 && (
                  <span
                    className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <span className="absolute left-0 top-0 w-10 h-10 flex items-center justify-center rounded-full bg-brand-navy text-white font-heading font-bold text-sm">
                  {i + 1}
                </span>

                <div className="bg-brand-cream border border-slate-200 rounded-xl p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="font-heading text-lg font-bold text-brand-navy">
                      Stage {i + 1}, {stage.stage}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy/8 text-brand-navy text-xs font-semibold px-3 py-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {stage.timeframe}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {stage.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 font-sans text-sm text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0 mt-2" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2">
                    {stage.deliverables.map((d) => (
                      <span
                        key={d}
                        className="text-xs font-semibold text-brand-navy rounded-full px-3 py-1.5 bg-amber-100"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex items-start gap-3 bg-brand-navy/5 border-l-4 border-brand-gold rounded-r-lg p-5">
            <Clock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-heading text-sm font-bold text-brand-navy mb-1">Timelines</h3>
              <p className="font-sans text-sm text-slate-600 leading-relaxed">{service.timeline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Approach ──────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-10 text-center">
            Our Approach
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {service.approach.map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-heading text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-5 rounded-full bg-brand-gold shrink-0" aria-hidden="true" />
                  {item.title}
                </h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">
              Frequently Asked Questions
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#0D4A6F]">
              Common Questions
            </h2>
          </div>
          <FaqAccordion categories={[{ category: "", items: service.faq }]} />
        </div>
      </section>

      {/* ── Clients ──────────────────────────────────────────────────── */}
      <ClientsMarquee clients={clients} />

      {/* ── Enquire ──────────────────────────────────────────────────── */}
      <section
        className="relative py-16 sm:py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F2D52 0%, #0D4A6F 100%)" }}
      >
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#ECB85B,transparent)" }} aria-hidden="true" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 sm:p-8" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
            <LeadCaptureForm
              source="services"
              heading="Enquire About This Service"
              description="Tell us a bit about your company and we will follow up within one business day."
              submitLabel="Send Enquiry"
            />
          </div>
        </div>
      </section>
    </>
  );
}
