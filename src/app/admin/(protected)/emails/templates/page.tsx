import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EmailTemplateGrid from "@/components/admin/EmailTemplateGrid";
import { PageHeader } from "@/components/admin/cms/FormControls";
import { getEffectiveTemplates } from "@/lib/email-template-store";
import { connectToDatabase } from "@/lib/mongodb";

export const metadata: Metadata = { title: "Email Templates - Be IPO Ready Admin" };

export default async function EmailTemplatesPage() {
  await connectToDatabase();
  const templates = await getEffectiveTemplates();

  return (
    <div className="p-8">
      <Link
        href="/admin/emails"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-brand-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Email Center
      </Link>

      <PageHeader
        eyebrow="Communication"
        title="Email Templates"
        description="Preview every template exactly as it sends, and customize the subject and message. Customizations apply immediately to the welcome email and to the template picker in Email Center."
      />

      <EmailTemplateGrid templates={templates} />
    </div>
  );
}
