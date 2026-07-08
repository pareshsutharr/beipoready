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
  faqCategories,
} from "@/components/admin/cms/FormControls";
import { deleteFaq, saveFaq } from "../cms/actions";

export const metadata: Metadata = { title: "FAQs - Be IPO Ready Admin" };

export default async function FaqsPage() {
  const faqsResult = await createAdminClient()
    .from("faqs")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  const faqs = faqsResult.data ?? [];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="FAQs"
        description="Manage public FAQ answers and order them by category. Published FAQs update the FAQ page immediately."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form action={saveFaq} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New FAQ</h2>
          <div className="grid gap-4">
            <Field label="Question" name="question" required />
            <TextArea label="Answer" name="answer" rows={4} required />
            <Select label="Category" name="category" options={faqCategories} />
            <Field label="Sort Order" name="sort_order" type="number" defaultValue={0} />
            <Checkbox label="Published" name="is_published" defaultChecked />
            <SubmitRow />
          </div>
        </form>

        {faqs.map((faq) => (
          <form key={faq.id} action={saveFaq} className={cardClass}>
            <input type="hidden" name="id" value={faq.id} />
            <div className="grid gap-4">
              <Field label="Question" name="question" defaultValue={faq.question} required />
              <TextArea label="Answer" name="answer" defaultValue={faq.answer} rows={4} required />
              <Select label="Category" name="category" defaultValue={faq.category} options={faqCategories} />
              <Field label="Sort Order" name="sort_order" type="number" defaultValue={faq.sort_order} />
              <Checkbox label="Published" name="is_published" defaultChecked={faq.is_published} />
              <SubmitRow deleteAction={deleteFaq} id={faq.id} />
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
