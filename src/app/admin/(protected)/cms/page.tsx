import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/admin/cms/FormControls";

export const metadata: Metadata = { title: "Content Overview - Be IPO Ready Admin" };

const sections = [
  {
    href: "/admin/blogs",
    title: "Blogs",
    description: "Knowledge Center posts, SEO text, article body, and cover images.",
  },
  {
    href: "/admin/faqs",
    title: "FAQs",
    description: "Question answers, categories, publish state, and display order.",
  },
  {
    href: "/admin/case-studies",
    title: "Case Studies",
    description: "Company stories, listing outcomes, readiness scores, and cover images.",
  },
  {
    href: "/admin/testimonials",
    title: "Testimonials",
    description: "Client quotes, company names, industries, outcomes, and images.",
  },
  {
    href: "/admin/clients",
    title: "Our Clients",
    description: "Homepage client logo carousel with image uploads managed from admin.",
  },
  {
    href: "/admin/alerts",
    title: "Alerts & Popups",
    description: "Announcement banners and popup alerts across the public website.",
  },
  {
    href: "/admin/stats",
    title: "Trust Stats",
    description: "Homepage metrics such as capital raised, IPOs advised, and success rate.",
  },
];

export default function CmsOverviewPage() {
  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="Content Overview"
        description="The CMS is separated into focused admin sections. Each save revalidates the public pages so published changes are reflected live."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-gold hover:shadow-md"
          >
            <h2 className="font-heading text-lg font-bold text-brand-navy">{section.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{section.description}</p>
            <span className="mt-4 inline-flex text-sm font-semibold text-brand-gold">Open section →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
