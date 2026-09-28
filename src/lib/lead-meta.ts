import type { LeadSource, LeadStatus } from "@/types";

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  contact: "Contact Form",
  "home-cta": "Home CTA",
  "readiness-tool": "Readiness Tool",
  "issue-size-calculator": "Issue Calc",
  "issue-cost-estimator": "Cost Estimator",
  "sme-ipo-checklist": "IPO Checklist",
  services: "Services Page",
  newsletter: "Newsletter",
  "case-study": "Case Study",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-amber-100 text-amber-800 border-amber-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  qualified: "bg-emerald-100 text-emerald-800 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

export const LEAD_SOURCES = Object.keys(LEAD_SOURCE_LABELS) as LeadSource[];

export function isLeadSource(value: string): value is LeadSource {
  return (LEAD_SOURCES as string[]).includes(value);
}
