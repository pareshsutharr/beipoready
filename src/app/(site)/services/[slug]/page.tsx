import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";

type Props = { params: Promise<{ slug: string }> };

const SERVICE_IMAGES: Record<string, string> = {
  "sme-ipo-advisory":              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=700&fit=crop&q=85",
  "ipo-readiness-assessment":      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=700&fit=crop&q=85",
  "pre-ipo-fundraising":           "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&h=700&fit=crop&q=85",
  "ipo-documentation-compliance":  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&h=700&fit=crop&q=85",
  "valuation-capital-structuring": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=700&fit=crop&q=85",
};

const SERVICES: Record<
  string,
  {
    title: string;
    tagline: string;
    intro: string;
    whatWeDeliver: string[];
    whyItMatters: string;
    process: { step: string; desc: string }[];
    faq: { q: string; a: string }[];
  }
> = {
  "sme-ipo-advisory": {
    title: "SME IPO Advisory",
    tagline: "End-to-end guidance from decision to listing day",
    intro:
      "Our flagship service manages the entire IPO journey — from the first board resolution to the listing ceremony. We act as your single point of coordination, managing interactions with the lead manager, SEBI, stock exchanges, registrar, legal counsel, and auditors.",
    whatWeDeliver: [
      "IPO strategy, timeline, and dilution structuring",
      "Lead manager selection and pitch preparation",
      "DRHP and RHP drafting support",
      "SEBI / exchange liaison and query response",
      "Road show materials and investor Q&A preparation",
      "Listing day coordination and post-listing compliance calendar",
    ],
    whyItMatters:
      "Most SME IPOs that fail do so not because the business is weak, but because the process is mismanaged — missed deadlines, incomplete disclosures, or underpriced offers. Our end-to-end advisory eliminates these risks.",
    process: [
      { step: "Readiness Diagnostic", desc: "We assess your financial, governance, and compliance health before committing any fees." },
      { step: "Strategy & Structuring", desc: "We define the offer structure, dilution, pricing band rationale, and exchange choice." },
      { step: "Documentation", desc: "We draft and review DRHP, RHP, and all supporting documents to SEBI ICDR standards." },
      { step: "Regulatory Filing", desc: "We manage the filing process, respond to SEBI observations, and handle exchange empanelment." },
      { step: "Investor Outreach", desc: "We prepare road show decks, management Q&A scripts, and IPO subscription strategy." },
      { step: "Listing & Compliance", desc: "We coordinate listing day activities and hand over your post-listing compliance calendar." },
    ],
    faq: [
      { q: "How long does an SME IPO take?", a: "Typically 12–18 months from the readiness assessment to listing, depending on the company's starting point and regulatory queue." },
      { q: "What is the minimum revenue for an SME IPO?", a: "SEBI does not mandate a minimum revenue, but NSE Emerge requires a post-issue paid-up capital above ₹1 Cr and below ₹25 Cr. BSE SME has similar criteria. A profitable track record of at least 2 years is strongly advisable." },
      { q: "Do we need a SEBI-registered merchant banker?", a: "Yes. A Category I Merchant Banker must act as Lead Manager for any SME IPO. We work with empanelled merchant bankers and can make introductions." },
    ],
  },

  "ipo-readiness-assessment": {
    title: "IPO Readiness Assessment",
    tagline: "Know your real IPO score before you engage a banker",
    intro:
      "An independent readiness assessment is the most valuable investment you can make before spending ₹30–50 Lakhs on an IPO process. We diagnose 25 parameters across five domains and hand you a scored report with a specific, prioritised action plan.",
    whatWeDeliver: [
      "Scored assessment across 5 domains (Financial, Governance, Operations, Legal, Business)",
      "Written gap analysis with specific, prioritised actions",
      "Estimated timeline to IPO readiness",
      "Risk flag report for SEBI / investor scrutiny areas",
      "Presentation-ready executive summary for your board",
    ],
    whyItMatters:
      "Companies that skip the readiness assessment often discover mid-DRHP that they have related party transactions, unaudited group entities, or accounting policy inconsistencies that halt the process entirely — burning fees and management bandwidth.",
    process: [
      { step: "Data Collection", desc: "We request 3 years of audited financials, statutory registers, board minutes, and compliance certificates." },
      { step: "Domain Assessment", desc: "Our team scores each of 25 parameters against SEBI / exchange listing criteria." },
      { step: "Gap Prioritisation", desc: "We rank gaps by severity (blocking vs. advisable) and estimated remediation time." },
      { step: "Report Delivery", desc: "We present the full report to your board or CFO, with a clear action roadmap." },
      { step: "Follow-up Advisory", desc: "Optional: we stay engaged during the remediation phase to verify gaps are closed." },
    ],
    faq: [
      { q: "How long does the assessment take?", a: "Typically 3–4 weeks from receipt of all requested documents." },
      { q: "Is the assessment confidential?", a: "Yes. All information shared with us is covered under a mutual NDA signed at engagement start." },
      { q: "Can we use the report for investor meetings?", a: "The executive summary (Section 1 of our report) is designed to be shared with potential investors or board members." },
    ],
  },

  "pre-ipo-fundraising": {
    title: "Pre-IPO Fundraising",
    tagline: "Bridge capital from the right investors before you list",
    intro:
      "A pre-IPO round — done correctly — accelerates your listing timeline, strengthens your balance sheet for the DRHP, and brings in investors who act as listing-day anchors. Done incorrectly, it creates SEBI lock-in complications and dilution that spooks public investors.",
    whatWeDeliver: [
      "Pre-IPO investor identification and mandate (HNIs, family offices, PE/VC)",
      "Term sheet structuring with SEBI-compliant lock-in provisions",
      "Information memorandum and investor presentation preparation",
      "Investor due diligence support",
      "Subscription documentation and shareholder agreement review",
      "Cap table management post-round",
    ],
    whyItMatters:
      "Many SMEs enter the IPO process undercapitalised, which forces them to accept unfavourable pre-IPO terms in a hurry. A planned pre-IPO round 12–18 months before listing gives you negotiating leverage and a cleaner balance sheet for public investors.",
    process: [
      { step: "Capital Requirement Analysis", desc: "We determine the optimal amount and timing based on your IPO timeline and working capital needs." },
      { step: "Investor Targeting", desc: "We identify suitable investors from our network — matched by sector, stage, and return expectation." },
      { step: "Pitch Preparation", desc: "We prepare an IM and pitch deck that positions the pre-IPO round as an IPO-path investment." },
      { step: "Negotiation Support", desc: "We advise on valuation, round size, anti-dilution clauses, and SEBI lock-in structure." },
      { step: "Documentation", desc: "We review subscription agreements, SHA, and cap table post-round for IPO compatibility." },
    ],
    faq: [
      { q: "What is the SEBI lock-in requirement for pre-IPO investors?", a: "Pre-IPO investors (non-promoters) are typically locked in for 6 months from the date of allotment in the IPO, as per SEBI ICDR Regulations." },
      { q: "What valuation discount do pre-IPO investors expect?", a: "Pre-IPO investors typically seek a 20–35% discount to the anticipated IPO price, depending on the stage and risk profile of the company." },
      { q: "Can a pre-IPO round include foreign investors?", a: "Yes, subject to applicable FEMA and RBI regulations. We work with legal counsel to ensure compliance for cross-border investments." },
    ],
  },

  "ipo-documentation-compliance": {
    title: "IPO Documentation & Compliance",
    tagline: "SEBI-grade documentation that passes scrutiny",
    intro:
      "SEBI's ICDR Regulations require exhaustive, precisely formatted disclosures. A single inconsistency between the DRHP and underlying financials can trigger an observation letter that delays your IPO by months. Our documentation service eliminates that risk.",
    whatWeDeliver: [
      "Draft DRHP with full SEBI ICDR Schedule VI compliance",
      "Red Herring Prospectus (RHP) and Final Prospectus preparation",
      "Risk factor drafting and peer benchmarking",
      "Management Discussion & Analysis (MD&A) section",
      "Related party transaction disclosure table",
      "SEBI observation letter response management",
      "Annual compliance calendar post-listing",
    ],
    whyItMatters:
      "The DRHP is both a legal document and a marketing document — it must satisfy SEBI's disclosure requirements while being compelling enough to attract investor subscriptions. Most companies lack the in-house expertise to do both simultaneously.",
    process: [
      { step: "Information Gathering", desc: "We prepare a detailed checklist of all information required per SEBI ICDR Schedule VI." },
      { step: "First Draft", desc: "We produce a complete first draft of the DRHP within 6–8 weeks of information receipt." },
      { step: "Review Cycle", desc: "We coordinate review by your legal counsel, auditors, lead manager, and promoters." },
      { step: "Filing", desc: "We manage the SEBI filing and provide all supporting annexures in the required format." },
      { step: "Observation Response", desc: "We draft responses to SEBI's observation letter, typically within 15 days of receipt." },
      { step: "RHP & Allotment", desc: "We update the document for the RHP and manage the post-allotment filing." },
    ],
    faq: [
      { q: "What is the difference between DRHP and RHP?", a: "The Draft Red Herring Prospectus (DRHP) is filed with SEBI for review. After SEBI's observations are addressed and the price band is finalised, the Red Herring Prospectus (RHP) is filed with the stock exchange and made available to investors." },
      { q: "How long does SEBI take to respond to a DRHP?", a: "SEBI typically issues its observation letter within 30 days for SME IPOs, though this can vary based on SEBI's workload and the completeness of the filing." },
      { q: "Who is responsible for the DRHP — the company or the merchant banker?", a: "Both. The Lead Manager (merchant banker) is responsible for ensuring the DRHP complies with SEBI requirements. However, the company and its promoters are responsible for the accuracy of information disclosed." },
    ],
  },

  "valuation-capital-structuring": {
    title: "Valuation & Capital Structuring",
    tagline: "Price your IPO to succeed — not just to list",
    intro:
      "Valuation is where many SME IPOs go wrong — either priced too high (triggering post-listing collapse that damages promoter reputation) or too low (destroying value for existing shareholders). Our valuation service brings institutional rigour to an SME context.",
    whatWeDeliver: [
      "Sector P/E and EV/EBITDA peer comparable analysis",
      "Discounted cash flow (DCF) valuation model",
      "Price band recommendation with rationale memo",
      "Share capital restructuring (face value, bonus, splits) if needed",
      "Dilution optimisation — offer for sale vs. fresh issue mix",
      "Promoter shareholding post-IPO scenario modelling",
    ],
    whyItMatters:
      "A ₹10 Cr error in IPO pricing is a ₹10 Cr permanent wealth destruction for your promoter family. Getting the valuation right — and being able to defend it to SEBI, lead managers, and institutional investors — is non-negotiable.",
    process: [
      { step: "Financial Normalisation", desc: "We normalise 3–5 years of financials for one-time items, related party adjustments, and accounting policy changes." },
      { step: "Peer Identification", desc: "We identify 8–12 listed SME or mainboard peers for the comparable company analysis." },
      { step: "Multiples Analysis", desc: "We compute trading multiples (P/E, EV/EBITDA, P/BV) and apply premium/discount factors." },
      { step: "DCF Build", desc: "We build a 5-year DCF with scenario analysis — base, optimistic, and stress cases." },
      { step: "Price Band Recommendation", desc: "We synthesise both methods into a price band recommendation with a written defence note." },
      { step: "Structuring", desc: "We advise on share capital structure, face value, fresh issue/OFS mix, and promoter retention." },
    ],
    faq: [
      { q: "Do we need a separate registered valuer?", a: "For certain purposes (like ESOPs or asset valuation), yes. For IPO pricing, valuation is typically performed by the merchant banker — our work supports and validates that process." },
      { q: "How do you handle companies with no listed peers?", a: "We use a blended approach — sector P/E from the nearest comparable sector, adjusted DCF, and a discount to mainboard peers of similar size. We are transparent about the assumptions." },
      { q: "What is the typical P/E range for SME IPOs?", a: "SME IPOs typically price at 10–20x trailing PAT, depending on sector and growth trajectory. Consumer-facing and IT companies sometimes command higher multiples. We provide sector-specific benchmarking as part of this service." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) return {};
  return {
    title: service.title,
    description: `${service.tagline} — ${service.intro.slice(0, 130)}...`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) notFound();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <img src={SERVICE_IMAGES[slug] ?? "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=700&fit=crop&q=85"} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(7,15,30,0.65) 0%,rgba(15,45,82,0.55) 100%)" }} aria-hidden="true" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 font-sans text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Services
          </Link>
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-gold mb-4">
            {service.tagline}
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            {service.title}
          </h1>
          <p className="font-sans text-lg text-white/65 leading-relaxed max-w-2xl">
            {service.intro}
          </p>
        </div>
      </section>

      {/* ── What we deliver ──────────────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Deliverables */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-bold text-brand-navy mb-6">
                What We Deliver
              </h2>
              <ul className="space-y-3">
                {service.whatWeDeliver.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm text-slate-700">
                    <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-heading text-lg font-bold text-brand-navy mb-3">Why It Matters</h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">{service.whyItMatters}</p>
              </div>
            </div>

            {/* Lead capture sidebar */}
            <div>
              <div className="sticky top-24">
                <LeadCaptureForm
                  source="services"
                  heading="Enquire About This Service"
                  description="Tell us a bit about your company and we will follow up within one business day."
                  submitLabel="Send Enquiry"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-10 text-center">
            Our Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.process.map((p, i) => (
              <div key={p.step} className="bg-brand-cream rounded-xl border border-slate-200 p-6">
                <span className="font-heading text-3xl font-bold text-brand-gold/30 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-base font-bold text-brand-navy mt-2 mb-2">{p.step}</h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy mb-8 text-center">
            Common Questions
          </h2>
          <div className="space-y-6">
            {service.faq.map((item) => (
              <div key={item.q} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-heading text-base font-bold text-brand-navy mb-2">{item.q}</h3>
                <p className="font-sans text-sm text-slate-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
