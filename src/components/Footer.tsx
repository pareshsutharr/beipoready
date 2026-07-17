"use client";

import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/forms/NewsletterForm";

const serviceLinks = [
  { label: "Fund Raising", href: "/services/fund-raising" },
  { label: "Pre-IPO Advisory", href: "/services/pre-ipo-advisory" },
  { label: "SME IPO Advisory", href: "/services/sme-ipo-advisory" },
  { label: "Valuation & Corporate Restructuring", href: "/services/valuation-corporate-restructuring" },
];

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Knowledge Center", href: "/knowledge-center" },
  { label: "FAQs", href: "/faqs" },
  { label: "IPO Readiness Tool", href: "/ipo-readiness-tool" },
  { label: "Issue Size Calculator", href: "/issue-size-calculator" },
  { label: "Issue Cost Estimator", href: "/issue-cost-estimator" },
  { label: "SME IPO Listing Checklist", href: "/sme-ipo-checklist" },
  { label: "Get Listed: Eligibility Form", href: "/get-listed" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg> },
  { label: "Twitter / X", href: "#", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
  { label: "Instagram", href: "#", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg> },
];

export default function Footer() {
  return (
    <footer className="relative text-white overflow-hidden" style={{ background: "linear-gradient(180deg,#0F2D52 0%,#070F1E 100%)" }}>
      {/* Top gold line */}
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,#F59E0B,transparent)" }} aria-hidden="true" />
      {/* Background glow */}
      {/* testing */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)" }} aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="ft-col lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-5">
            <Image src="/logo-transparent.png" alt="Be IPO Ready" width={2017} height={484} className="h-10 w-auto object-contain brightness-110" />
          </Link>
          <p className="text-white/55 text-sm leading-relaxed mb-6">
            Value creation before IPO, wealth creation post listing.
          </p>
          <div className="flex flex-wrap gap-2">
            {["NSE Emerge", "BSE SME"].map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white/80" style={{ border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.06)" }}>
                <svg className="w-3.5 h-3.5 text-brand-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="ft-col">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-5">Our Services</h3>
          <ul className="space-y-2.5">
            {serviceLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-white/60 hover:text-brand-gold text-sm transition-colors duration-200">{l.label}</Link></li>)}
          </ul>
        </div>

        {/* Quick links */}
        <div className="ft-col">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-5">Quick Links</h3>
          <ul className="space-y-2.5">
            {quickLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-white/60 hover:text-brand-gold text-sm transition-colors duration-200">{l.label}</Link></li>)}
          </ul>
        </div>

        {/* Contact */}
        <div className="ft-col">
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-5">Get in Touch</h3>
          <address className="not-italic text-sm text-white/60 space-y-3 mb-6">
            <a href="mailto:info@beipoready.com" className="flex items-start gap-2.5 hover:text-brand-gold transition-colors duration-200">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              info@beipoready.com
            </a>
            <a href="tel:+919537767203" className="flex items-start gap-2.5 hover:text-brand-gold transition-colors duration-200">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +91 95377 67203
            </a>
            <p className="flex items-start gap-2.5">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-brand-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan, Surat, Gujarat 395009
            </p>
          </address>

          <div className="flex gap-2 mb-6">
            {socialLinks.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-brand-gold transition-all duration-200 cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.12)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(245,158,11,0.5)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,158,11,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <Link href="/contact-us"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl font-bold text-brand-navy-dark text-sm cursor-pointer hover:opacity-90 transition-opacity mb-6"
            style={{ background: "linear-gradient(135deg,#F59E0B,#FCD34D)", boxShadow: "0 0 20px rgba(245,158,11,0.3)" }}
          >
            Book an IPO Readiness Call
          </Link>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-white/40 mb-3">Newsletter</h3>
            <NewsletterForm />
          </div>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">© {new Date().getFullYear()} Be IPO Ready / Jainam Capital Advisors. All rights reserved.</p>
          <nav aria-label="Legal links">
            <ul className="flex items-center gap-5" role="list">
              {legalLinks.map((l) => <li key={l.href}><Link href={l.href} className="text-white/35 hover:text-white/70 text-xs transition-colors duration-200">{l.label}</Link></li>)}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
