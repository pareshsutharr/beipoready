import type { Metadata } from "next";
import Link from "next/link";
import { LayoutTemplate } from "lucide-react";
import EmailCenterManager from "@/components/admin/EmailCenterManager";
import EmailSettingsPanel from "@/components/admin/EmailSettingsPanel";
import { PageHeader } from "@/components/admin/cms/FormControls";
import { getSmtpStatus } from "@/lib/email";
import { getEffectiveTemplates } from "@/lib/email-template-store";
import { isLeadSource, LEAD_SOURCES } from "@/lib/lead-meta";
import { connectToDatabase } from "@/lib/mongodb";
import { toPlainArray } from "@/lib/serialize";
import { Lead } from "@/models/Lead";
import { OutboundEmailCampaign } from "@/models/OutboundEmailCampaign";
import { EmailTrackingEvent } from "@/models/EmailTrackingEvent";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import type { CustomizableTemplateKey } from "@/lib/email-templates";
import type { LeadSource, OutboundEmailCampaign as OutboundEmailCampaignType } from "@/types";

export const metadata: Metadata = { title: "Emails - Be IPO Ready Admin" };

export default async function AdminEmailsPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string }>;
}) {
  const { source } = await searchParams;
  const defaultSource = source && isLeadSource(source) ? source : null;

  await connectToDatabase();

  const [counts, campaigns, subscriberCounts, effectiveTemplates] = await Promise.all([
    Lead.aggregate<{ _id: LeadSource; count: number }>([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]),
    OutboundEmailCampaign.find()
      .sort({ created_at: -1 })
      .limit(20)
      .lean(),
    NewsletterSubscriber.aggregate<{ _id: "subscribed" | "unsubscribed"; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    getEffectiveTemplates(),
  ]);

  const templatesByKey = Object.fromEntries(
    effectiveTemplates.map((template) => [
      template.key,
      { subject: template.subject, body: template.body, htmlBody: template.htmlBody, format: template.format },
    ])
  ) as Record<CustomizableTemplateKey, { subject: string; body: string; htmlBody: string; format: "text" | "html" }>;

  const countBySource = new Map(counts.map((count) => [count._id, count.count]));
  const totalLeadCount = counts.reduce((sum, count) => sum + count.count, 0);

  const trackingTokens = campaigns.flatMap((campaign) =>
    (campaign.recipients ?? [])
      .map((recipient: { tracking_token?: string | null }) => recipient.tracking_token)
      .filter((token: string | null | undefined): token is string => Boolean(token))
  );

  const trackingEvents =
    trackingTokens.length > 0
      ? await EmailTrackingEvent.find({ token: { $in: trackingTokens } }, "token click_count").lean()
      : [];
  const trackingByToken = new Map(trackingEvents.map((event) => [event.token, event]));

  const campaignsWithAnalytics = campaigns.map((campaign) => {
    const recipients = (campaign.recipients ?? []).map((recipient: { tracking_token?: string | null }) => {
      const tracking = recipient.tracking_token ? trackingByToken.get(recipient.tracking_token) : null;
      return {
        ...recipient,
        click_count: tracking?.click_count ?? 0,
      };
    });

    return {
      ...campaign,
      recipients,
      clicked_count: recipients.filter((recipient: { click_count: number }) => recipient.click_count > 0).length,
    };
  });

  const plainCampaigns = toPlainArray(campaignsWithAnalytics) as unknown as OutboundEmailCampaignType[];
  const subscribedCount = subscriberCounts.find((row) => row._id === "subscribed")?.count ?? 0;
  const unsubscribedCount = subscriberCounts.find((row) => row._id === "unsubscribed")?.count ?? 0;

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          eyebrow="Communication"
          title="Email Center"
          description="Send emails to any address, target lead segments, and review delivery results from one place."
        />
        <Link
          href="/admin/emails/templates"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-navy transition hover:bg-slate-50"
        >
          <LayoutTemplate className="h-4 w-4" />
          Email Templates
        </Link>
      </div>

      <div className="mb-6">
        <EmailSettingsPanel
          status={getSmtpStatus()}
          subscribedCount={subscribedCount}
          unsubscribedCount={unsubscribedCount}
        />
      </div>

      <EmailCenterManager
        totalLeadCount={totalLeadCount}
        countBySource={Object.fromEntries(
          LEAD_SOURCES.map((leadSource) => [leadSource, countBySource.get(leadSource) ?? 0])
        ) as Partial<Record<LeadSource, number>>}
        initialCampaigns={plainCampaigns}
        defaultSource={defaultSource}
        templates={templatesByKey}
      />
    </div>
  );
}
