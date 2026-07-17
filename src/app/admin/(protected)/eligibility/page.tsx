import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  hasHardcodedAdminSession,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import EligibilityCard from "@/components/admin/EligibilityCard";

export const metadata: Metadata = { title: "Eligibility Forms, Be IPO Ready Admin" };

export const dynamic = "force-dynamic";

export default async function AdminEligibilityPage() {
  const cookieStore = await cookies();
  const hasAdminCookie = hasHardcodedAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  );
  const supabase = hasAdminCookie ? createAdminClient() : await createClient();

  const { data: rows, error } = await supabase
    .from("eligibility_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // Signed download links (1 hour) for uploaded financial statements
  const fileLinks = new Map<string, string>();
  if (rows?.length) {
    for (const row of rows) {
      if (row.financials_file_path) {
        const { data } = await supabase.storage
          .from("eligibility-docs")
          .createSignedUrl(row.financials_file_path, 3600);
        if (data?.signedUrl) fileLinks.set(row.id, data.signedUrl);
      }
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Eligibility Forms</h1>
        <p className="font-sans text-sm text-slate-500 mt-1">
          {error
            ? "Error loading submissions."
            : `${rows?.length ?? 0} "Get Listed" submissions (most recent 100)`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="font-sans text-sm text-red-700">
            Failed to load submissions. Make sure the eligibility_submissions
            migration has been applied and RLS allows admin SELECT.
          </p>
        </div>
      )}

      {rows && rows.length > 0 ? (
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
          {error ? "Could not load submissions." : "No eligibility submissions yet."}
        </div>
      )}
    </div>
  );
}
