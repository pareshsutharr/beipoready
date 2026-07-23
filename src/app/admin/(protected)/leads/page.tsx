import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlainArray } from "@/lib/serialize";
import { Lead } from "@/models/Lead";
import type { Lead as LeadType, LeadSource, LeadStatus } from "@/types";

export const metadata: Metadata = { title: "Leads, Be IPO Ready Admin" };

const SOURCE_LABELS: Record<LeadSource, string> = {
  "contact": "Contact Form",
  "home-cta": "Home CTA",
  "readiness-tool": "Readiness Tool",
  "issue-size-calculator": "Issue Calc",
  "issue-cost-estimator": "Cost Estimator",
  "sme-ipo-checklist": "IPO Checklist",
  "services": "Services Page",
  "newsletter": "Newsletter",
  "case-study": "Case Study",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  "new": "bg-amber-100 text-amber-800 border-amber-200",
  "contacted": "bg-blue-100 text-blue-800 border-blue-200",
  "qualified": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "closed": "bg-slate-100 text-slate-600 border-slate-200",
};

export default async function AdminLeadsPage() {
  await connectToDatabase();
  const leads = toPlainArray(
    await Lead.find(
      {},
      "name email phone company_name source message status created_at service_interest"
    )
      .sort({ created_at: -1 })
      .limit(100)
      .lean()
  ) as unknown as Pick<
    LeadType,
    "id" | "name" | "email" | "phone" | "company_name" | "source" | "message" | "status" | "created_at" | "service_interest"
  >[];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy">Leads</h1>
          <p className="font-sans text-sm text-slate-500 mt-1">
            {`${leads.length} leads (most recent 100)`}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Company</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-xs">
                      {new Date(lead.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-navy whitespace-nowrap">{lead.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`mailto:${lead.email}`} className="hover:text-brand-gold transition-colors">
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {lead.phone ?? <span className="text-slate-300">N/A</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {lead.company_name ?? <span className="text-slate-300">N/A</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-brand-navy/8 text-brand-navy">
                        {SOURCE_LABELS[lead.source] ?? lead.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[lead.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs">
                      <p className="truncate text-xs" title={lead.message ?? ""}>
                        {lead.message ?? <span className="text-slate-300">N/A</span>}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
