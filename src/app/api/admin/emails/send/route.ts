import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { sendBulkEmail } from "@/lib/email";
import { LEAD_SOURCE_LABELS, isLeadSource } from "@/lib/lead-meta";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlain } from "@/lib/serialize";
import { Lead } from "@/models/Lead";
import { OutboundEmailCampaign } from "@/models/OutboundEmailCampaign";
import { EmailTrackingEvent } from "@/models/EmailTrackingEvent";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import type { LeadSource } from "@/types";

type SendEmailRequest = {
  audienceKind?: unknown;
  audienceLabel?: unknown;
  sourceFilter?: unknown;
  recipients?: unknown;
  subject?: unknown;
  body?: unknown;
  format?: unknown;
  sendCopyToSender?: unknown;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const admin = await getAdminSession();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as SendEmailRequest | null;
  const audienceKind = payload?.audienceKind === "leads" ? "leads" : "manual";
  const subject = normalizeString(payload?.subject);
  const body = typeof payload?.body === "string" ? payload.body : "";
  const format = payload?.format === "html" ? "html" : "text";
  const sendCopyToSender = payload?.sendCopyToSender === true;
  const requestedSourceFilter = normalizeString(payload?.sourceFilter);
  const sourceFilter: LeadSource | null = isLeadSource(requestedSourceFilter) ? requestedSourceFilter : null;

  await connectToDatabase();

  let recipients: string[] = [];
  const leadSourceByEmail = new Map<string, string | null>();

  if (audienceKind === "leads") {
    const leads = await Lead.find(
      sourceFilter ? { source: sourceFilter } : {},
      "email source created_at"
    )
      .sort({ created_at: -1 })
      .lean();

    for (const lead of leads) {
      const email = typeof lead.email === "string" ? lead.email.trim().toLowerCase() : "";
      if (!email || leadSourceByEmail.has(email)) continue;
      leadSourceByEmail.set(email, typeof lead.source === "string" ? lead.source : null);
    }

    recipients = Array.from(leadSourceByEmail.keys());
  } else {
    recipients = Array.isArray(payload?.recipients)
      ? payload.recipients.filter((value): value is string => typeof value === "string")
      : [];
  }

  const audienceLabel =
    normalizeString(payload?.audienceLabel) ||
    (audienceKind === "leads"
      ? sourceFilter
        ? `${LEAD_SOURCE_LABELS[sourceFilter]} leads`
        : "All leads"
      : "Manual recipients");

  // Newsletter subscribers who unsubscribed must never receive a campaign, regardless of
  // which audience/segment pulled their email in.
  const knownSubscribers =
    recipients.length > 0
      ? await NewsletterSubscriber.find({ email: { $in: recipients } }, "email status unsubscribe_token").lean()
      : [];
  const subscriberByEmail = new Map(knownSubscribers.map((subscriber) => [subscriber.email, subscriber]));
  recipients = recipients.filter((email) => subscriberByEmail.get(email)?.status !== "unsubscribed");

  const unsubscribeTokens: Record<string, string> = {};
  for (const subscriber of knownSubscribers) {
    if (subscriber.status === "subscribed") unsubscribeTokens[subscriber.email] = subscriber.unsubscribe_token;
  }

  const track = audienceKind === "leads" && sourceFilter === "newsletter";
  // Only genuine segment campaigns read as bulk mail; a manually-entered recipient list
  // (typically the admin testing) should look like an ordinary single email.
  const bulk = audienceKind === "leads";

  try {
    const result = await sendBulkEmail({ recipients, subject, body, format, track, unsubscribeTokens, bulk });
    const copyResult = sendCopyToSender
      ? await sendBulkEmail({ recipients: [admin.email], subject, body, format })
      : null;
    const copyRecipientResult = copyResult?.recipientResults[0] ?? null;

    const campaign = await OutboundEmailCampaign.create({
      audience_kind: audienceKind,
      audience_label: audienceLabel,
      source_filter: sourceFilter,
      subject,
      body,
      format,
      initiated_by_email: admin.email,
      send_copy_to_sender: sendCopyToSender,
      copy_recipient: sendCopyToSender ? admin.email : null,
      copy_status: copyRecipientResult?.status ?? null,
      copy_message_id: copyRecipientResult?.messageId ?? null,
      copy_response: copyRecipientResult?.response ?? null,
      copy_error: copyRecipientResult?.error ?? null,
      attempted_count: result.attemptedCount,
      sent_count: result.sentCount,
      failed_count: result.failedCount,
      status: result.status,
      recipients: result.recipientResults.map((recipient) => ({
        email: recipient.email,
        lead_source: leadSourceByEmail.get(recipient.email) ?? null,
        status: recipient.status,
        message_id: recipient.messageId,
        response: recipient.response,
        error: recipient.error,
        tracking_token: recipient.trackingToken,
      })),
    });

    const trackedRecipients = result.recipientResults.filter((recipient) => recipient.trackingToken);
    if (trackedRecipients.length > 0) {
      await EmailTrackingEvent.insertMany(
        trackedRecipients.map((recipient) => ({
          token: recipient.trackingToken,
          email: recipient.email,
          kind: "campaign" as const,
          campaign_id: campaign._id,
        }))
      );
    }

    return NextResponse.json({
      ok: true,
      campaign: toPlain(campaign.toObject()),
      sentCount: result.sentCount,
      failedCount: result.failedCount,
      copySent: copyRecipientResult?.status === "sent",
      copyFailed: copyRecipientResult?.status === "failed",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email sending failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
