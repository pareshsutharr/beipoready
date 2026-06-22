import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Checkbox,
  Field,
  PageHeader,
  SubmitRow,
  cardClass,
} from "@/components/admin/cms/FormControls";
import { deleteSiteStat, saveSiteStat } from "../cms/actions";

export const metadata: Metadata = { title: "Stats - Be IPO Ready Admin" };

export default async function StatsPage() {
  const statsResult = await createAdminClient()
    .from("site_stats")
    .select("*")
    .order("sort_order", { ascending: true });
  const stats = statsResult.data ?? [];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Site Controls"
        title="Trust Stats"
        description="Edit the key metrics shown on the homepage hero/trust section. Published stats update live."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveSiteStat} className={cardClass}>
          <h2 className="mb-4 font-serif text-lg font-bold text-brand-navy">New Stat</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Value" name="value" required />
            <Field label="Label" name="label" required />
            <Field label="Sort Order" name="sort_order" type="number" defaultValue={0} />
            <Checkbox label="Published" name="is_published" defaultChecked />
          </div>
          <SubmitRow />
        </form>

        {stats.map((stat) => (
          <form key={stat.id} action={saveSiteStat} className={cardClass}>
            <input type="hidden" name="id" value={stat.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Value" name="value" defaultValue={stat.value} required />
              <Field label="Label" name="label" defaultValue={stat.label} required />
              <Field label="Sort Order" name="sort_order" type="number" defaultValue={stat.sort_order} />
              <Checkbox label="Published" name="is_published" defaultChecked={stat.is_published} />
            </div>
            <SubmitRow deleteAction={deleteSiteStat} id={stat.id} />
          </form>
        ))}
      </div>
    </div>
  );
}
