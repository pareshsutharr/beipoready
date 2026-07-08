import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Checkbox,
  Field,
  ImagePreview,
  PageHeader,
  SubmitRow,
  TextArea,
  cardClass,
} from "@/components/admin/cms/FormControls";
import { deleteTestimonial, saveTestimonial } from "../cms/actions";

export const metadata: Metadata = { title: "Testimonials - Be IPO Ready Admin" };

export default async function TestimonialsPage() {
  const testimonialsResult = await createAdminClient()
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  const testimonials = testimonialsResult.data ?? [];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Manage client quotes, company names, industries, outcomes, and optional testimonial images shown on the home page."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveTestimonial} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New Testimonial</h2>
          <div className="grid gap-4">
            <Field label="Client Name" name="client_name" required />
            <Field label="Client Title" name="client_title" />
            <Field label="Company Name" name="company_name" />
            <Field label="Industry" name="industry" />
            <Field label="Image URL" name="image_url" placeholder="client photo or company logo URL" />
            <TextArea label="Quote" name="quote" required />
            <Field label="Outcome" name="outcome" />
            <Field label="Case Study Slug" name="case_study_slug" />
            <Field label="Sort Order" name="sort_order" type="number" defaultValue={0} />
            <Checkbox label="Published" name="is_published" defaultChecked />
            <SubmitRow />
          </div>
        </form>

        {testimonials.map((item) => (
          <form key={item.id} action={saveTestimonial} className={cardClass}>
            <input type="hidden" name="id" value={item.id} />
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{item.client_name}</h2>
                <p className="mt-1 text-xs text-slate-400">{item.company_name ?? item.client_title ?? "Client testimonial"}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.is_published ? "live" : "hidden"}
              </span>
            </div>
            <ImagePreview url={item.image_url} label={`${item.client_name} testimonial image`} />
            <div className="mt-4 grid gap-4">
              <Field label="Client Name" name="client_name" defaultValue={item.client_name} required />
              <Field label="Client Title" name="client_title" defaultValue={item.client_title} />
              <Field label="Company Name" name="company_name" defaultValue={item.company_name} />
              <Field label="Industry" name="industry" defaultValue={item.industry} />
              <Field label="Image URL" name="image_url" defaultValue={item.image_url} />
              <TextArea label="Quote" name="quote" defaultValue={item.quote} required />
              <Field label="Outcome" name="outcome" defaultValue={item.outcome} />
              <Field label="Case Study Slug" name="case_study_slug" defaultValue={item.case_study_slug} />
              <Field label="Sort Order" name="sort_order" type="number" defaultValue={item.sort_order} />
              <Checkbox label="Published" name="is_published" defaultChecked={item.is_published} />
              <SubmitRow deleteAction={deleteTestimonial} id={item.id} />
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
