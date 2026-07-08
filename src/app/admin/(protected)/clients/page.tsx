import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Checkbox,
  Field,
  ImagePreview,
  PageHeader,
  SubmitRow,
  cardClass,
  inputClass,
  labelClass,
} from "@/components/admin/cms/FormControls";
import { deleteClient, saveClient } from "../cms/actions";

export const metadata: Metadata = { title: "Our Clients - Be IPO Ready Admin" };

export default async function ClientsPage() {
  const clientsResult = await createAdminClient()
    .from("clients")
    .select("*")
    .order("sort_order", { ascending: true });
  const clients = clientsResult.data ?? [];
  const errorMessage = clientsResult.error?.message;

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="Our Clients"
        description="Upload and manage client logos shown in the homepage carousel. Published clients update live after save."
      />

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Clients table is not available in Supabase yet.</p>
          <p className="mt-1">{errorMessage}</p>
          <p className="mt-2">
            Apply the migration in <span className="font-mono">supabase/migrations/20260619010000_cms_content_controls.sql</span>,
            then refresh this page.
          </p>
        </div>
      )}

      {errorMessage ? null : (
        <>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total clients</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">{clients.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Published</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            {clients.filter((client) => client.is_published).length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Hidden</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            {clients.filter((client) => !client.is_published).length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveClient} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New Client</h2>
          <div className="grid gap-4">
            <Field label="Client / Company Name" name="name" required />
            <Field label="Nature of Business" name="nature_of_business" placeholder="e.g. Stock Broker" />
            <label className="block">
              <span className={labelClass}>Logo Image</span>
              <input name="logo_file" type="file" accept="image/*" required className={inputClass} />
            </label>
            <Field label="Website Link" name="website_url" placeholder="optional" />
            <Field label="Sort Order" name="sort_order" type="number" defaultValue={0} />
            <Checkbox label="Published" name="is_published" defaultChecked />
            <SubmitRow saveLabel="Upload / Save" />
          </div>
        </form>

        {clients.map((client) => (
          <form key={client.id} action={saveClient} className={cardClass}>
            <input type="hidden" name="id" value={client.id} />
            <input type="hidden" name="current_logo_url" value={client.logo_url} />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{client.name}</h2>
                {client.nature_of_business && (
                  <p className="mt-1 text-xs font-semibold text-slate-500">{client.nature_of_business}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">{client.website_url ?? "No website link"}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {client.is_published ? "live" : "hidden"}
              </span>
            </div>
            <ImagePreview url={client.logo_url} label={`${client.name} logo`} fit="contain" />
            <div className="mt-4 grid gap-4">
              <Field label="Client / Company Name" name="name" defaultValue={client.name} required />
              <Field label="Nature of Business" name="nature_of_business" defaultValue={client.nature_of_business} />
              <label className="block">
                <span className={labelClass}>Replace Logo Image</span>
                <input name="logo_file" type="file" accept="image/*" className={inputClass} />
              </label>
              <Field label="Website Link" name="website_url" defaultValue={client.website_url} />
              <Field label="Sort Order" name="sort_order" type="number" defaultValue={client.sort_order} />
              <Checkbox label="Published" name="is_published" defaultChecked={client.is_published} />
              <SubmitRow deleteAction={deleteClient} id={client.id} />
            </div>
          </form>
        ))}
      </div>
        </>
      )}
    </div>
  );
}
