import type { Metadata } from "next";
import { Checkbox, PageHeader, SubmitRow, TextArea, cardClass } from "@/components/admin/cms/FormControls";
import { getNotificationSettingsForAdmin } from "@/lib/notify-admin";
import { getSmtpStatus } from "@/lib/email";
import { formatWhatsappRecipients } from "@/lib/whatsapp";
import WhatsappSendForm from "@/components/admin/WhatsappSendForm";
import WhatsappLinkPanel from "@/components/admin/WhatsappLinkPanel";
import { getLinkedWhatsappStatus } from "@/lib/whatsapp-link";
import { updateNotificationSettings } from "../cms/actions";

export const metadata: Metadata = { title: "Notifications - Be IPO Ready Admin" };

export default async function NotificationsPage() {
  const settings = await getNotificationSettingsForAdmin();
  const smtpStatus = getSmtpStatus();
  const linkedWhatsapp = await getLinkedWhatsappStatus();
  const whatsappLinked = linkedWhatsapp.status === "connected";

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Communication"
        title="Notifications"
        description="Auto-send an email (and a WhatsApp message) to these addresses the moment a visitor subscribes, submits an enquiry, uses a calculator/tool, or applies through the eligibility form."
      />

      {!smtpStatus.configured ? (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          SMTP is not configured on the server, so notifications can&apos;t be delivered yet. Set SMTP_HOST,
          SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM, then this will start working automatically.
        </div>
      ) : null}

      <WhatsappLinkPanel initial={linkedWhatsapp} />

      <form action={updateNotificationSettings} className={`${cardClass} max-w-xl`}>
        <div className="grid gap-4">
          <TextArea
            label="Notification emails"
            name="notification_emails"
            rows={3}
            defaultValue={settings.notification_emails.join("\n")}
            placeholder={"you@beipoready.com\nteammate@beipoready.com"}
          />
          <p className="-mt-3 text-xs text-slate-400">
            One email per line (or comma-separated). Every address gets every event below as soon as it happens.
            Leave blank to turn off email notifications.
          </p>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">WhatsApp numbers to alert</p>
            <TextArea
              label="WhatsApp numbers"
              name="whatsapp_recipients"
              rows={5}
              defaultValue={formatWhatsappRecipients(settings.whatsapp_recipients)}
              placeholder={"+919327334659\n+919374710429"}
            />
            <p className="mt-1 text-xs text-slate-400">
              One number per line. 10-digit numbers get +91 added. With WhatsApp linked above, every number here gets
              lead alerts from your linked number. Optional fallback when not linked: add a comma and that number&apos;s
              CallMeBot API key.
            </p>
            {settings.whatsapp_recipients.length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs">
                {settings.whatsapp_recipients.map((r) => {
                  const active = whatsappLinked || Boolean(r.api_key);
                  return (
                    <li key={r.phone} className={active ? "text-emerald-700" : "text-amber-700"}>
                      {r.phone} — {whatsappLinked ? "active (linked WhatsApp)" : r.api_key ? "active (CallMeBot)" : "inactive until WhatsApp is linked"}
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Notify me when a visitor…</p>
            <div className="space-y-2">
              <Checkbox
                label="Submits an enquiry or uses a tool (contact form, get-listed lead, readiness tool, calculators, checklist, services/case-study CTAs)"
                name="notify_on_lead"
                defaultChecked={settings.notify_on_lead}
              />
              <Checkbox
                label="Subscribes to the newsletter"
                name="notify_on_newsletter"
                defaultChecked={settings.notify_on_newsletter}
              />
              <Checkbox
                label="Applies via the eligibility / get-listed form"
                name="notify_on_eligibility"
                defaultChecked={settings.notify_on_eligibility}
              />
            </div>
          </div>

          <SubmitRow />
        </div>
      </form>

      <WhatsappSendForm phones={settings.whatsapp_recipients.map((r) => r.phone)} />
    </div>
  );
}
