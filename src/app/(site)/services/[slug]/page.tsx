import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Banknote, TrendingUp, LineChart, Scale, type LucideIcon } from "lucide-react";
import ServiceDetail from "@/components/services/ServiceDetail";
import AnimatedServiceTitle from "@/components/services/AnimatedServiceTitle";
import { getPublishedClients } from "@/lib/cms";
import { SERVICES } from "@/lib/services-data";
import { buildMetadata, SITE_URL } from "@/lib/seo";

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

export async function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: `${service.tagline}.`,
    path: `/services/${slug}`,
    keywords: [service.title, "SME IPO advisory", "BEIPOREADY services"],
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) notFound();

  const Icon = SERVICE_ICONS[slug];
  const clients = await getPublishedClients();

  // Tagline fades in right after the title's letter-in animation finishes.
  const titleLetters = service.title.replace(/ /g, "").length;
  const titleAnimEnd = 0.25 + titleLetters * 0.028 + 0.5;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.tagline,
    provider: { "@type": "Organization", name: "BEIPOREADY", url: SITE_URL },
    areaServed: "IN",
    url: `${SITE_URL}/services/${slug}`,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* ── Service name tab (fixed, left edge, vertically centered) ──── */}
      <Link
        href="/services"
        aria-label={`${service.title} — back to all services`}
        className="hidden md:block fixed left-0 top-1/2 z-40 px-3 py-6 rounded-r-lg shadow-lg hover:pl-4 transition-[padding] duration-200 bg-[#ECB85B] [writing-mode:vertical-rl] -translate-y-1/2 rotate-[360deg]"
      >
        <span className="font-sans text-sm font-bold uppercase tracking-widest text-white whitespace-nowrap">
          {service.title}
        </span>
      </Link>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-navy overflow-hidden lg:min-h-[560px] lg:flex lg:items-center">
        {/* Right: clear photo, left edge dissolves into the navy background (lg+) */}
        <div
          className="hidden lg:block absolute inset-y-0 left-[42%] right-0"
          style={{
            WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 42%, black 100%)",
            maskImage: "linear-gradient(to left, transparent 0%, black 42%, black 100%)",
          }}
        >
          <Image
            src={SERVICE_IMAGES[slug]}
            alt=""
            aria-hidden="true"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          {/* Colour-wash so the seam reads as intentional even where the photo runs bright */}
          <div
            className="absolute inset-y-0 left-0 w-[55%]"
            style={{ background: "linear-gradient(to right, #0F2D52 0%, rgba(15,45,82,0.55) 45%, transparent 100%)" }}
          />
        </div>

        {/* Mobile / tablet: full-bleed image below the text, faded top edge */}
        <div
          className="lg:hidden absolute inset-x-0 bottom-0 h-40 sm:h-52"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
          }}
        >
          <Image src={SERVICE_IMAGES[slug]} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover opacity-40" />
        </div>

        <div key={slug} className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-14 2xl:px-20">
          <div className="w-full lg:w-[46%] py-20 sm:py-24">
            <Link
              href="/services"
              className="svc-fade-up inline-flex items-center gap-1.5 font-sans text-sm text-white/50 hover:text-white/80 transition-colors mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Services
            </Link>

            <div className="svc-fade-up w-12 h-12 flex items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold mb-5 [animation-delay:0.1s]">
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>

            <AnimatedServiceTitle text={service.title} />

            <p
              className="svc-fade-up font-sans text-lg text-white/65 leading-relaxed"
              style={{ animationDelay: `${titleAnimEnd}s` }}
            >
              {service.tagline}
            </p>
          </div>
        </div>
      </section>

      <ServiceDetail service={service} clients={clients} />
    </main>
  );
}
