import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import { getPublishedClients } from "@/lib/cms";

const CONTACT_EMAIL = "info@beipoready.com";
const CONTACT_PHONE_DISPLAY = "+91 95377 67203";
const CONTACT_PHONE_HREF = "+919537767203";
const CONTACT_ADDRESS =
  "2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan, Surat, Gujarat 395009";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Speak with a Be IPO Ready advisor about SME IPO advisory, pre-IPO fundraising, or IPO readiness. Book a consultation today.",
};

export const dynamic = "force-dynamic";

export default async function ContactUsPage() {
  const clients = await getPublishedClients();

  return (
    <>
      {/* ── Page hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-brand-navy py-16 sm:py-20 overflow-hidden">
        <img src="/heroaboutimg.png" alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover object-top opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-3">
            Get in Touch
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Talk to an IPO Advisory Expert
          </h1>
          <p className="font-sans text-base sm:text-lg text-white/65 max-w-xl mx-auto leading-relaxed">
            Whether you are three months or three years from listing, we can
            tell you exactly where you stand and what to do next — at no cost
            for the first conversation.
          </p>
        </div>
      </section>

      {/* ── Content: info + form ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Left: contact details */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h2 className="font-heading text-xl font-bold text-brand-navy mb-4">
                  Contact Details
                </h2>
                <ul className="space-y-4 font-sans text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand-gold transition-colors">
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${CONTACT_PHONE_HREF}`} className="hover:text-brand-gold transition-colors">
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{CONTACT_ADDRESS}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-xl font-bold text-brand-navy mb-4">
                  Office Hours
                </h2>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">
                  Monday – Friday: 10:00 AM – 6:00 PM IST<br />
                  Saturday: 10:00 AM – 6:00 PM IST<br />
                  Sunday: Closed
                </p>
              </div>

              {/* Office photo */}
              <div className="relative rounded-xl overflow-hidden h-40 shadow-sm">
                <img src="/heroaboutimg.png" alt="Be IPO Ready office" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(15,45,82,0.6))" }} aria-hidden="true" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold text-white/90">Surat office</span>
              </div>

            </div>

            {/* Right: form */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="font-heading text-xl font-bold text-brand-navy mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      <ClientsMarquee clients={clients} />
    </>
  );
}
