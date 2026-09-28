import Image from "next/image";
import Link from "next/link";
import ClientsMarquee from "@/components/sections/ClientsMarquee";
import FaqAccordion from "@/components/sections/FaqAccordion";
import LazyYouTubeEmbed from "@/components/LazyYouTubeEmbed";
import ObfuscatedEmailAnchor from "@/components/ObfuscatedEmailAnchor";
import type { ClientLogoCard } from "@/lib/cms";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Quote,
  Users,
} from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Dr. Rakesh Doshi",
    role: "Founder & Chairman",
    experience: "35+ years of experience in equity capital markets",
    image: "/teamfolder/rakesh.JPG?v=20260708",
    linkedin: "https://www.linkedin.com/in/rakeshdoshi11",
  },
  {
    name: "Saurav Gandhi",
    role: "Head of IPO advisory",
    experience: "6+ years of experience in equity capital markets",
    image: "/teamfolder/saurav.JPG?v=20260708",
    linkedin: "https://www.linkedin.com/in/saurav-gandhi-027012154",
  },
  {
    name: "Vishwa Shah",
    role: "Head of Private Investments",
    experience: "6+ years of experience in fund raising",
    image: "/teamfolder/vishwa.JPG?v=20260708",
    linkedin: "https://www.linkedin.com/in/vishwashah23",
  },
  {
    name: "Harshita Shewani",
    role: "Financial Analyst",
    experience: "2+ years experience",
    image: "/teamfolder/harshita.JPG?v=20260708",
    linkedin: "https://www.linkedin.com/in/harshita-shewani-b549a1254",
  },
];

const STATS = [
  { value: "₹1000Cr+", label: "capital raised for clients", icon: BarChart3 },
  { value: "20+", label: "Companies Invested In", icon: CheckCircle2 },
  { value: "20+", label: "businesses advised", icon: BriefcaseBusiness },
  { value: "40+", label: "years of combined capital-market experience", icon: CalendarDays },
  { value: "10+", label: "sectors served", icon: Building2 },
  { value: "50+", label: "investors, PE funds & lenders in our network", icon: Users },
];

const HERO_BAR_STYLES = [
  "h-7 opacity-35",
  "h-[52px] opacity-45",
  "h-[78px] opacity-55",
  "h-[108px] opacity-65",
  "h-[140px] opacity-75",
];

const FAQS = [
  {
    q: "What makes BEIPOREADY different from other IPO advisors?",
    a: "Most advisors join once you've decided to file. We start earlier, building genuine readiness, capital discipline and governance before the process begins. We also stay across the full journey (fundraising, pre-IPO and IPO), so you have one partner from your first raise to a successful listing and beyond.",
  },
  {
    q: "Do you only work on IPOs?",
    a: "No. Many of our clients aren't ready for, or don't yet need, an IPO. We help businesses raise growth capital through equity or debt, and pursue a public listing only when it's the right move. IPO readiness is a journey, and we meet you wherever you are on it.",
  },
  {
    q: "What kind of companies do you work with?",
    a: "Promoter-led Indian businesses with real fundamentals and ambition, typically those exploring growth capital or a listing on NSE Emerge, BSE SME, or the Main Board. If you're serious about building long-term value, we're built to help.",
  },
  {
    q: "Are you a merchant banker? What's your role in the process?",
    a: "No. We are your advisor and coordinator, on your side of the table throughout. We assess readiness, structure the raise or issue, and coordinate the SEBI-registered intermediaries who execute the transaction.",
  },
  {
    q: "Where are you based, and do you work across India?",
    a: "We're based in Surat, Gujarat, and work with businesses across India. Initial conversations can happen over a call, wherever you are.",
  },
  {
    q: "How do we start working with you?",
    a: "It begins with an IPO Readiness Call. We'll understand where you are, tell you honestly how ready you are, and map the clearest path forward, no obligation.",
  },
];

export default function AboutContent({ clients }: { clients: ClientLogoCard[] }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-slate-200 bg-[#0F2D52]">
        <div className="absolute inset-y-0 right-0 w-full lg:w-[80%]" aria-hidden="true">
          <Image
            src="/heroaboutimg.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 hidden lg:block bg-[linear-gradient(90deg,#0F2D52_0%,rgba(15,45,82,0.82)_18%,rgba(15,45,82,0.38)_45%,rgba(15,45,82,0.08)_75%,rgba(15,45,82,0)_100%)]" />
          <div className="absolute inset-0 lg:hidden bg-[linear-gradient(180deg,rgba(7,15,30,0.82)_0%,rgba(15,45,82,0.72)_55%,rgba(15,45,82,0.45)_100%)]" />
        </div>
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-20" aria-hidden="true">
          <div className="absolute bottom-10 right-10 flex items-end gap-2">
            {HERO_BAR_STYLES.map((styleClass) => (
              <span
                key={styleClass}
                className={`block w-6 rounded-t bg-brand-gold ${styleClass}`}
              />
            ))}
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-white mb-4">
                About BEIPOREADY
              </p>
              <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-brand-gold sm:text-5xl lg:max-w-3xl lg:text-[3.65rem]">
                We don&apos;t just advise on IPOs. We make companies ready for them.
              </h1>
              <p className="mt-4 font-sans text-xl text-white">
                Beyond procedural compliance, we help companies get better valuation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
                Our Story
              </p>
              <h2 className="font-heading text-3xl font-bold leading-tight text-brand-navy mb-7 sm:text-4xl">
                The name is the mission, Be IPO Ready.
              </h2>
              <div className="space-y-5 font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
                <p>
                  Most businesses treat an IPO as a finish line. We were founded on the opposite belief: that a great listing is never the starting point of value, it&apos;s the result of being genuinely ready for it.
                </p>
                <p>
                  Dr. Rakesh Doshi started BEIPOREADY in 2020 after seeing the same pattern again and again: strong Indian businesses, with real products and real customers, held back from the public markets not by their fundamentals but by a lack of preparation.
                </p>
              </div>

              <figure className="my-8 rounded bg-brand-navy p-6 text-white sm:p-8">
                <Quote className="mb-4 h-8 w-8 text-brand-gold" aria-hidden="true" />
                <blockquote className="font-heading text-2xl font-bold leading-tight sm:text-3xl">
                  We are good advisors because we are good investors. We are good investors because we are good advisors.
                </blockquote>
                <figcaption className="mt-4 font-sans text-sm text-white/70">
                  Dr. Rakesh Doshi, Founder, BEIPOREADY
                </figcaption>
              </figure>

              <div className="space-y-5 font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
                <p>
                  We built BEIPOREADY to close that gap. Our work begins long before a prospectus is filed, with respect for capital, disciplined preparation, and honest advice about where a business truly stands.
                </p>
                <p>
                  The result is simple to say and hard to earn: <strong className="text-brand-navy">value creation before the IPO, and wealth creation after it.</strong> That&apos;s what it means to be IPO ready, and it&apos;s what we help every client become.
                </p>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <LazyYouTubeEmbed
                videoId="SiAuBVrwqbw"
                title="What does it really take to be IPO-ready?"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              The People Behind Your Listing
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-brand-navy mb-5 sm:text-4xl">
              Advisors who&apos;ve walked this road before
            </h2>
            <p className="font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
              Behind every BEIPOREADY mandate is a team that combines capital-markets expertise with real financial and operating insight.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <article
                key={member.name}
                className="group h-full overflow-hidden rounded border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-navy">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/28 to-transparent opacity-90"
                    aria-hidden="true"
                  />
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn (opens in new tab)`}
                    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded bg-white text-xl font-bold text-brand-navy shadow-md transition-colors hover:bg-brand-gold"
                  >
                    in
                  </a>
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <h3 className="font-heading text-2xl font-bold leading-none text-white">
                      {member.name}
                    </h3>
                    <p className="mt-3 inline-flex rounded bg-white/10 px-3 py-1 font-sans text-xs font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur">
                      {member.experience}
                    </p>
                    <p className="mt-3 font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                      {member.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClientsMarquee clients={clients} />

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              Proof in Practice
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-brand-navy mb-5 sm:text-4xl">
              What &ldquo;being ready&rdquo; looks like
            </h2>
            <p className="font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
              A closer look at how disciplined preparation turns into a successful outcome.
            </p>
          </div>

          <div className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex flex-col justify-between bg-brand-navy p-8 text-white sm:p-10">
                <div>
                  <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold mb-5">
                    Aaron Industries Ltd, Capital Goods (Elevators)
                  </p>
                  <p className="font-heading text-4xl font-bold leading-none text-brand-gold">
                    ₹4.90 Cr
                  </p>
                  <p className="mt-3 font-sans text-sm text-white/65">Issue size</p>
                </div>
                <Link
                  href="/case-studies"
                  className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-gold hover:text-brand-gold-light"
                >
                  View all case studies
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="p-8 sm:p-10">
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { metric: "₹4.90 Cr", label: "Issue size" },
                    { metric: "26.5%", label: "Equity diluted" },
                    { metric: "20×", label: "Stock return in 5 yrs" },
                  ].map(({ metric, label }) => (
                    <div key={label} className="rounded border border-slate-200 bg-brand-cream p-4">
                      <p className="font-heading text-2xl font-bold text-brand-navy">{metric}</p>
                      <p className="mt-1 font-sans text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-5 font-sans text-sm leading-relaxed text-slate-600 sm:text-base">
                  <p>
                    Listed on NSE Emerge with a ₹4.90 Cr IPO in 2018 at ₹38/share; stock now trades near ₹360, with revenue up from ₹9 Cr to ₹75+ Cr.
                  </p>
                  <Link
                    href="/case-studies/aaron-industries-limited-transforming-ambition-into-market-leadership"
                    className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-navy hover:text-brand-gold"
                  >
                    Read the full Aaron Industries case study
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy py-20 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle,#F59E0B_1px,transparent_1px)] bg-[length:30px_30px] opacity-[0.06]" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              Our Advisory Strength
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
              Experience you can count
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-brand-navy p-6 sm:p-8">
                <Icon className="mb-5 h-7 w-7 text-brand-gold" aria-hidden="true" />
                <p className="font-heading text-3xl font-bold leading-none text-brand-gold sm:text-4xl">
                  {value}
                </p>
                <p className="mt-3 font-sans text-sm leading-relaxed text-white/65">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              About BEIPOREADY FAQs
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
              What founders ask before they work with us
            </h2>
          </div>

          <FaqAccordion categories={[{ category: "", items: FAQS }]} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-navy py-20 sm:py-24">
        <div className="absolute inset-x-0 top-0 h-px bg-brand-gold/50" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
                Let&apos;s find out how ready you really are.
              </h2>
              <p className="mt-5 font-sans text-base leading-relaxed text-white/65 sm:text-lg">
                Whether you&apos;re raising your first round of capital or preparing to ring the bell, it starts with a conversation.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand-gold px-6 py-3 font-sans text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light"
                >
                  Book an IPO Readiness Call
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/ipo-readiness-tool"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/20 px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  Are You IPO Ready?, Take the Check
                </Link>
              </div>

              <div className="mt-10 space-y-4 font-sans text-sm text-white/70">
                <p className="flex gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" />
                  2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan, Surat, Gujarat 395009
                </p>
                <p className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" />
                  <ObfuscatedEmailAnchor
                    className="transition-colors hover:text-brand-gold"
                    fallbackLabel="Email us"
                  />
                </p>
                <p className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-brand-gold" aria-hidden="true" />
                  +91 95377 67203
                </p>
              </div>
            </div>

            <div className="rounded border border-white/10 bg-white p-5 shadow-xl sm:p-6">
              <h3 className="font-heading text-xl font-bold text-brand-navy">
                Book an IPO Readiness Call
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                Use the contact page to share your business details, fundraising plans, and listing timeline. We&apos;ll respond with the right next step.
              </p>
              <div className="mt-6 space-y-3 rounded bg-brand-cream p-4">
                <p className="font-sans text-sm font-semibold text-brand-navy">
                  Best for:
                </p>
                <ul className="space-y-2 font-sans text-sm text-slate-600">
                  <li>Fundraising and growth-capital planning</li>
                  <li>Pre-IPO readiness assessment</li>
                  <li>SME IPO and Main Board advisory</li>
                </ul>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand-gold px-6 py-3 font-sans text-sm font-semibold text-brand-navy transition-colors hover:bg-brand-gold-light"
                >
                  Open Contact Page
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/get-listed"
                  className="inline-flex items-center justify-center gap-2 rounded border border-slate-200 px-6 py-3 font-sans text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  Share Your Requirements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
