import { SITE_URL } from "@/lib/seo";
import { sendBulkEmail } from "@/lib/email";
import { deliverWhatsapp, type WhatsappRecipient } from "@/lib/whatsapp";
import { connectToDatabase } from "@/lib/mongodb";
import { NotificationSettings } from "@/models/NotificationSettings";

export type NotificationKind = "lead" | "newsletter" | "eligibility";

const TOGGLE_FIELD: Record<NotificationKind, "notify_on_lead" | "notify_on_newsletter" | "notify_on_eligibility"> = {
  lead: "notify_on_lead",
  newsletter: "notify_on_newsletter",
  eligibility: "notify_on_eligibility",
};

const ADMIN_PATH: Record<NotificationKind, string> = {
  lead: "/admin/leads",
  newsletter: "/admin/emails",
  eligibility: "/admin/eligibility",
};

type RawSettings = {
  notification_emails: string[] | null;
  whatsapp_recipients?: WhatsappRecipient[] | null;
  notify_on_lead: boolean;
  notify_on_newsletter: boolean;
  notify_on_eligibility: boolean;
} | null;

async function loadSettings(): Promise<RawSettings> {
  await connectToDatabase();
  return NotificationSettings.findOne().lean<RawSettings>();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Splits free-form textarea input (newline or comma separated) into a deduped list of valid-looking emails. */
export function parseEmailList(raw: string): string[] {
  const seen = new Set<string>();
  for (const candidate of raw.split(/[\n,]+/)) {
    const email = candidate.trim().toLowerCase();
    if (email && EMAIL_RE.test(email)) seen.add(email);
  }
  return Array.from(seen);
}

/** Plain settings for the admin settings form. Always returns defaults, never null fields. */
export async function getNotificationSettingsForAdmin() {
  const settings = await loadSettings();
  return {
    notification_emails: settings?.notification_emails ?? [],
    whatsapp_recipients: (settings?.whatsapp_recipients ?? []).map(({ phone, api_key }) => ({ phone, api_key })),
    notify_on_lead: settings?.notify_on_lead ?? true,
    notify_on_newsletter: settings?.notify_on_newsletter ?? true,
    notify_on_eligibility: settings?.notify_on_eligibility ?? true,
  };
}

function fieldsToBody(fields: Record<string, string | number | null | undefined>) {
  return Object.entries(fields)
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
    // Blank line after the lead serial so it stands apart from the lead details.
    .map(([label, value]) => `${label}: ${value}${label === "Lead No" ? "\n" : ""}`)
    .join("\n");
}

/**
 * Best-effort: emails the admin-configured address(es) and, if set, sends a WhatsApp alert
 * whenever a visitor takes an action (submits an enquiry/tool, subscribes, applies via the
 * eligibility form). Never throws — a missing address, a disabled toggle, or an SMTP/WhatsApp
 * failure must not break the caller's flow, and one channel failing doesn't block the other.
 */
export async function notifyAdmin(
  kind: NotificationKind,
  subject: string,
  fields: Record<string, string | number | null | undefined>
) {
  let settings: RawSettings;
  try {
    settings = await loadSettings();
  } catch (error) {
    console.error(`Admin notification (${kind}) failed to load settings:`, error);
    return;
  }
  if (settings && settings[TOGGLE_FIELD[kind]] === false) return;

  const body = fieldsToBody(fields);
  const adminUrl = `${SITE_URL}${ADMIN_PATH[kind]}`;
  const emails = settings?.notification_emails ?? [];
  const whatsappRecipients = (settings?.whatsapp_recipients ?? []).filter((r) => r.phone);
  const whatsappText = `*${subject}*\n\n${body}\n\n${adminUrl}`;

  await Promise.all([
    emails.length > 0
      ? sendBulkEmail({
          recipients: emails,
          subject,
          body,
          format: "text",
          ctaLabel: "View in Admin Panel",
          ctaUrl: adminUrl,
        }).catch((error) => console.error(`Admin email notification (${kind}) failed:`, error))
      : null,
    whatsappRecipients.length > 0
      ? deliverWhatsapp(whatsappRecipients, whatsappText).then(({ failed }) =>
          failed.forEach((f) => console.error(`Admin WhatsApp notification (${kind}) to ${f.phone} failed: ${f.error}`))
        )
      : null,
  ]);
}
