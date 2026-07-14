import Link from "next/link";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

const ADDRESS =
  "2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan, Surat, Gujarat 395009";

export default function FinalCta() {
  return (
    <section
      className="relative w-full py-20 sm:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0F2D52 0%, #0D4A6F 100%)" }}
      aria-labelledby="final-cta-heading"
    >
      <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg,transparent,#ECB85B,transparent)" }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left, pitch + contact strip */}
        <div>
          <h2 id="final-cta-heading" className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Ready to raise capital or take your company public?
          </h2>
          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            Start with a conversation. Tell us where you are, and we&rsquo;ll show
            you the clearest path forward.
          </p>

          <Link
            href="/ipo-readiness-tool"
            className="group inline-flex items-center gap-2 text-sm font-bold mb-10 transition-colors duration-150 hover:text-white"
            style={{ color: "#ECB85B" }}
          >
            Are You IPO Ready?, Take the Check
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          <address className="not-italic space-y-4 text-sm text-white/70">
            <p className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#ECB85B" }} aria-hidden="true" />
              {ADDRESS}
            </p>
            <a href="mailto:info@beipoready.com" className="flex items-start gap-3 hover:text-white transition-colors duration-150">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#ECB85B" }} aria-hidden="true" />
              info@beipoready.com
            </a>
            <a href="tel:+919537767203" className="flex items-start gap-3 hover:text-white transition-colors duration-150">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#ECB85B" }} aria-hidden="true" />
              +91 95377 67203
            </a>
          </address>
        </div>

        {/* Right, embedded lead-capture form */}
        <div className="rounded-2xl bg-white p-6 sm:p-8" style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
          <LeadCaptureForm
            source="home-cta"
            heading="Book an IPO Readiness Call"
            description="Tell us about your company, an advisor will get back within one business day."
            submitLabel="Book My Call"
          />
        </div>
      </div>
    </section>
  );
}
