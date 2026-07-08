import type { Metadata } from "next";
import { Montserrat, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "BEIPOREADY | India's Leading SME IPO Advisor & Growth Capital Expert",
    template: "%s | BEIPOREADY",
  },
  description:
    "IPO advisory, pre-IPO readiness and growth-capital fundraising for Indian businesses — including NSE Emerge & BSE SME listings. Book an IPO readiness call with BEIPOREADY.",
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
        {children}
      </body>
    </html>
  );
}
