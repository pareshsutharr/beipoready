import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beipoready.com";
export const SITE_NAME = "BEIPOREADY";
export const SITE_LOCALE = "en_IN";
export const LANGUAGE_ALTERNATES = {
  en: "/",
  "en-IN": "/",
};

const TITLE_SUFFIX = ` | ${SITE_NAME}`;
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;
const X_PROFILE_URL = process.env.NEXT_PUBLIC_X_URL;
const YOUTUBE_CHANNEL_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL;

export const SOCIAL_PROFILE_URLS = [
  "https://www.linkedin.com/company/beipoready/",
  "https://www.facebook.com/profile.php?id=61591048632791",
  "https://www.instagram.com/beipoready/",
  X_PROFILE_URL,
  YOUTUBE_CHANNEL_URL,
].filter((value): value is string => Boolean(value));

function trimAtWordBoundary(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;

  const truncated = normalized.slice(0, maxLength - 1).trimEnd();
  const boundaryIndex = truncated.lastIndexOf(" ");
  const safeValue = boundaryIndex > Math.floor(maxLength * 0.6)
    ? truncated.slice(0, boundaryIndex)
    : truncated;

  return `${safeValue}…`;
}

function normalizeTitle(title: string) {
  const normalized = title.replace(/\s+/g, " ").trim();
  const alreadyBranded = normalized.toLowerCase().includes(SITE_NAME.toLowerCase());
  const preferred = alreadyBranded ? normalized : `${normalized}${TITLE_SUFFIX}`;

  if (preferred.length <= MAX_TITLE_LENGTH) return preferred;
  if (normalized.length <= MAX_TITLE_LENGTH) return normalized;

  return trimAtWordBoundary(normalized, MAX_TITLE_LENGTH);
}

function normalizeDescription(description: string) {
  return trimAtWordBoundary(description, MAX_DESCRIPTION_LENGTH);
}

function buildLanguageAlternates(path: string) {
  return {
    en: path,
    "en-IN": path,
    "x-default": path,
  };
}

export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "BEIPOREADY, India's SME IPO Advisor & Growth Capital Expert",
};

/**
 * Builds page-level metadata (title, description, canonical, OG, Twitter card)
 * from one source of truth so every route stays consistent for search + social.
 * `path` must be root-relative (e.g. "/services") and is resolved against
 * metadataBase (set in the root layout) to form canonical/og:url.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image,
  noIndex,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: { url: string; width?: number; height?: number; alt?: string };
  noIndex?: boolean;
}): Metadata {
  const normalizedTitle = normalizeTitle(title);
  const normalizedDescription = normalizeDescription(description);
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title: normalizedTitle,
    description: normalizedDescription,
    keywords,
    alternates: {
      canonical: path,
      languages: buildLanguageAlternates(path),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: normalizedTitle,
      description: normalizedDescription,
      url: path,
      siteName: SITE_NAME,
      images: [ogImage],
      locale: SITE_LOCALE,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: normalizedTitle,
      description: normalizedDescription,
      images: [ogImage.url],
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function isoDate(value: string): string | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan",
  addressLocality: "Surat",
  addressRegion: "Gujarat",
  postalCode: "395009",
  addressCountry: "IN",
};

/**
 * Kept as a single concrete "Organization" type (not a type array) so audit
 * crawlers and LLMs that do a naive @type string match reliably detect it as
 * Identity Schema, instead of relying on them to parse multi-type arrays.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "BEIPOREADY",
    alternateName: "Be IPO Ready",
    legalName: "Jainam Capital Advisors",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-transparent.png`,
    },
    image: `${SITE_URL}/logo-transparent.png`,
    description:
      "IPO advisory, pre-IPO readiness and growth-capital fundraising for Indian businesses, including NSE Emerge and BSE SME listings.",
    telephone: "+91-95377-67203",
    areaServed: "IN",
    address: ADDRESS,
    sameAs: SOCIAL_PROFILE_URLS,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${SITE_URL}/contact-us`,
      telephone: "+91-95377-67203",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Gujarati"],
    },
  };
}

/** Separate LocalBusiness entity (linked via @id) so Local Business Schema is detected independently of the Organization block above. */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "FinancialService"],
    "@id": `${SITE_URL}/#local-business`,
    name: "BEIPOREADY",
    image: `${SITE_URL}/logo-transparent.png`,
    url: SITE_URL,
    telephone: "+91-95377-67203",
    priceRange: "$$$",
    description:
      "SME IPO advisory, pre-IPO readiness, valuation, and growth-capital fundraising for Indian businesses.",
    address: ADDRESS,
    areaServed: "IN",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "18:00",
      },
    ],
    currenciesAccepted: "INR",
    sameAs: SOCIAL_PROFILE_URLS,
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "SME IPO advisory, IPO readiness, and growth-capital fundraising for Indian businesses.",
    inLanguage: ["en", "en-IN"],
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
