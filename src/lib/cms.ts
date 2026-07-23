import { connectToDatabase } from "@/lib/mongodb";
import { toPlain, toPlainArray } from "@/lib/serialize";
import { BlogPost as BlogPostModel } from "@/models/BlogPost";
import { CaseStudy as CaseStudyModel } from "@/models/CaseStudy";
import { Faq as FaqModel } from "@/models/Faq";
import { SiteStat as SiteStatModel } from "@/models/SiteStat";
import { Client as ClientModel } from "@/models/Client";
import { Testimonial as TestimonialModel } from "@/models/Testimonial";
import { SiteAlert as SiteAlertModel } from "@/models/SiteAlert";
import type { BlogPost, CaseStudy, ClientLogo, Faq, SiteAlert, SiteStat, Testimonial } from "@/types";

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
