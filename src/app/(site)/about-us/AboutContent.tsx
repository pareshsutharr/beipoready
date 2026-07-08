"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Play,
  Quote,
  Users,
} from "lucide-react";

const TEAM_MEMBERS = [
  "[Founder]",
  "[Co-founder / Director]",
  "[Head of IPO Advisory]",
  "[Head of Fundraising]",
  "[Analysts / Associates]",
  "[Advisors / Mentors]",
];

const JOURNEY = [
  {
    year: "[Year]",
    text: "BEIPOREADY founded on a single idea: prepare businesses before they go public.",
  },
  {
    year: "[Year]",
    text: "First advisory mandate / first growth-capital raise closed.",
  },
  {
    year: "[Year]",
    text: "First SME IPO successfully listed on [NSE Emerge / BSE SME].",
  },
  {
    year: "[Year]",
    text: "Crossed ₹[XX] Cr in capital raised for clients.",
  },
  {
    year: "[Year]",
    text: "Expanded services across fundraising, pre-IPO and IPO advisory.",
  },
  {
    year: "[Year]",
    text: "[Recognition / milestone / notable listing].",
  },
  {
    year: "Today",
    text: "Trusted by promoters across India as their IPO readiness and growth-capital partner.",
  },
];

const STATS = [
  { value: "₹[XXX] Cr+", label: "capital raised for clients", icon: BarChart3 },
  { value: "[XX]", label: "successful listings enabled", icon: CheckCircle2 },
  { value: "[XX]+", label: "businesses advised", icon: BriefcaseBusiness },
  { value: "[XX]+", label: "years of combined capital-market experience", icon: CalendarDays },
  { value: "[XX]+", label: "sectors served", icon: Building2 },
  { value: "[XXX]+", label: "investors, PE funds & lenders in our network", icon: Users },
];

const FAQS = [
  {
    q: "What makes BEIPOREADY different from other IPO advisors?",
    a: "Most advisors join once you've decided to file. We start earlier — building genuine readiness, capital discipline and governance before the process begins. We also stay across the full journey (fundraising, pre-IPO and IPO), so you have one partner from your first raise to a successful listing and beyond.",
  },
  {
    q: "Do you only work on IPOs?",
    a: "No. Many of our clients aren't ready for — or don't yet need — an IPO. We help businesses raise growth capital through equity or debt, and pursue a public listing only when it's the right move. IPO readiness is a journey, and we meet you wherever you are on it.",
  },
  {
    q: "What kind of companies do you work with?",
    a: "Promoter-led Indian businesses with real fundamentals and ambition — typically those exploring growth capital or a listing on NSE Emerge, BSE SME, or the Main Board. If you're serious about building long-term value, we're built to help.",
  },
  {
    q: "Are you a merchant banker? What's your role in the process?",
    a: "We're your advisor and coordinator — on your side of the table throughout. We assess readiness, structure the raise or issue, and select and coordinate the SEBI-registered intermediaries (merchant banker, RTA, legal, market maker) who execute the transaction. [Add your regulatory standing / registrations here.]",
  },
  {
    q: "Where are you based, and do you work across India?",
    a: "We're based in Surat, Gujarat, and work with businesses across India. Initial conversations can happen over a call, wherever you are.",
  },
  {
    q: "How do we start working with you?",
    a: "It begins with a free IPO Readiness Call. We'll understand where you are, tell you honestly how ready you are, and map the clearest path forward — no obligation.",
  },
];

export default function AboutContent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState(FAQS[0].q);

  useEffect(() => {
    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    let mm: { revert: () => void } | null = null;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        mm = media;

        media.add("(prefers-reduced-motion: no-preference)", () => {
          ctx = gsap.context(() => {
            gsap.fromTo(
              ".about-reveal",
              { opacity: 0, y: 34 },
              {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: "power3.out",
                stagger: 0.08,
                scrollTrigger: { trigger: ".about-page", start: "top 70%" },
              }
            );

            gsap.utils.toArray<HTMLElement>("[data-about-stagger]").forEach((group) => {
              const items = group.querySelectorAll("[data-about-item]");
              gsap.fromTo(
                items,
                { opacity: 0, y: 28 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.65,
                  ease: "power3.out",
                  stagger: 0.1,
                  scrollTrigger: { trigger: group, start: "top 84%" },
                }
              );
            });
          }, rootRef);
        });
      }
    );

    return () => {
      cancelled = true;
      ctx?.revert();
      mm?.revert();
    };
  }, []);

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
    <div ref={rootRef} className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="relative overflow-hidden  border-b border-slate-200">
        <Image
          src="/heroaboutimg.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 " aria-hidden="true" style={{ background: "linear-gradient(135deg,rgba(7, 15, 30, 0.8) 0%,rgba(15,45,82,0.55) 100%)" }}  />
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-20" aria-hidden="true" >
          <div className="absolute bottom-10 right-10 flex items-end gap-2">
            {[28, 52, 78, 108, 140].map((height, index) => (
              <span
                key={height}
                className="block w-6 rounded-t bg-brand-gold"
                style={{ height, opacity: 0.34 + index * 0.1 }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-center">
            <div>
              <p className="about-reveal font-sans text-sm font-semibold uppercase tracking-[0.25em] text-white mb-4">
                About BEIPOREADY
              </p>
              <h1 className="about-reveal font-serif text-4xl sm:text-5xl lg:text-[3.65rem] font-bold  leading-[1.08] tracking-tight max-w-3xl text-brand-gold">
                We don&apos;t just advise on IPOs. We make companies ready for them.
              </h1>
              <p className="about-reveal mt-6 font-sans text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl text-white">
                BEIPOREADY is India&apos;s IPO advisory and growth-capital specialist — partnering with promoters from their first raise to a confident public listing, and beyond.
              </p>
            </div>

            <div className="about-reveal rounded border border-brand-gold/35 bg-white p-6 shadow-sm">
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold mb-3">
                Positioning
              </p>
              <p className="font-serif text-2xl font-bold text-brand-navy leading-tight">
                India&apos;s Leading IPO Advisor and Growth Capital Expert
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start">
            <div>
              <p className="about-reveal font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
                Our Story
              </p>
              <h2 className="about-reveal font-serif text-3xl sm:text-4xl font-bold text-brand-navy leading-tight mb-7">
                The name is the mission — Be IPO Ready.
              </h2>
              <div className="space-y-5 font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                <p className="about-reveal">
                  Most businesses treat an IPO as a finish line. We were founded on the opposite belief: that a great listing is never the starting point of value — it&apos;s the <em>result</em> of being genuinely ready for it.
                </p>
                <p className="about-reveal">
                  [Founder name] started BEIPOREADY in [year] after seeing the same pattern again and again — strong Indian businesses, with real products and real customers, held back from the public markets not by their fundamentals but by a lack of preparation. Capital raised without a plan. Governance left until the last minute. Founders walking into a listing they weren&apos;t ready for, and leaving value on the table.
                </p>
              </div>

              <figure className="about-reveal my-8 rounded bg-brand-navy p-6 sm:p-8 text-white">
                <Quote className="w-8 h-8 text-brand-gold mb-4" aria-hidden="true" />
                <blockquote className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  &ldquo;A successful IPO isn&apos;t an event you attend. It&apos;s a state you reach.&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-sans text-sm text-white/70">
                  — [Founder name], Founder, BEIPOREADY
                </figcaption>
              </figure>

              <div className="space-y-5 font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                <p className="about-reveal">
                  We built BEIPOREADY to close that gap. Our work begins long before a prospectus is filed — with respect for capital, disciplined preparation, and honest advice about where a business truly stands. We walk with promoters across the whole journey: raising the right growth capital, building genuine IPO readiness, and executing a successful listing on NSE Emerge, BSE SME, or the Main Board.
                </p>
                <p className="about-reveal">
                  The result is simple to say and hard to earn: <strong className="text-brand-navy">value creation before the IPO, and wealth creation after it.</strong> That&apos;s what it means to be IPO ready — and it&apos;s what we help every client become.
                </p>
              </div>
            </div>

            <div className="about-reveal lg:sticky lg:top-24">
              <div className="relative aspect-video overflow-hidden rounded border border-slate-200 bg-brand-navy shadow-xl">
                <div className="absolute inset-0 opacity-15" aria-hidden="true">
                  <div className="absolute bottom-8 left-8 right-8 flex items-end justify-center gap-3">
                    {[46, 72, 104, 138, 172].map((height) => (
                      <span key={height} className="block w-8 rounded-t bg-brand-gold" style={{ height }} />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-brand-gold text-brand-navy flex items-center justify-center mb-5 shadow-lg">
                    <Play className="w-7 h-7 fill-current" aria-hidden="true" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">
                    Founder&apos;s message / brand film goes here.
                  </p>
                  <p className="mt-3 font-sans text-sm text-white/65">
                    Suggested 60–90 seconds: the founder on why BEIPOREADY exists, who it&apos;s for, and what &ldquo;being IPO ready&rdquo; really means.
                  </p>
                </div>
                <span className="absolute top-4 right-4 rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-reveal max-w-3xl mb-12">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              The People Behind Your Listing
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-5 leading-tight">
              Advisors who&apos;ve walked this road before
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
              Behind every BEIPOREADY mandate is a team that combines capital-markets expertise with real financial and operating insight. We sit on your side of the table — partners invested in your outcome, not just your transaction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-about-stagger>
            {TEAM_MEMBERS.map((member) => (
              <article key={member} data-about-item className="group overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
                <div className="aspect-[4/3] bg-brand-navy/8 flex items-center justify-center">
                  <Users className="w-12 h-12 text-brand-navy/30" aria-hidden="true" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-brand-navy">[Full Name]</h3>
                      <p className="mt-1 font-sans text-sm text-slate-600">
                        [Designation, e.g. Founder &amp; Managing Director] · [Credentials: CA / CFA / MBA]
                      </p>
                    </div>
                    <Link
                      href="#"
                      aria-label="LinkedIn profile URL"
                      className="shrink-0 w-9 h-9 rounded bg-brand-navy text-white flex items-center justify-center font-serif font-bold hover:bg-brand-gold hover:text-brand-navy transition-colors"
                    >
                      in
                    </Link>
                  </div>
                  <p className="mt-5 font-sans text-sm text-slate-600 leading-relaxed">
                    [1–2 line bio: years of experience, area of expertise, notable listings or mandates.]
                  </p>
                  <p className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                    {member}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="about-reveal mt-8 font-sans text-sm text-slate-500 leading-relaxed">
            Send names, titles, credentials, photos and LinkedIn URLs and I&apos;ll write polished profiles. Confirm whether &ldquo;Dr. Rakesh Doshi&rdquo; (your blog author) and your primary contact belong here.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-reveal max-w-3xl mb-14">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              Our Journey
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-5 leading-tight">
              From a simple conviction to India&apos;s IPO readiness partner
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
              Every milestone below is a promoter we backed and a business we helped move forward.
            </p>
          </div>

          <div className="relative" data-about-stagger>
            <div className="hidden lg:block absolute left-0 right-0 top-8 h-px bg-slate-200" aria-hidden="true" />
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
              {JOURNEY.map((item) => (
                <article key={`${item.year}-${item.text}`} data-about-item className="relative bg-white lg:bg-transparent">
                  <div className="flex lg:block gap-4">
                    <div className="relative z-10 w-16 h-16 shrink-0 rounded-full bg-brand-navy text-brand-gold border-4 border-white shadow flex items-center justify-center">
                      <CalendarDays className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div className="lg:mt-5 rounded border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="font-serif text-lg font-bold text-brand-navy">{item.year}</p>
                      <p className="mt-2 font-sans text-sm text-slate-600 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand-cream py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-reveal max-w-3xl mb-10">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              Proof in Practice
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mb-5 leading-tight">
              What &ldquo;being ready&rdquo; looks like
            </h2>
            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
              A closer look at how disciplined preparation turns into a successful outcome.
            </p>
          </div>

          <div className="about-reveal overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-brand-navy p-8 sm:p-10 text-white flex flex-col justify-between">
                <div>
                  <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-brand-gold mb-5">
                    [Client name — Sector]
                  </p>
                  <p className="font-serif text-4xl font-bold text-brand-gold leading-none">
                    ₹[XX] Cr
                  </p>
                  <p className="mt-3 font-sans text-sm text-white/65">Issue size</p>
                </div>
                <Link href="/case-studies" className="mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold text-brand-gold hover:text-brand-gold-light">
                  View all case studies
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
              <div className="p-8 sm:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {["₹[XX] Cr", "[X]×", "[+XX]%"].map((metric, index) => (
                    <div key={metric} className="rounded border border-slate-200 bg-brand-cream p-4">
                      <p className="font-serif text-2xl font-bold text-brand-navy">{metric}</p>
                      <p className="mt-1 font-sans text-xs text-slate-500">
                        {index === 0 ? "Issue size" : index === 1 ? "Subscribed" : "Listing gain"}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-5 font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                  <p><strong className="text-brand-navy">The challenge:</strong> [What the company needed — e.g. raise growth capital, or prepare for and execute an SME IPO.]</p>
                  <p><strong className="text-brand-navy">What we did:</strong> [BEIPOREADY&apos;s role across readiness, structuring, investor/intermediary coordination, and listing.]</p>
                  <p><strong className="text-brand-navy">The outcome:</strong> Issue size <strong>₹[XX] Cr</strong> · <strong>[X]×</strong> subscribed · <strong>[+XX]%</strong> listing gain · listed on <strong>[NSE Emerge / BSE SME]</strong>, [month/year].</p>
                  <p><strong className="text-brand-navy">In their words:</strong> &ldquo;[Short client quote, if available.]&rdquo;</p>
                </div>
              </div>
            </div>
          </div>

          <p className="about-reveal mt-8 font-sans text-sm text-slate-500 leading-relaxed">
            Publish only verified, permitted figures. Send details and I&apos;ll write the full case study.
          </p>
        </div>
      </section>

      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle, #F59E0B 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-reveal max-w-3xl mb-12">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              Our Advisory Strength
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
              Experience you can count
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10" data-about-stagger>
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} data-about-item className="bg-brand-navy p-6 sm:p-8">
                <Icon className="w-7 h-7 text-brand-gold mb-5" aria-hidden="true" />
                <p className="font-serif text-3xl sm:text-4xl font-bold text-brand-gold leading-none">{value}</p>
                <p className="mt-3 font-sans text-sm text-white/65 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-reveal max-w-3xl mb-12">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              What Our Clients Say
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy leading-tight">
              The people we&apos;ve helped go public
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-about-stagger>
            {[1, 2].map((item) => (
              <figure key={item} data-about-item className="rounded border border-slate-200 bg-brand-cream p-7 sm:p-8">
                <Quote className="w-8 h-8 text-brand-gold mb-5" aria-hidden="true" />
                <blockquote className="font-serif text-xl sm:text-2xl font-bold text-brand-navy leading-tight">
                  &ldquo;[Client quote{item === 1 ? " — the experience and outcome of working with BEIPOREADY." : ""}]&rdquo;
                </blockquote>
                <figcaption className="mt-6 font-sans text-sm text-slate-600">
                  <strong className="text-brand-navy">— [Name], [Designation], [Company]</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="about-reveal mt-8 font-sans text-sm text-slate-500 leading-relaxed">
            Templates only — I won&apos;t invent quotes. Collect a few approved quotes (with permission to publish name and company) and I&apos;ll polish them.
          </p>
        </div>
      </section>

      <section className="bg-brand-cream py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-reveal mb-10">
            <p className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-brand-gold mb-4">
              About BEIPOREADY — FAQs
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy leading-tight">
              What founders ask before they work with us
            </h2>
          </div>

          <div className="space-y-3" data-about-stagger>
            {FAQS.map((item) => {
              const isOpen = openFaq === item.q;
              return (
                <article key={item.q} data-about-item className="overflow-hidden rounded border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? "" : item.q)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-brand-navy">{item.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-brand-gold transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5">
                      <p className="border-t border-slate-100 pt-4 font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-brand-navy py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-brand-gold/50" aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-start">
            <div className="about-reveal">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Let&apos;s find out how ready you really are.
              </h2>
              <p className="mt-5 font-sans text-base sm:text-lg text-white/65 leading-relaxed">
                Whether you&apos;re raising your first round of capital or preparing to ring the bell, it starts with a conversation.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/contact-us"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand-gold px-6 py-3 font-sans text-sm font-semibold text-brand-navy hover:bg-brand-gold-light transition-colors"
                >
                  Book a Free IPO Readiness Call
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/ipo-readiness-tool"
                  className="inline-flex items-center justify-center gap-2 rounded border border-white/20 px-6 py-3 font-sans text-sm font-semibold text-white hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  Are You IPO Ready? — Take the Check
                </Link>
              </div>

              <div className="mt-10 space-y-4 font-sans text-sm text-white/70">
                <p className="flex gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-brand-gold" aria-hidden="true" />
                  2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan, Surat, Gujarat 395009
                </p>
                <p className="flex gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-brand-gold" aria-hidden="true" />
                  [domain email — e.g. hello@beipoready.com]
                </p>
                <p className="flex gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-brand-gold" aria-hidden="true" />
                  +91 95377 67203
                </p>
              </div>
            </div>

            <div className="about-reveal rounded border border-white/10 bg-white p-5 sm:p-6 shadow-xl">
              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-navy">
                    Book a Free IPO Readiness Call
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-sans text-sm font-semibold text-brand-navy">Name</span>
                    <input className="mt-2 w-full rounded border border-slate-200 px-4 py-3 font-sans text-sm text-brand-navy outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20" />
                  </label>
                  <label className="block">
                    <span className="font-sans text-sm font-semibold text-brand-navy">Company</span>
                    <input className="mt-2 w-full rounded border border-slate-200 px-4 py-3 font-sans text-sm text-brand-navy outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20" />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="font-sans text-sm font-semibold text-brand-navy">Phone</span>
                    <input className="mt-2 w-full rounded border border-slate-200 px-4 py-3 font-sans text-sm text-brand-navy outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20" />
                  </label>
                  <label className="block">
                    <span className="font-sans text-sm font-semibold text-brand-navy">Service dropdown</span>
                    <select className="mt-2 w-full rounded border border-slate-200 px-4 py-3 font-sans text-sm text-brand-navy outline-none focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20">
                      <option>Fundraising</option>
                      <option>Pre-IPO</option>
                      <option>IPO Advisory</option>
                    </select>
                  </label>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded bg-brand-gold px-6 py-3 font-sans text-sm font-semibold text-brand-navy hover:bg-brand-gold-light transition-colors"
                >
                  Book a Free IPO Readiness Call
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
