"use server";

import { revalidatePath } from "next/cache";
import { isCustomizableTemplateKey } from "@/lib/email-templates";
import { connectToDatabase } from "@/lib/mongodb";
import { EmailTemplate } from "@/models/EmailTemplate";

export type TemplateActionState = { ok: boolean; error: string | null };

export async function saveEmailTemplate(
  _prevState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  const key = String(formData.get("key") ?? "");
  const mode = String(formData.get("mode") ?? "text") === "html" ? "html" : "text";
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const htmlBody = String(formData.get("htmlBody") ?? "").trim();

  if (!isCustomizableTemplateKey(key)) return { ok: false, error: "Unknown template." };
  if (!subject) return { ok: false, error: "Subject is required." };
  if (mode === "html" && !htmlBody) return { ok: false, error: "HTML content is required." };
  if (mode === "text" && !body) return { ok: false, error: "Message is required." };

  await connectToDatabase();
  // Each mode's content persists independently — saving from the code tab never
  // clobbers the text draft, and vice versa. `format` picks which one is live.
  const update: Record<string, string> = { subject, format: mode };
  if (mode === "html") update.htmlBody = htmlBody;
  else update.body = body;

  await EmailTemplate.updateOne({ key }, { $set: update }, { upsert: true });
  revalidatePath("/admin/emails/templates");
  revalidatePath("/admin/emails");

  return { ok: true, error: null };
}

export async function resetEmailTemplate(
  _prevState: TemplateActionState,
  formData: FormData
): Promise<TemplateActionState> {
  const key = String(formData.get("key") ?? "");
  if (!isCustomizableTemplateKey(key)) return { ok: false, error: "Unknown template." };

  await connectToDatabase();
  await EmailTemplate.deleteOne({ key });
  revalidatePath("/admin/emails/templates");
  revalidatePath("/admin/emails");

  return { ok: true, error: null };
}
