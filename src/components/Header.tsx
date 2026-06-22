"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const serviceLinks = [
  { label: "SME IPO Advisory", href: "/services/sme-ipo-advisory" },
  { label: "IPO Readiness Assessment", href: "/services/ipo-readiness-assessment" },
  { label: "Pre-IPO Fundraising", href: "/services/pre-ipo-fundraising" },
  { label: "IPO Documentation & Compliance", href: "/services/ipo-documentation-compliance" },
  { label: "Valuation & Capital Structuring", href: "/services/valuation-capital-structuring" },
];

const toolLinks = [
  { label: "IPO Readiness Tool", href: "/ipo-readiness-tool" },
  { label: "Issue Size Calculator", href: "/issue-size-calculator" },
];

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

const navLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services", children: serviceLinks },
  { label: "Free Tools", href: "#", children: toolLinks },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Knowledge", href: "/knowledge-center" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <header className="sticky top-0 z-50 text-white shadow-md" style={{ background: "#0F2D52", borderBottom: "3px solid #F59E0B" }}>

      {/* ── Top ribbon ── */}
      <div className="hidden sm:block border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-9">
          <p className="text-white/60 text-xs tracking-wide whitespace-nowrap">
            Trusted SME IPO Advisors · SEBI Registered · ICAI Member
          </p>
          <div className="flex items-center gap-5 ml-auto">
            <a href="tel:+91XXXXXXXXXX" className="flex items-center gap-1.5 text-white/75 hover:text-white text-xs transition-colors duration-150 whitespace-nowrap">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 XXXXX XXXXX
            </a>
            <a href="mailto:info@beipoready.com" className="flex items-center gap-1.5 text-white/75 hover:text-white text-xs transition-colors duration-150 whitespace-nowrap">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@beipoready.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav ref={navRef} aria-label="Main navigation" className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-1">

        {/* Logo */}
        <Link href="/" className="shrink-0 mr-4">
          <Image src="/logo-transparent.png" alt="Be IPO Ready" width={1050} height={275} priority className="h-9 w-auto object-contain" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0 text-[13px] font-medium flex-1" role="list">
          {navLinks.map((link) =>
            link.children ? (
              <li key={link.label} className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={openDropdown === link.label}
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  className="flex items-center gap-1 px-2.5 py-2 rounded whitespace-nowrap text-white/85 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer"
                >
                  {link.label}
                  <svg
                    className={`w-3 h-3 shrink-0 transition-transform duration-200 ${openDropdown === link.label ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 min-w-[220px]">
                    <div className="h-0.5 mb-1" style={{ background: "linear-gradient(90deg,#0F2D52,#F59E0B)" }} aria-hidden="true" />
                    {link.href !== "#" && (
                      <Link
                        href={link.href}
                        className="block px-4 py-2.5 text-[13px] font-bold text-[#0F2D52] border-b border-slate-100 hover:bg-blue-50 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        All {link.label} →
                      </Link>
                    )}
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-[13px] text-slate-700 hover:bg-blue-50 hover:text-[#0F2D52] transition-colors whitespace-nowrap"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block px-2.5 py-2 rounded whitespace-nowrap text-white/85 hover:text-white hover:bg-white/10 transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* CTA button */}
        <Link
          href="/contact-us"
          className="hidden lg:inline-flex items-center ml-3 px-4 py-2 rounded font-bold whitespace-nowrap text-[13px] hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
          style={{ background: "#F59E0B", color: "#0F2D52", boxShadow: "0 0 14px rgba(245,158,11,0.35)" }}
        >
          Book a Free Call
        </Link>

        {/* Mobile burger */}
        <button
          className="lg:hidden ml-auto p-2 rounded text-white hover:bg-white/10 transition-colors cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        className="lg:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? "90vh" : "0",
          background: "#0a2240",
          borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
          overflowY: "auto",
        }}
      >
        <ul className="max-w-7xl mx-auto px-4 py-3 space-y-0.5" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.children ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-3 py-3 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium cursor-pointer"
                    onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                    aria-expanded={mobileExpanded === link.label}
                  >
                    {link.label}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileExpanded === link.label && (
                    <ul className="mt-1 ml-3 pl-3 border-l-2 border-yellow-400/40 space-y-0.5">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-3 py-2.5 text-sm text-white/65 hover:text-white transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className="block px-3 py-3 rounded text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="px-4 pb-5 pt-2">
          <Link
            href="/contact-us"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-full px-6 py-3.5 rounded font-bold text-[#0F2D52] text-sm cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: "#F59E0B" }}
          >
            Book a Free Call
          </Link>
        </div>
      </div>
    </header>
  );
}
