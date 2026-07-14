import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  ADMIN_SESSION_COOKIE,
  hasHardcodedAdminSession,
} from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard, Be IPO Ready Admin" };

async function getStats(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [totalLeads, newLeads, contactLeads, toolLeads] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("source", "contact"),
    supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .in("source", ["readiness-tool", "issue-size-calculator"]),
  ]);

  return {
    total: totalLeads.count ?? 0,
    new: newLeads.count ?? 0,
    contact: contactLeads.count ?? 0,
    tools: toolLeads.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const hasAdminCookie = hasHardcodedAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  );
  const supabase = hasAdminCookie ? createAdminClient() : await createClient();
  const stats = await getStats(supabase);

  const STAT_CARDS = [
    { label: "Total Leads", value: stats.total, color: "text-brand-navy" },
    { label: "New (Unread)", value: stats.new, color: "text-amber-600" },
    { label: "Contact Form", value: stats.contact, color: "text-blue-600" },
    { label: "From Tools", value: stats.tools, color: "text-emerald-600" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-navy">Dashboard</h1>
        <p className="font-sans text-sm text-slate-500 mt-1">Overview of leads and site activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              {stat.label}
            </p>
            <p className={`font-heading text-4xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-heading text-base font-bold text-brand-navy mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-navy/90 transition-colors"
          >
            View All Leads →
          </a>
          <a
            href="/admin/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy text-sm font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Blogs →
          </a>
          <a
            href="/admin/testimonials"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Testimonials →
          </a>
          <a
            href="/admin/clients"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Our Clients →
          </a>
          <a
            href="/admin/alerts"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Alerts →
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            View Website ↗
          </a>
        </div>
      </div>
    </div>
  );
}
