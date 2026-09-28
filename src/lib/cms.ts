import { connectToDatabase } from "@/lib/mongodb";
import { toPlain, toPlainArray } from "@/lib/serialize";
import { BlogPost as BlogPostModel } from "@/models/BlogPost";
import { CaseStudy as CaseStudyModel } from "@/models/CaseStudy";
import { Faq as FaqModel } from "@/models/Faq";
import { SiteStat as SiteStatModel } from "@/models/SiteStat";
import { Client as ClientModel } from "@/models/Client";
import { Testimonial as TestimonialModel } from "@/models/Testimonial";
import { SiteAlert as SiteAlertModel } from "@/models/SiteAlert";
import { Service as ServiceModel } from "@/models/Service";
import type { BlogPost, CaseStudy, ClientLogo, Faq, ServiceRecord, SiteAlert, SiteStat, Testimonial } from "@/types";

export type ArticleCard = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  publishedAt: string;
  body: string;
  coverImageUrl: string | null;
};

export type TestimonialCard = Pick<
  Testimonial,
  "client_name" | "client_title" | "company_name" | "industry" | "image_url" | "quote" | "outcome" | "case_study_slug"
>;

export type ClientLogoCard = Pick<ClientLogo, "name" | "logo_url" | "website_url" | "nature_of_business">;

const CLIENT_NATURE_BY_NAME: Record<string, string> = {
  aaron: "Capital Goods (Elevators Manufacturers)",
  "aaron industries": "Capital Goods (Elevators Manufacturers)",
  ibl: "NBFC",
  "ibl finance": "NBFC",
  zorko: "Quick Service Restaurant (QSR)",
  rem: "Capital Goods (Automation Panel)",
  "rem electrical": "Capital Goods (Automation Panel)",
  "rem electricals": "Capital Goods (Automation Panel)",
  "rem electromach": "Capital Goods (Automation Panel)",
  "aarya automobiles": "EV Motorcycles",
  "cruizine healthcare": "Medical Equipments (Surgical Products)",
  candor: "IVF Centres/Hospital",
  "candor ivf hospital": "IVF Centres/Hospital",
  express: "Elevator Installers",
  "express electro elevators": "Elevator Installers",
  zestika: "Black Pepper Manufacturer",
  "zestika spices": "Black Pepper Manufacturer",
  paramount: "Textile Machine Manufacturer",
  "paramount looms": "Textile Machine Manufacturer",
  "paramount looms pvt. ltd.": "Textile Machine Manufacturer",
  moonstar: "Healthcare Marketing company",
  "moonstar lifecare": "Healthcare Marketing company",
  "moonstar lifecare pvt. ltd.": "Healthcare Marketing company",
  "olpad aqua ltd": "Aqua Products",
  "p.p maniya hospital": "Multi Speciality Hospital",
  "p p maniya hospital": "Multi Speciality Hospital",
  arham: "Stock Broker",
  "arham wealth": "Stock Broker",
  "arham wealth management private limited": "Stock Broker",
};

function clientNatureForName(name: string) {
  const normalized = name.trim().toLowerCase();
  return (
    CLIENT_NATURE_BY_NAME[normalized] ??
    Object.entries(CLIENT_NATURE_BY_NAME).find(([key]) => normalized.startsWith(key))?.[1] ??
    null
  );
}

function withClientNature<T extends { name: string; nature_of_business?: string | null }>(
  client: T
): T & { nature_of_business: string | null } {
  return {
    ...client,
    nature_of_business: client.nature_of_business ?? clientNatureForName(client.name),
  };
}

export type CaseStudyCard = {
  slug: string;
  sector: string;
  company: string;
  outcome: string;
  challenge: string;
  result: string;
  readinessScore: number;
  coverImageUrl: string | null;
  publishedAt: string;
};

export type CaseStudyDetail = CaseStudyCard & {
  exchange: string;
  issueSize: string;
  subscription: string;
  summary: string;
  approach: string[];
  quote: string;
  quotePerson: string;
};

export type ServiceData = Pick<
  ServiceRecord,
  "slug" | "title" | "tagline" | "summary" | "icon" | "overview" | "process" | "timeline" | "approach" | "faq"
> & { coverImageUrl: string | null; whoItsFor: string[] };

// Placeholder values, replace with BEIPOREADY's real, verifiable figures
// Placeholder values, replace with BEIPOREADY's real, verifiable figures
// via the admin CMS (site_stats table). Never publish invented numbers.
export const FALLBACK_STATS: Pick<SiteStat, "label" | "value">[] = [
  { value: "₹1000Cr+", label: "Capital Raised" },
  { value: "20+", label: "Businesses Advised" },
  // { value: "[XX]", label: "Successful Listings" },
  { value: "40+", label: "Years of Capital-Market Experience" },
];

export const FALLBACK_ARTICLES: Record<string, ArticleCard> = {
  "sebi-sme-ipo-eligibility-criteria-2024": {
    slug: "sebi-sme-ipo-eligibility-criteria-2024",
    category: "Regulation",
    title: "SEBI SME IPO Eligibility: A Complete 2024 Checklist",
    excerpt: "Everything a promoter needs to know about NSE Emerge and BSE SME listing criteria.",
    readTime: "8 min read",
    publishedAt: "March 15, 2025",
    coverImageUrl: null,
    body: `
## Why Eligibility Matters Before You Start the IPO Process

Many companies engage a merchant banker, spend 3–4 months drafting a DRHP, and then discover mid-process that they do not satisfy one of the basic eligibility criteria. This wastes ₹15–25 Lakhs in fees and delays the listing by 6–12 months.

A 30-minute eligibility check at the start saves months of wasted effort.

## NSE Emerge Eligibility Criteria

### Minimum Requirements

- **Post-issue paid-up equity capital**: More than ₹1 Crore and up to ₹25 Crore
- **Net tangible assets**: At least ₹1.5 Crore in the last full financial year
- **Net worth**: At least ₹1 Crore in each of the preceding 2 full financial years
- **Track record**: At least 3 years of operational history
- **Distributable profits**: Positive distributable profits from operations for at least 2 out of 3 preceding financial years
- **Website**: A functional website is mandatory

### Additional Conditions

The company must not be a wilful defaulter, must not have any winding-up or insolvency proceedings, and must have a Demat account facility for its securities.

## BSE SME Eligibility Criteria

BSE SME has slightly different criteria:

- **Post-issue paid-up capital**: Up to ₹25 Crore
- **Net worth**: Positive net worth
- **Track record**: At least 3 years of operations
- **Net tangible assets**: At least ₹1.5 Crore in the latest audited financial statements
- **Profitability**: Positive distributable profits for at least 2 out of the last 3 fiscal years

## Our Recommendation

Run the eligibility check before signing any mandate letters. Use our IPO Readiness Tool to get a preliminary assessment, then speak with an advisor for detailed eligibility verification.
    `.trim(),
  },
  "drhp-common-mistakes-sme-ipo": {
    slug: "drhp-common-mistakes-sme-ipo",
    category: "Documentation",
    title: "The 7 Most Common DRHP Mistakes That Delay SME IPOs",
    excerpt: "Based on real SEBI observation letters, these are the disclosure errors that most frequently trigger queries.",
    readTime: "11 min read",
    publishedAt: "February 28, 2025",
    coverImageUrl: null,
    body: `
## Why SEBI Observation Letters Get Triggered

A SEBI observation letter is not a rejection. It is a list of queries that must be answered before the DRHP can be processed. Most observation letters for SME IPOs contain 15–40 queries.

## Mistake 1: Incomplete Related Party Transaction Disclosures

SEBI requires all related party transactions for the last 3 years to be disclosed in a standard tabular format.

- Transactions with group entities not identified as related parties
- Personal loans by promoters disclosed as other borrowings
- Missing disclosure of transactions above ₹10 Lakhs

## Mistake 2: Risk Factors That Are Too Generic

Risk factors must be specific to the company's actual risks and quantified where possible.

## Mistake 3: Inconsistency Between DRHP Sections

The business overview, MD&A, financial statements, and notes to accounts must be internally consistent.

## Mistake 4: Promoter Background Disclosure Gaps

SEBI requires detailed promoter background including prior business involvements, criminal proceedings, and regulatory actions.

## Mistake 5: Objects of the Issue Not Properly Justified

Each use of IPO proceeds must be supported with project reports, supplier quotations, or loan statements.

## Mistake 6: Auditor Not Peer Review Qualified

For SME IPOs, the statutory auditor must have a valid peer review certificate.

## Mistake 7: Market Maker Agreement Not in Order

A formal Market Maker Agreement must be signed and submitted with the DRHP.
    `.trim(),
  },
};

export const FALLBACK_CASE_STUDIES: Record<string, CaseStudyDetail> = {
  "rajpur-agro-nse-emerge": {
    slug: "rajpur-agro-nse-emerge",
    sector: "Agro Processing",
    company: "Rajpur Agro Products Ltd",
    exchange: "NSE Emerge",
    issueSize: "₹22 Crore",
    subscription: "4.2×",
    readinessScore: 62,
    outcome: "Listed on NSE Emerge, ₹22 Cr IPO, oversubscribed 4.2×",
    summary:
      "Rajpur Agro engaged us with ambitions to list within 12 months. Our readiness assessment revealed related party transactions spanning 6 group entities and an incomplete statutory audit trail.",
    challenge:
      "The company had made inter-corporate loans to promoter-owned entities over 3 years, all undisclosed in the financials.",
    approach: [
      "Commissioned a forensic accounting review",
      "Advised promoters to wind down inter-corporate loans",
      "Restructured the board and constituted an Audit Committee",
      "Restated related party disclosures",
    ],
    result:
      "After 14 months of remediation, the DRHP was filed with clean RTP disclosures. The IPO was subscribed 4.2× and listed at a 38% premium.",
    coverImageUrl: null,
    publishedAt: "March 10, 2025",
    quote:
      "Their systematic approach to closing that gap saved our IPO.",
    quotePerson: "Promoter, Rajpur Agro Products Ltd",
  },
  "technosynth-bse-sme": {
    slug: "technosynth-bse-sme",
    sector: "Engineering / B2B Tech",
    company: "TechnoSynth Controls Pvt Ltd",
    exchange: "BSE SME",
    issueSize: "₹14 Crore",
    subscription: "6.8×",
    readinessScore: 74,
    outcome: "Listed on BSE SME, ₹14 Cr IPO, oversubscribed 6.8×",
    summary:
      "TechnoSynth had strong financials but no corporate governance infrastructure before the readiness engagement.",
    challenge:
      "The board consisted of 2 promoter directors only, with no audit committee, company secretary, or secretarial audit.",
    approach: [
      "Onboarded independent directors",
      "Constituted required committees",
      "Appointed a qualified Company Secretary",
      "Implemented board policies and compliance records",
    ],
    result:
      "Within 6 months, TechnoSynth had a compliant governance structure. The IPO was oversubscribed on day one and closed at 6.8×.",
    coverImageUrl: null,
    publishedAt: "February 18, 2025",
    quote:
      "Be IPO Ready made it happen in 6 months without disrupting our business operations.",
    quotePerson: "CEO, TechnoSynth Controls Pvt Ltd",
  },
  "healthplus-diagnostics-nse": {
    slug: "healthplus-diagnostics-nse",
    sector: "Healthcare / Diagnostics",
    company: "HealthPlus Diagnostics Ltd",
    exchange: "NSE Emerge",
    issueSize: "₹18 Crore",
    subscription: "3.1×",
    readinessScore: 81,
    outcome: "Listed on NSE Emerge, ₹18 Cr IPO, subscription 3.1×",
    summary:
      "HealthPlus had grown from 1 to 12 diagnostic clinics in 4 years, but accounting policies had not scaled with the business.",
    challenge:
      "Cost accounting for diagnostic consumables was inconsistent across clinics, requiring restatement before a clean audit opinion.",
    approach: [
      "Standardised cost accounting policies",
      "Worked with auditors to restate financials",
      "Verified profitability impact",
      "Prepared an ERP implementation roadmap",
    ],
    result:
      "The auditor issued an unqualified opinion. The IPO was priced at 18× FY24 PAT and fully subscribed within 2 hours.",
    coverImageUrl: null,
    publishedAt: "January 22, 2025",
    quote:
      "Be IPO Ready turned it into a strength, our margins looked better, not worse.",
    quotePerson: "CFO, HealthPlus Diagnostics Ltd",
  },
};

export const FALLBACK_SERVICES: Record<string, ServiceData> = {
  "fund-raising": {
    slug: "fund-raising",
    title: "Fund Raising",
    tagline: "Structured equity and debt capitalization solutions engineered to facilitate corporate expansion",
    summary:
      "We help growth-stage businesses secure equity and debt capital from a curated network of investors, VC funds, private equity, family offices, HNIs, NBFCs, and banks, managing the process end-to-end, from investment story to closing.",
    icon: "Banknote",
    coverImageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&h=700&fit=crop&q=85",
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
    summary:
      "We ready your company for public markets, governance, capital structure, financial reporting, while helping you secure Pre-IPO funding from institutional investors, family offices, and HNIs ahead of listing day.",
    icon: "TrendingUp",
    coverImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=700&fit=crop&q=85",
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
    summary:
      "Your primary strategic partner and coordinator across the entire SME IPO journey, from eligibility evaluation and DRHP filing to marketing, the listing bell, and post-listing compliance.",
    icon: "LineChart",
    coverImageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=700&fit=crop&q=85",
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
    summary:
      "A professionally backed, defensible answer to what your business is worth, blending multi-method valuation with strategic capital-structure advice so you can negotiate with confidence.",
    icon: "Scale",
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=700&fit=crop&q=85",
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

export const FALLBACK_FAQS = [
  {
    category: "IPO Eligibility & Basics",
    items: [
      {
        q: "What is an SME IPO?",
        a: "An SME IPO allows companies with a post-issue paid-up capital of up to ₹25 Crore to list on dedicated SME platforms, NSE Emerge or BSE SME.",
      },
      {
        q: "Can a loss-making company do an SME IPO?",
        a: "SEBI does not prohibit loss-making companies from listing on SME platforms, but exchanges typically require a profitable track record.",
      },
    ],
  },
];

function formatDate(date: string | null) {
  if (!date) return "Draft";
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function estimateReadTime(body: string | null) {
  const words = body?.trim().split(/\s+/).filter(Boolean).length ?? 0;
  return `${Math.max(1, Math.ceil(words / 180))} min read`;
}

function articleFromPost(post: BlogPost): ArticleCard {
  return {
    slug: post.slug,
    category: post.category.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    title: post.title,
    excerpt: post.excerpt ?? "",
    readTime: estimateReadTime(post.body),
    publishedAt: formatDate(post.published_at ?? post.created_at),
    body: post.body ?? "",
    coverImageUrl: post.cover_image_url,
  };
}

function serviceFromRow(row: ServiceRecord): ServiceData {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    summary: row.summary,
    icon: row.icon,
    coverImageUrl: row.cover_image_url,
    overview: row.overview,
    whoItsFor: row.who_its_for,
    process: row.process,
    timeline: row.timeline,
    approach: row.approach,
    faq: row.faq,
  };
}

function caseStudyFromRow(row: CaseStudy): CaseStudyDetail {
  return {
    slug: row.slug,
    sector: row.industry ?? "SME",
    company: row.company_name,
    exchange: row.exchange ?? "SME Exchange",
    issueSize: row.ipo_size ?? row.capital_raised ?? "Not disclosed",
    subscription: row.subscription ?? row.listing_results ?? "Not disclosed",
    readinessScore: row.readiness_score ?? 0,
    outcome: row.outcome ?? row.listing_results ?? "Successful listing journey",
    summary: row.summary ?? row.solution ?? row.outcome ?? "",
    challenge: row.challenge ?? "",
    approach: row.approach?.length ? row.approach : [row.our_role ?? "IPO readiness advisory"],
    result: row.result ?? row.listing_results ?? row.outcome ?? "",
    coverImageUrl: row.cover_image_url,
    publishedAt: formatDate(row.published_at ?? row.created_at),
    quote: row.testimonial_quote ?? "",
    quotePerson: row.testimonial_author ?? row.company_name,
  };
}

export async function getPublishedArticles() {
  try {
    await connectToDatabase();
    const docs = await BlogPostModel.find({ status: "published" })
      .sort({ published_at: -1 })
      .lean();

    if (!docs.length) return Object.values(FALLBACK_ARTICLES);
    return toPlainArray(docs).map((doc) => articleFromPost(doc as unknown as BlogPost));
  } catch {
    return Object.values(FALLBACK_ARTICLES);
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = await BlogPostModel.findOne({ slug, status: "published" }).lean();

    if (!doc) return FALLBACK_ARTICLES[slug] ?? null;
    return articleFromPost(toPlain(doc) as unknown as BlogPost);
  } catch {
    return FALLBACK_ARTICLES[slug] ?? null;
  }
}

export async function getPublishedCaseStudies() {
  try {
    await connectToDatabase();
    const docs = await CaseStudyModel.find({ status: "published" })
      .sort({ published_at: -1 })
      .lean();

    if (!docs.length) return Object.values(FALLBACK_CASE_STUDIES);
    return toPlainArray(docs).map((doc) => caseStudyFromRow(doc as unknown as CaseStudy));
  } catch {
    return Object.values(FALLBACK_CASE_STUDIES);
  }
}

export async function getCaseStudyBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = await CaseStudyModel.findOne({ slug, status: "published" }).lean();

    if (!doc) return FALLBACK_CASE_STUDIES[slug] ?? null;
    return caseStudyFromRow(toPlain(doc) as unknown as CaseStudy);
  } catch {
    return FALLBACK_CASE_STUDIES[slug] ?? null;
  }
}

export async function getPublishedServices() {
  try {
    await connectToDatabase();
    const docs = await ServiceModel.find({ status: "published" })
      .sort({ sort_order: 1, title: 1 })
      .lean();

    if (!docs.length) return Object.values(FALLBACK_SERVICES);
    return toPlainArray(docs).map((doc) => serviceFromRow(doc as unknown as ServiceRecord));
  } catch {
    return Object.values(FALLBACK_SERVICES);
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = await ServiceModel.findOne({ slug, status: "published" }).lean();

    if (!doc) return FALLBACK_SERVICES[slug] ?? null;
    return serviceFromRow(toPlain(doc) as unknown as ServiceRecord);
  } catch {
    return FALLBACK_SERVICES[slug] ?? null;
  }
}

export type NewsAlertItem = {
  type: "blog" | "case-study";
  title: string;
  excerpt: string;
  href: string;
  date: string;
};

export async function getNewsAlertItems(limit = 6): Promise<NewsAlertItem[]> {
  try {
    await connectToDatabase();

    const [latestPostDocs, flaggedPostDocs, flaggedCaseStudyDocs] = await Promise.all([
      BlogPostModel.find({ status: "published" }).sort({ published_at: -1 }).limit(1).lean(),
      BlogPostModel.find({ status: "published", show_in_news_alert: true })
        .sort({ published_at: -1 })
        .limit(limit)
        .lean(),
      CaseStudyModel.find({ status: "published", show_in_news_alert: true })
        .sort({ published_at: -1 })
        .limit(limit)
        .lean(),
    ]);

    const latestPostResult = toPlainArray(latestPostDocs) as unknown as BlogPost[];
    const flaggedPostsResult = toPlainArray(flaggedPostDocs) as unknown as BlogPost[];
    const flaggedCaseStudiesResult = toPlainArray(flaggedCaseStudyDocs) as unknown as CaseStudy[];

    const posts = new Map<string, BlogPost>();
    for (const post of [...latestPostResult, ...flaggedPostsResult]) {
      posts.set(post.id, post);
    }

    const items: NewsAlertItem[] = [
      ...Array.from(posts.values()).map((post) => ({
        type: "blog" as const,
        title: post.title,
        excerpt: post.excerpt ?? "",
        href: `/knowledge-center/${post.slug}`,
        date: post.published_at ?? post.created_at,
      })),
      ...flaggedCaseStudiesResult.map((cs) => ({
        type: "case-study" as const,
        title: cs.company_name,
        excerpt: cs.summary ?? cs.outcome ?? "",
        href: `/case-studies/${cs.slug}`,
        date: cs.published_at ?? cs.created_at,
      })),
    ];

    return items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getPublishedFaqGroups() {
  try {
    await connectToDatabase();
    const docs = await FaqModel.find({ is_published: true })
      .sort({ category: 1, sort_order: 1 })
      .lean();

    if (!docs.length) return FALLBACK_FAQS;

    const data = toPlainArray(docs) as unknown as Faq[];
    const groups = new Map<string, { category: string; items: { q: string; a: string }[] }>();
    data.forEach((faq: Faq) => {
      const category = faq.category.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const group = groups.get(category) ?? { category, items: [] };
      group.items.push({ q: faq.question, a: faq.answer });
      groups.set(category, group);
    });
    return Array.from(groups.values());
  } catch {
    return FALLBACK_FAQS;
  }
}

export async function getSiteStats() {
  try {
    await connectToDatabase();
    const docs = await SiteStatModel.find({ is_published: true }).sort({ sort_order: 1 }).lean();

    if (!docs.length) return FALLBACK_STATS;
    return toPlainArray(docs) as unknown as SiteStat[];
  } catch {
    return FALLBACK_STATS;
  }
}

export async function getPublishedClients(): Promise<ClientLogoCard[]> {
  try {
    await connectToDatabase();
    const docs = await ClientModel.find(
      { is_published: true },
      "name logo_url website_url nature_of_business"
    )
      .sort({ sort_order: 1 })
      .lean();

    if (!docs.length) return [];
    return (toPlainArray(docs) as unknown as ClientLogoCard[]).map(withClientNature);
  } catch {
    return [];
  }
}

export async function getPublishedTestimonials(): Promise<TestimonialCard[]> {
  try {
    await connectToDatabase();
    const docs = await TestimonialModel.find({ is_published: true })
      .sort({ sort_order: 1 })
      .limit(3)
      .lean();

    // No invented fallback testimonials, sections hide until real,
    // approved quotes are published via the CMS.
    if (!docs.length) return [];
    return toPlainArray(docs) as unknown as TestimonialCard[];
  } catch {
    return [];
  }
}

export async function getActiveSiteAlert(placement: "banner" | "popup") {
  try {
    await connectToDatabase();
    const doc = await SiteAlertModel.findOne({ is_active: true, placement })
      .sort({ created_at: -1 })
      .lean();

    if (!doc) return null;
    return toPlain(doc) as unknown as SiteAlert;
  } catch {
    return null;
  }
}
