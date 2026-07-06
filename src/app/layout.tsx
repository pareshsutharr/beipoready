import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BEIPOREADY | India's Leading SME IPO Advisor & Growth Capital Expert",
    template: "%s | BEIPOREADY",
  },
  description:
    "IPO advisory, pre-IPO readiness and growth-capital fundraising for Indian businesses — including NSE Emerge & BSE SME listings. Book a free IPO readiness call with BEIPOREADY.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-cream font-sans text-slate-800">
        {children}
      </body>
    </html>
  );
}
