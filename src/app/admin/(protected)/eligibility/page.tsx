import type { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlainArray } from "@/lib/serialize";
import { EligibilitySubmission } from "@/models/EligibilitySubmission";
import EligibilityCard from "@/components/admin/EligibilityCard";
import type { EligibilitySubmission as EligibilitySubmissionType } from "@/types";

export const metadata: Metadata = { title: "Eligibility Forms, Be IPO Ready Admin" };

export const dynamic = "force-dynamic";

export default async function AdminEligibilityPage() {
  await connectToDatabase();
  const rows = toPlainArray(
    await EligibilitySubmission.find().sort({ created_at: -1 }).limit(100).lean()
  ) as unknown as EligibilitySubmissionType[];

  const fileLinks = new Map<string, string>();
  for (const row of rows) {
    if (row.financials_file_path) {
      fileLinks.set(
        row.id,
        `/api/admin/eligibility-docs/${row.financials_file_path
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`
      );
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Eligibility Forms</h1>
        <p className="font-sans text-sm text-slate-500 mt-1">
          {`${rows.length} "Get Listed" submissions (most recent 100)`}
        </p>
      </div>

      {rows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
          {rows.map((row) => (
            <EligibilityCard
              key={row.id}
              row={row}
              signedUrl={fileLinks.get(row.id) ?? null}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-4 py-12 text-center text-slate-400 text-sm">
          No eligibility submissions yet.
        </div>
      )}
    </div>
  );
}
