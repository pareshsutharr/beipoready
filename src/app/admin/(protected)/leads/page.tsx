import type { Metadata } from "next";
import LeadOutreachManager from "@/components/admin/LeadOutreachManager";
import { LEAD_SOURCE_LABELS, LEAD_SOURCES, isLeadSource } from "@/lib/lead-meta";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlainArray } from "@/lib/serialize";
import { Lead } from "@/models/Lead";
import type { Lead as LeadType, LeadSource } from "@/types";

export const metadata: Metadata = { title: "Leads, Be IPO Ready Admin" };

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const activeSource = source && isLeadSource(source) ? source : null;

  await connectToDatabase();

  const [leads, counts] = await Promise.all([
    Lead.find(
      activeSource ? { source: activeSource } : {},
      "serial_number name email phone company_name source message status created_at service_interest"
    )
      .sort({ created_at: -1 })
      .lean(),
    Lead.aggregate<{ _id: LeadSource; count: number }>([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]),
  ]);

  const countBySource = new Map(counts.map((count) => [count._id, count.count]));
  const totalCount = counts.reduce((sum, count) => sum + count.count, 0);

  const plainLeads = toPlainArray(leads) as unknown as Pick<
    LeadType,
    | "id"
    | "serial_number"
    | "name"
    | "email"
    | "phone"
    | "company_name"
    | "source"
    | "message"
    | "status"
    | "created_at"
    | "service_interest"
  >[];

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brand-navy">Leads</h1>
          <p className="mt-1 font-sans text-sm text-slate-500">
            {activeSource
              ? `${plainLeads.length} ${LEAD_SOURCE_LABELS[activeSource]} lead${plainLeads.length === 1 ? "" : "s"}`
              : `${plainLeads.length} leads`}
          </p>
        </div>
      </div>

      <LeadOutreachManager
        leads={plainLeads}
        activeSource={activeSource}
        totalCount={totalCount}
        countBySource={Object.fromEntries(
          LEAD_SOURCES.map((leadSource) => [leadSource, countBySource.get(leadSource) ?? 0])
        ) as Partial<Record<LeadSource, number>>}
      />
    </div>
  );
}
