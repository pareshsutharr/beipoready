import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Banknote, TrendingUp, LineChart, Scale, type LucideIcon } from "lucide-react";
import ServiceDetail, { type ServiceData } from "@/components/services/ServiceDetail";
import { getPublishedClients } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

const SERVICE_IMAGES: Record<string, string> = {
  "fund-raising":                  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&h=700&fit=crop&q=85",
  "pre-ipo-advisory":              "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=700&fit=crop&q=85",
  "sme-ipo-advisory":              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=700&fit=crop&q=85",
  "valuation-corporate-restructuring": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=700&fit=crop&q=85",
};

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "fund-raising": Banknote,
  "pre-ipo-advisory": TrendingUp,
  "sme-ipo-advisory": LineChart,
  "valuation-corporate-restructuring": Scale,
};

const SERVICES: Record<string, ServiceData> = {
  "fund-raising": {
    slug: "fund-raising",
    title: "Fund Raising",
    tagline: "Structured equity and debt capitalization solutions engineered to facilitate corporate expansion",
    overview: [
      "Raising capital is not just about finding money, it's about finding the right money, at the right valuation, on the right terms. Our Fund Raising service helps growth-stage businesses secure equity and debt capital from a curated network of investors, including venture capital funds, private equity firms, family offices, HNIs, NBFCs, and banks.",
      "We manage the entire process, from preparing your investment story and financial model to negotiating term sheets and closing the transaction, so you can stay focused on running your business.",
    ],
    whoItsFor: [
      "Growth-stage companies seeking growth capital",
      "Promoters looking for equity dilution at a fair valuation",
      "Businesses needing structured debt, working-capital lines, or mezzanine funding",
      "Family-run businesses professionalising and raising institutional capital for the first time",
      "Companies preparing for expansion, acquisition, or new capacity",
    ],
    process: [
      {
        stage: "Readiness & Positioning",
        timeframe: "Weeks 1–3",
        items: ["Business and financial diagnostic", "Capital requirement assessment and use-of-funds plan"],
        deliverables: ["Investment Teaser", "Pitch Deck", "Financial Model"],
      },
      {
        stage: "Investor Outreach",
        timeframe: "Weeks 4–8",
        items: ["Mapping and shortlisting suitable investors", "Confidential outreach and NDA management"],
        deliverables: ["Investor pipeline tracker", "Management meeting preparation"],
      },
      {
        stage: "Term Sheet & Diligence",
        timeframe: "Weeks 8–16",
        items: ["Negotiation support on valuation and key terms", "Coordinating financial, legal, and tax due diligence"],
        deliverables: ["Term sheet comparison", "Data room setup", "Diligence management"],
      },
      {
        stage: "Documentation & Closing",
        timeframe: "Weeks 16–20",
        items: ["Shareholder / share subscription agreement support", "Closing conditions and fund flow coordination"],
        deliverables: ["Executed transaction documents", "Closing checklist"],
      },
    ],
    timeline:
      "A typical fund-raising mandate takes 4 to 6 months from kick-off to money in the bank, depending on deal size, company preparedness, and investor appetite. Well-prepared companies with clean financials can close faster.",
    approach: [
      { title: "Story first, numbers next", text: "Investors back narratives supported by data. We craft both." },
      { title: "Curated, not scattergun", text: "We approach a focused set of investors who genuinely fit your sector and stage, protecting your confidentiality and negotiating leverage." },
      { title: "Promoter-side always", text: "We sit on your side of the table, aligned to maximise value and minimise dilution." },
      { title: "Execution ownership", text: "From data room to closing, we drive the process so timelines don't slip." },
    ],
    faq: [
      { q: "Equity or debt, which is right for my business?", a: "It depends on your cash flows, growth plans, and how much dilution you are comfortable with. Our first step is always a capital structuring review to recommend the optimal mix." },
      { q: "How do you charge for fund raising?", a: "Our fee structure generally combines a modest retainer with a success fee payable only on closing. Exact terms are shared after an initial assessment." },
      { q: "Will my information remain confidential?", a: "Yes. All investor outreach happens under NDA, and we share detailed information only with shortlisted, serious investors after your approval." },
      { q: "My financials are not audited/organised. Can you still help?", a: "Absolutely, cleaning up and presenting your financials investor-ready is part of our Stage 1 work." },
    ],
  },

  "pre-ipo-advisory": {
    slug: "pre-ipo-advisory",
    title: "Pre-IPO Advisory",
    tagline: "Strategic market positioning and capitalization initiatives executed within the twelve to twenty-four months preceding a public listing",
    overview: [
      "The 12 to 24 months leading up to an initial public offering represent a critical yet highly demanding phase for any enterprise. Strategic decisions made during this crucial window regarding corporate governance, capital structure, financial reporting, and the investor mix directly influence your final listing valuation and the overall success of the public issue.",
      "Our Pre-IPO Advisory services are designed to ready your company for public markets while simultaneously assisting you in securing Pre-IPO funding from institutional investors, family offices, and high-net-worth individuals (HNIs). This capital infusion not only substantiates your valuation and reinforces your balance sheet but also establishes strong market credibility well ahead of your listing day.",
    ],
    whoItsFor: [
      "Companies planning an IPO (Main Board or SME) in the next 1–3 years",
      "Promoters seeking partial liquidity or growth capital before listing",
      "Businesses that need to restructure group entities, related-party transactions, cap table, before going public",
      "Companies wanting anchor-quality investors on their cap table pre-listing",
    ],
    process: [
      {
        stage: "IPO Readiness Diagnostic",
        timeframe: "Weeks 1–4",
        items: ["Gap analysis across financials, governance, compliance, and structure"],
        deliverables: ["IPO Readiness Report with a prioritised action roadmap"],
      },
      {
        stage: "Corporate & Financial Restructuring",
        timeframe: "Months 2–6",
        items: ["Entity consolidation, related-party cleanup, board and committee formation", "Conversion to public limited company, ESOP structuring if needed"],
        deliverables: ["Restructuring plan", "Revised cap table", "Governance framework"],
      },
      {
        stage: "Pre-IPO Capital Raise",
        timeframe: "Months 4–9",
        items: ["Valuation benchmarking against listed peers", "Placement of Pre-IPO round with institutional investors / family offices"],
        deliverables: ["Placement memorandum", "Term sheet", "Closed Pre-IPO round"],
      },
      {
        stage: "IPO Runway Preparation",
        timeframe: "Months 9–12",
        items: ["Merchant banker and intermediary selection support", "Financial reporting alignment (restated financials, peer disclosures)"],
        deliverables: ["IPO execution roadmap and intermediary shortlist"],
      },
    ],
    timeline:
      "A structured Pre-IPO engagement typically runs 9 to 18 months, depending on how much restructuring is required and the size of the Pre-IPO raise. Companies with clean structures can compress this significantly.",
    approach: [
      { title: "Work backwards from listing day", text: "Every action is sequenced against your target IPO date." },
      { title: "Valuation building, not just fund raising", text: "Pre-IPO rounds set a benchmark; we ensure it strengthens, not caps, your IPO pricing." },
      { title: "Fix the foundation early", text: "Governance, audits, and structure issues are far cheaper to fix now than during DRHP scrutiny." },
      { title: "Right investors, right signalling", text: "We target investors whose presence on your cap table adds credibility with the market and regulators." },
    ],
    faq: [
      { q: "How early should we start Pre-IPO preparation?", a: "Ideally 18–24 months before your target listing date. That gives enough runway for restructuring, two clean audit cycles, and a well-priced Pre-IPO round." },
      { q: "Is a Pre-IPO round mandatory before an IPO?", a: "No, it's optional, but it helps establish a valuation benchmark, brings in growth capital, and adds credible names to your shareholder list." },
      { q: "Can promoters sell some shares in a Pre-IPO round?", a: "Yes, secondary sales are common in Pre-IPO transactions, subject to lock-in and disclosure norms applicable at the time of the IPO." },
      { q: "What lock-in applies to Pre-IPO investors?", a: "Pre-IPO shareholders are generally subject to lock-in requirements under SEBI regulations post-listing. We structure rounds keeping these norms in mind." },
      { q: "What if our group structure is complicated?", a: "That's exactly what Stage 2 addresses. Most family businesses need some consolidation or cleanup, we've handled complex multi-entity structures before." },
    ],
  },

  "sme-ipo-advisory": {
    slug: "sme-ipo-advisory",
    title: "SME IPO Advisory",
    tagline: "Comprehensive consultation and execution management for public listing on the NSE Emerge or BSE SME platforms, We also do Mainboard",
    overview: [
      "For small and mid-sized businesses in India, listing on BSE SME or NSE Emerge represents a highly effective growth strategy, providing access to funding, enhancing reputation, increasing brand awareness, and offering liquidity for promoters. However, navigating this transition requires managing numerous complexities, such as regulatory compliance, exchange requirements, eligibility guidelines, and coordination with merchant bankers.",
      "Our dedicated SME IPO Advisory serves as your primary strategic partner and coordinator throughout the entire process. We provide comprehensive guidance at every stage, from initial eligibility evaluation and DRHP submission to campaign marketing and the final celebratory listing bell.",
    ],
    whoItsFor: [
      "SMEs with a post-issue paid-up capital of up to ₹25 Cr (SME platform eligibility)",
      "Profitable companies with a 2–3 year operating track record seeking growth capital",
      "Promoters wanting the credibility and visibility of a listed company",
      "Businesses aiming to migrate to the Main Board over time",
      "First-generation entrepreneurs unfamiliar with the capital-markets ecosystem",
    ],
    process: [
      {
        stage: "Eligibility & Readiness",
        timeframe: "Month 1",
        items: ["Assessment against NSE Emerge / BSE SME eligibility norms", "Financial, legal, and compliance gap analysis"],
        deliverables: ["Eligibility Report + IPO Action Plan"],
      },
      {
        stage: "Pre-IPO Housekeeping",
        timeframe: "Months 2–4",
        items: ["Conversion to public limited company, board restructuring", "Appointment of intermediaries: merchant banker, RTA, legal counsel, auditors"],
        deliverables: ["Compliant corporate structure", "Intermediary onboarding"],
      },
      {
        stage: "DRHP Preparation & Filing",
        timeframe: "Months 4–7",
        items: ["Restated financials, business and risk-factor drafting support", "Coordination with merchant banker on Draft Red Herring Prospectus"],
        deliverables: ["DRHP filed with the exchange"],
      },
      {
        stage: "Approval, Marketing & Issue",
        timeframe: "Months 7–9",
        items: ["Responding to exchange observations", "Issue pricing strategy, anchor/HNI investor outreach, roadshows"],
        deliverables: ["Exchange approval", "Successful subscription"],
      },
      {
        stage: "Listing & Beyond",
        timeframe: "Month 9 onward",
        items: ["Allotment, listing ceremony, and trading commencement", "Post-listing compliance calendar and investor-relations setup"],
        deliverables: ["Listed company + 12-month compliance roadmap"],
      },
    ],
    timeline:
      "A typical SME IPO takes 6 to 9 months from kick-off to listing, assuming the company meets eligibility norms and financials are in order. Companies needing significant restructuring should budget 9–12 months.",
    approach: [
      { title: "Promoter's advisor, not just a process manager", text: "Merchant bankers run the issue; we make sure your interests, valuation, dilution, timing, stay front and centre." },
      { title: "One team, one roadmap", text: "We coordinate all intermediaries against a single timeline so nothing falls through the cracks." },
      { title: "Subscription is won before the issue opens", text: "Investor positioning, peer benchmarking, and pre-marketing start months early." },
      { title: "Life after listing matters", text: "We set up your compliance and IR framework so the listed journey starts smoothly." },
    ],
    faq: [
      { q: "Is my company eligible for an SME IPO?", a: "Broad requirements include a track record of operations, positive net worth/profitability criteria, and post-issue paid-up capital within prescribed limits. Exchange norms are updated periodically, our first step is a formal eligibility check against the latest NSE Emerge / BSE SME criteria." },
      { q: "How much does an SME IPO cost?", a: "Total costs (merchant banker, legal, RTA, exchange, marketing, advisory) typically range between 6–10% of the issue size, varying with issue size and complexity. We provide a detailed cost sheet upfront." },
      { q: "How much capital can we raise?", a: "SME IPOs in India commonly raise anywhere from ₹10 Cr to ₹100 Cr+, depending on your financials, valuation, and market conditions." },
      { q: "What is the promoter lock-in after listing?", a: "Promoter contribution is subject to lock-in under SEBI ICDR regulations (typically a multi-year lock-in on minimum promoter contribution and a shorter lock-in on the balance). We'll walk you through the exact applicable norms." },
      { q: "Can we move to the Main Board later?", a: "Yes. SME-listed companies can migrate to the Main Board after meeting prescribed criteria, many successful companies have taken this route." },
      { q: "What ongoing compliance is required after listing?", a: "Half-yearly results, shareholding disclosures, board-meeting intimations, and other requirements under SEBI LODR (with certain relaxations for SME-listed companies). We help you set up a compliance calendar." },
    ],
  },

  "valuation-corporate-restructuring": {
    slug: "valuation-corporate-restructuring",
    title: "Valuation & Corporate Restructuring",
    tagline: "Professional business valuation analysis and the design of an optimized capital stack",
    overview: [
      "Whether you are planning an IPO, raising funds, selling a stake, bringing on a partner, or organizing succession, every critical milestone hinges on a single question: what is your business truly worth, and how should its capital be structured?",
      "With our Valuation & Corporate Restructuring service, you get a professionally backed, defensible answer. By blending detailed valuation methodologies with strategic capital-structure advice, we empower you to negotiate with confidence and construct a balance sheet designed to sustain your long-term ambitions.",
    ],
    whoItsFor: [
      "Promoters preparing for a fund raise, Pre-IPO round, or IPO and needing a valuation benchmark",
      "Companies evaluating M&A, joint ventures, or stake sales",
      "Businesses with stressed or inefficient capital structures (high-cost debt, complex cap tables)",
      "Companies requiring valuations for regulatory or transaction purposes (in coordination with registered valuers where statutorily required)",
      "Family businesses planning succession, restructuring, or shareholder buyouts",
      "We do Business Valuation, ESOP Valuation, Share Valuation, and Fairness Opinions",

    ],
    process: [
      {
        stage: "Information & Diagnostic",
        timeframe: "Week 1–2",
        items: ["Data collection: financials, projections, contracts, cap table, debt profile", "Management discussions on business model and growth drivers"],
        deliverables: [],
      },
      {
        stage: "Valuation Analysis",
        timeframe: "Week 2–4",
        items: ["Multi-method valuation: DCF, Comparable Companies, Comparable Transactions, Asset-based (as applicable)", "Sensitivity and scenario analysis"],
        deliverables: ["Detailed Valuation Report with value range and key drivers"],
      },
      {
        stage: "Capital Structure Review",
        timeframe: "Week 3–5",
        items: ["Debt-equity mix analysis, cost of capital assessment", "Cap table review, ESOPs, convertibles, investor rights"],
        deliverables: ["Capital Structuring Recommendation Report"],
      },
      {
        stage: "Implementation Support",
        timeframe: "Ongoing",
        items: ["Debt refinancing/restructuring support", "Cap table cleanup, instrument structuring (equity, CCPS, CCDs, mezzanine)"],
        deliverables: ["Execution roadmap and transaction support"],
      },
    ],
    timeline:
      "Valuation report: 2 to 4 weeks from receipt of complete information. Capital structuring review: 3 to 5 weeks. Implementation support varies by scope, typically 1 to 4 months.",
    approach: [
      { title: "Defensible, not decorative", text: "Every number in our reports can withstand investor, lender, and regulatory scrutiny." },
      { title: "Multiple lenses", text: "We triangulate across methodologies rather than relying on a single model, because real negotiations happen in ranges, not point estimates." },
      { title: "Structure follows strategy", text: "Your capital stack should serve your 3–5 year plan, not just today's balance sheet." },
      { title: "Plain-English delivery", text: "We explain what drives your value, so you can improve it, not just know it." },
    ],
    faq: [
      { q: "Why do I need a professional valuation before raising funds?", a: "Walking into negotiations without a well-founded value range means the investor sets the anchor. A rigorous valuation gives you data-backed negotiating power and helps you avoid excessive dilution." },
      { q: "Which valuation method will you use for my company?", a: "It depends on your business model, stage, and industry. We typically apply DCF alongside market-based methods (listed peer multiples, transaction comparables) and reconcile them into a value range." },
      { q: "Are your valuations valid for regulatory filings?", a: "Certain regulatory purposes require valuations from specifically registered/qualified valuers. We coordinate with empanelled registered valuers wherever statutorily required, so you receive a compliant report." },
      { q: "What is capital structuring, in simple terms?", a: "It's deciding the right mix of equity, debt, and hybrid instruments to fund your business, balancing cost, control, risk, and flexibility. The right structure can lower your cost of capital and increase promoter value significantly." },
      { q: "Can you help reduce our interest cost or refinance debt?", a: "Yes. Debt profiling and refinancing/restructuring support is part of our implementation stage, we help negotiate better terms with existing or new lenders." },
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
    description: `${service.tagline}.`,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) notFound();

  const Icon = SERVICE_ICONS[slug];
  const clients = await getPublishedClients();

  return (
    <main>
      {/* ── Service name tab (fixed, left edge, vertically centered) ──── */}
      <Link
        href="/services"
        aria-label={`${service.title} — back to all services`}
        className="hidden md:block fixed left-0 top-1/2 z-40 px-3 py-6 rounded-r-lg shadow-lg hover:pl-4 transition-[padding] duration-200"
        style={{ background: "#ECB85B", writingMode: "vertical-rl", transform: "translateY(-50%) rotate(360deg)" }}
      >
        <span className="font-sans text-sm font-bold uppercase tracking-widest text-white whitespace-nowrap">
          {service.title}
        </span>
      </Link>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <img src={SERVICE_IMAGES[slug]} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0" aria-hidden="true" />
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

          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold mb-5">
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            {service.title}
          </h1>
          <p className="font-sans text-lg text-white/65 leading-relaxed max-w-2xl">
            {service.tagline}
          </p>
        </div>
      </section>

      <ServiceDetail service={service} clients={clients} />
    </main>
  );
}
