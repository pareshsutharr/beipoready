"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  TrendingUp,
  LineChart,
  Scale,
  ClipboardCheck,
  Calculator,
  ReceiptText,
  ListChecks,
  FileCheck2,
  NotebookPen,
  FileSearch2,
  MonitorPlay,
  Clapperboard,
  type LucideIcon,
} from "lucide-react";

const serviceLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Fund Raising", href: "/services/fund-raising", icon: Banknote },
  { label: "Pre-IPO Advisory", href: "/services/pre-ipo-advisory", icon: TrendingUp },
  { label: "SME IPO Advisory", href: "/services/sme-ipo-advisory", icon: LineChart },
  { label: "Valuation & Corporate Restructuring", href: "/services/valuation-corporate-restructuring", icon: Scale },
];

const toolLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "IPO Readiness Tool", href: "/ipo-readiness-tool", icon: ClipboardCheck },
  { label: "Issue Size Calculator", href: "/issue-size-calculator", icon: Calculator },
  { label: "Issue Cost Estimator", href: "/issue-cost-estimator", icon: ReceiptText },
  // { label: "SME IPO Listing Checklist", href: "/sme-ipo-checklist", icon: ListChecks },
  { label: "Get Listed: Eligibility Form", href: "/get-listed", icon: FileCheck2 },
];

const knowledgeLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Regulatory Updates", href: "/knowledge-center?type=regulatory", icon: FileCheck2 },
  { label: "Articles & Guides", href: "/knowledge-center?type=articles", icon: NotebookPen },
  { label: "Case Studies", href: "/case-studies", icon: FileSearch2 },
  { label: "Webinars & Events", href: "/webinars-events", icon: MonitorPlay },
  { label: "Video & Podcasts", href: "/video-podcasts", icon: Clapperboard },
];

type NavItem = { label: string; href: string; children?: { label: string; href: string; icon?: LucideIcon }[] };

const navLinks: NavItem[] = [
  { label: "About", href: "/about-us" },
  { label: "Services", href: "/services", children: serviceLinks },
  { label: "Tools", href: "#", children: toolLinks },
  { label: "Knowledge Corner", href: "#", children: knowledgeLinks },
  { label: "FAQ's", href: "/faqs" },
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
    <header
      className="sticky top-0 z-50"
      style={{ background: "#ffffff", borderBottom: "1px solid #E8EDF2", boxShadow: "0 1px 8px rgba(13,74,111,0.06)" }}
    >
      {/* ── Main nav ── */}
      <nav ref={navRef} aria-label="Main navigation" className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-1">

        {/* Logo */}
        <Link href="/" className="shrink-0 mr-3 xl:mr-6">
          <Image
            src="/logo-header-hq.png"
            alt="Be IPO Ready"
            width={2017}
            height={484}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0 text-[12.5px] xl:text-[13.5px] font-medium flex-1" role="list">
          {navLinks.map((link) =>
            link.children ? (
              <li key={link.label} className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={openDropdown === link.label}
                  onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                  className="flex items-center gap-1 px-2 xl:px-3 py-2 rounded-md whitespace-nowrap transition-colors duration-150 cursor-pointer"
                  style={{ color: openDropdown === link.label ? "#0D4A6F" : "#374151" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#0D4A6F")}
                  onMouseLeave={e => (e.currentTarget.style.color = openDropdown === link.label ? "#0D4A6F" : "#374151")}
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
                  <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 min-w-[230px]">
                    <div className="h-0.5 mb-1.5 mx-2 rounded-full" style={{ background: "linear-gradient(90deg,#0D4A6F,#ECB85B)" }} aria-hidden="true" />
                    {link.href !== "#" && (
                      <Link
                        href={link.href}
                        className="block px-4 py-2.5 text-[13px] font-bold border-b border-slate-100 hover:bg-blue-50 transition-colors"
                        style={{ color: "#0D4A6F" }}
                        onClick={() => setOpenDropdown(null)}
                      >
                        All {link.label} →
                      </Link>
                    )}
                    {link.children.map((child) => {
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-blue-50 hover:text-[#0D4A6F] transition-colors whitespace-nowrap"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {ChildIcon && <ChildIcon className="w-4 h-4 shrink-0 text-brand-gold" aria-hidden="true" />}
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block px-2 xl:px-3 py-2 rounded-md whitespace-nowrap text-[#374151] hover:text-[#0D4A6F] transition-colors duration-150"
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
          className="hidden lg:inline-flex items-center ml-2 xl:ml-3 px-3 xl:px-5 py-2.5 rounded-lg font-bold whitespace-nowrap text-[12.5px] xl:text-[13.5px] hover:opacity-90 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
          style={{ background: "#ECB85B", color: "#0D4A6F", boxShadow: "0 2px 12px rgba(236,184,91,0.35)" }}
        >
          Book an IPO Readiness Call
        </Link>

        {/* Mobile burger */}
        <button
          className="lg:hidden ml-auto p-2 rounded-md transition-colors cursor-pointer"
          style={{ color: "#0D4A6F" }}
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
          background: "#ffffff",
          borderTop: mobileOpen ? "1px solid #E8EDF2" : "none",
          overflowY: "auto",
        }}
      >
        <ul className="max-w-7xl mx-auto px-4 py-3 space-y-0.5" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.children ? (
                <>
                  <button
                    className="w-full flex items-center justify-between px-3 py-3 rounded-md text-[#374151] hover:text-[#0D4A6F] hover:bg-blue-50/60 transition-colors text-sm font-medium cursor-pointer"
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
                    <ul className="mt-1 ml-3 pl-3 border-l-2 border-[#ECB85B]/60 space-y-0.5">
                      {link.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-500 hover:text-[#0D4A6F] transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {ChildIcon && <ChildIcon className="w-4 h-4 shrink-0 text-brand-gold" aria-hidden="true" />}
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className="block px-3 py-3 rounded-md text-[#374151] hover:text-[#0D4A6F] hover:bg-blue-50/60 transition-colors text-sm font-medium"
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
            className="flex items-center justify-center w-full px-6 py-3.5 rounded-lg font-bold text-[#0D4A6F] text-sm cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: "#ECB85B" }}
          >
            Book an IPO Readiness Call
          </Link>
        </div>
      </div>
    </header>
  );
}
