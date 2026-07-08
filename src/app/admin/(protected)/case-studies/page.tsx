import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Field,
  ImagePreview,
  PageHeader,
  Select,
  SubmitRow,
  TextArea,
  cardClass,
  statuses,
} from "@/components/admin/cms/FormControls";
import { deleteCaseStudy, saveCaseStudy } from "../cms/actions";

export const metadata: Metadata = { title: "Case Studies - Be IPO Ready Admin" };

export default async function CaseStudiesPage() {
  const casesResult = await createAdminClient()
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false });
  const cases = casesResult.data ?? [];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="Case Studies"
        description="Control case study pages, listing results, readiness scores, cover images, and client quotes."
      />

      <div className="grid gap-6">
        <form action={saveCaseStudy} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New Case Study</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            <Field label="Company" name="company_name" required />
            <Field label="Slug" name="slug" placeholder="auto-created if blank" />
            <Field label="Industry" name="industry" />
            <Field label="Cover Image URL" name="cover_image_url" />
            <Field label="Exchange" name="exchange" />
            <Field label="Issue Size" name="ipo_size" />
            <Field label="Subscription" name="subscription" />
            <Field label="Readiness Score" name="readiness_score" type="number" />
            <Select label="Status" name="status" options={statuses} />
          </div>
          <div className="mt-4 grid gap-4">
            <TextArea label="Outcome" name="outcome" rows={2} />
            <TextArea label="Summary" name="summary" rows={3} />
            <TextArea label="Challenge" name="challenge" rows={3} />
            <TextArea label="Approach (one step per line)" name="approach" rows={5} />
            <TextArea label="Result" name="result" rows={3} />
            <TextArea label="Testimonial Quote" name="testimonial_quote" rows={2} />
            <Field label="Testimonial Author" name="testimonial_author" />
          </div>
          <SubmitRow />
        </form>

        {cases.map((cs) => (
          <form key={cs.id} action={saveCaseStudy} className={cardClass}>
            <input type="hidden" name="id" value={cs.id} />
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{cs.company_name}</h2>
                <p className="mt-1 text-xs text-slate-400">/{cs.slug}</p>
              </div>
              <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {cs.status}
              </span>
            </div>
            <ImagePreview url={cs.cover_image_url} label={`${cs.company_name} cover image`} />
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Field label="Company" name="company_name" defaultValue={cs.company_name} required />
              <Field label="Slug" name="slug" defaultValue={cs.slug} />
              <Field label="Industry" name="industry" defaultValue={cs.industry} />
              <Field label="Cover Image URL" name="cover_image_url" defaultValue={cs.cover_image_url} />
              <Field label="Exchange" name="exchange" defaultValue={cs.exchange} />
              <Field label="Issue Size" name="ipo_size" defaultValue={cs.ipo_size} />
              <Field label="Subscription" name="subscription" defaultValue={cs.subscription} />
              <Field label="Readiness Score" name="readiness_score" type="number" defaultValue={cs.readiness_score} />
              <Select label="Status" name="status" defaultValue={cs.status} options={statuses} />
            </div>
            <div className="mt-4 grid gap-4">
              <TextArea label="Outcome" name="outcome" defaultValue={cs.outcome} rows={2} />
              <TextArea label="Summary" name="summary" defaultValue={cs.summary} rows={3} />
              <TextArea label="Challenge" name="challenge" defaultValue={cs.challenge} rows={3} />
              <TextArea label="Approach (one step per line)" name="approach" defaultValue={cs.approach?.join("\n")} rows={5} />
              <TextArea label="Result" name="result" defaultValue={cs.result} rows={3} />
              <TextArea label="Testimonial Quote" name="testimonial_quote" defaultValue={cs.testimonial_quote} rows={2} />
              <Field label="Testimonial Author" name="testimonial_author" defaultValue={cs.testimonial_author} />
            </div>
            <SubmitRow deleteAction={deleteCaseStudy} id={cs.id} />
          </form>
        ))}
      </div>
    </div>
  );
}
