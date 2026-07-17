import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Banknote, TrendingUp, LineChart, Scale, type LucideIcon } from "lucide-react";
import ServiceDetail from "@/components/services/ServiceDetail";
import { getPublishedClients } from "@/lib/cms";
import { SERVICES } from "@/lib/services-data";

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
