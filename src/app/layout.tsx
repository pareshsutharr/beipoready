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
    default: "Be IPO Ready | SME IPO Advisory Services",
    template: "%s | Be IPO Ready",
  },
  description:
    "Expert SME IPO advisory, pre-IPO fundraising, IPO readiness assessment, documentation support, and valuation & capital structuring services.",
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
