import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getPublishedArticles, getPublishedCaseStudies } from "@/lib/cms";

const SERVICE_SLUGS = [
  "fund-raising",
  "pre-ipo-advisory",
  "sme-ipo-advisory",
  "valuation-corporate-restructuring",
];

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about-us", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/case-studies", changeFrequency: "weekly", priority: 0.8 },
  { path: "/knowledge-center", changeFrequency: "weekly", priority: 0.8 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/get-listed", changeFrequency: "monthly", priority: 0.7 },
  { path: "/ipo-readiness-tool", changeFrequency: "monthly", priority: 0.7 },
  { path: "/issue-size-calculator", changeFrequency: "monthly", priority: 0.6 },
  { path: "/issue-cost-estimator", changeFrequency: "monthly", priority: 0.6 },
  { path: "/sme-ipo-checklist", changeFrequency: "monthly", priority: 0.6 },
  { path: "/webinars-events", changeFrequency: "weekly", priority: 0.5 },
  { path: "/video-podcasts", changeFrequency: "weekly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.2 },
];

function safeLastModified(publishedAt: string): Date | undefined {
  const date = new Date(publishedAt);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [caseStudies, articles] = await Promise.all([
    getPublishedCaseStudies(),
    getPublishedArticles(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const serviceEntries: MetadataRoute.Sitemap = SERVICE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/services/${slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified: safeLastModified(cs.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/knowledge-center/${article.slug}`,
    lastModified: safeLastModified(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...caseStudyEntries, ...articleEntries];
}
