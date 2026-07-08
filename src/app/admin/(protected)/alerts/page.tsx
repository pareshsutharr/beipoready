import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Checkbox,
  Field,
  PageHeader,
  Select,
  SubmitRow,
  TextArea,
  cardClass,
  placements,
} from "@/components/admin/cms/FormControls";
import { deleteSiteAlert, saveSiteAlert } from "../cms/actions";

export const metadata: Metadata = { title: "Alerts - Be IPO Ready Admin" };

export default async function AlertsPage() {
  const alertsResult = await createAdminClient()
    .from("site_alerts")
    .select("*")
    .order("created_at", { ascending: false });
  const alerts = alertsResult.data ?? [];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Site Controls"
        title="Alerts & Popups"
        description="Manage live announcement banners and popup alerts. Active alerts appear immediately on the public website."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveSiteAlert} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New Alert</h2>
          <div className="grid gap-4">
            <Field label="Title" name="title" required />
            <TextArea label="Message" name="message" rows={3} required />
            <Field label="CTA Label" name="cta_label" />
            <Field label="CTA Link" name="cta_href" />
            <Select label="Placement" name="placement" options={placements} />
            <Checkbox label="Active" name="is_active" defaultChecked />
            <SubmitRow />
          </div>
        </form>

        {alerts.map((alert) => (
          <form key={alert.id} action={saveSiteAlert} className={cardClass}>
            <input type="hidden" name="id" value={alert.id} />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{alert.title}</h2>
                <p className="mt-1 text-xs text-slate-400">{alert.placement}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {alert.is_active ? "active" : "inactive"}
              </span>
            </div>
            <div className="grid gap-4">
              <Field label="Title" name="title" defaultValue={alert.title} required />
              <TextArea label="Message" name="message" defaultValue={alert.message} rows={3} required />
              <Field label="CTA Label" name="cta_label" defaultValue={alert.cta_label} />
              <Field label="CTA Link" name="cta_href" defaultValue={alert.cta_href} />
              <Select label="Placement" name="placement" defaultValue={alert.placement} options={placements} />
              <Checkbox label="Active" name="is_active" defaultChecked={alert.is_active} />
              <SubmitRow deleteAction={deleteSiteAlert} id={alert.id} />
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
