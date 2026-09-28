import {
  buildEmailHtmlTemplate,
  buildEmailTemplate,
  CUSTOMIZABLE_TEMPLATE_KEYS,
  EMAIL_TEMPLATE_LABELS,
  type CustomizableTemplateKey,
  type EmailTemplateFormat,
} from "@/lib/email-templates";
import { EmailTemplate } from "@/models/EmailTemplate";

export type EffectiveEmailTemplate = {
  key: CustomizableTemplateKey;
  label: string;
  subject: string;
  /** Effective plain-message body: the saved override if any, else the hardcoded default. */
  body: string;
  /** Effective HTML fragment body: the saved override if any, else the designed default scaffold. */
  htmlBody: string;
  /** Which of body/htmlBody is used when this template is applied for sending. */
  format: EmailTemplateFormat;
  defaultSubject: string;
  defaultBody: string;
  defaultHtmlBody: string;
  isCustomized: boolean;
  updatedAt: string | null;
};

/** All customizable templates, merging each one's saved override (if any) over its hardcoded default. */
export async function getEffectiveTemplates(): Promise<EffectiveEmailTemplate[]> {
  const overrides = await EmailTemplate.find({ key: { $in: CUSTOMIZABLE_TEMPLATE_KEYS } }).lean();
  const overrideByKey = new Map(overrides.map((override) => [override.key, override]));

  return CUSTOMIZABLE_TEMPLATE_KEYS.map((key) => {
    const defaults = buildEmailTemplate(key);
    const defaultHtmlBody = buildEmailHtmlTemplate(key);
    const override = overrideByKey.get(key);

    return {
      key,
      label: EMAIL_TEMPLATE_LABELS[key],
      subject: override?.subject ?? defaults.subject,
      body: override?.body ?? defaults.body,
      htmlBody: override?.htmlBody || defaultHtmlBody,
      format: (override?.format as EmailTemplateFormat) ?? "text",
      defaultSubject: defaults.subject,
      defaultBody: defaults.body,
      defaultHtmlBody,
      isCustomized: Boolean(override),
      updatedAt: override?.updated_at ? new Date(override.updated_at).toISOString() : null,
    };
  });
}

/** A single template's effective (customized-if-saved, else default) content, in whichever format is active. */
export async function getEffectiveTemplate(key: CustomizableTemplateKey) {
  const override = await EmailTemplate.findOne({ key }).lean();
  const defaults = buildEmailTemplate(key);
  const format: EmailTemplateFormat = (override?.format as EmailTemplateFormat) ?? "text";

  return {
    subject: override?.subject ?? defaults.subject,
    body: format === "html" ? override?.htmlBody || buildEmailHtmlTemplate(key) : override?.body ?? defaults.body,
    format,
  };
}
