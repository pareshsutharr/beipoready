import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beipoready.com";
export const SITE_NAME = "BEIPOREADY";

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
  const ogImage = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      images: [ogImage],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export function isoDate(value: string): string | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "BEIPOREADY",
    alternateName: "Be IPO Ready",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-transparent.png`,
    description:
      "IPO advisory, pre-IPO readiness and growth-capital fundraising for Indian businesses, including NSE Emerge and BSE SME listings.",
    email: "info@beipoready.com",
    telephone: "+91-95377-67203",
    address: {
      "@type": "PostalAddress",
      streetAddress: "2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395009",
      addressCountry: "IN",
    },
  };
}
