import type { Metadata } from "next";
import { Montserrat, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, organizationJsonLd } from "@/lib/seo";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_TITLE = "BEIPOREADY | India's Leading SME IPO Advisor & Growth Capital Expert";
const DEFAULT_DESCRIPTION =
  "IPO advisory, pre-IPO readiness and growth-capital fundraising for Indian businesses including NSE Emerge & BSE SME listings. Book an IPO readiness call with BEIPOREADY.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | BEIPOREADY",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "SME IPO advisor",
    "IPO advisory India",
    "NSE Emerge listing",
    "BSE SME listing",
    "IPO readiness",
    "pre-IPO advisory",
    "growth capital fundraising",
    "SME IPO consultants",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  category: "Finance",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream font-sans text-slate-800">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
