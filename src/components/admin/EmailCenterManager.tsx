"use client";

import { useMemo, useState } from "react";
import { Code2, Eye, Type } from "lucide-react";
import {
  DeliveryNotice,
  MailListRow,
  MailPanel,
  MailPanelHeader,
  SidebarGroupLabel,
  SidebarNavItem,
  TemplateChip,
  mailIcons,
} from "@/components/ui/email-command-center";
import {
  buildEmailHtmlTemplate,
  buildEmailTemplate,
  EMAIL_TEMPLATE_LABELS,
  type CustomizableTemplateKey,
  type EmailTemplateFormat,
  type EmailTemplateKey,
} from "@/lib/email-templates";
import { renderBrandedEmailHtml, stripHtmlToText } from "@/lib/email-layout";
import { SITE_URL } from "@/lib/seo";
import { LEAD_SOURCE_LABELS, LEAD_SOURCES } from "@/lib/lead-meta";
import type { LeadSource, OutboundEmailCampaign } from "@/types";

type TemplateContent = { subject: string; body: string; htmlBody: string; format: EmailTemplateFormat };

const PLACEHOLDER_FOOTER =
  'You\'re receiving this because you subscribed to Be IPO Ready updates. <a href="#" style="color:#64748B;">Unsubscribe</a>';

type CampaignRow = OutboundEmailCampaign;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEMPLATE_PLACEHOLDER_PATTERNS = [
  /^Article title:\s*$/m,
  /^Article link:\s*$/m,
  /^Key takeaway:\s*$/m,
  /^- Add your latest newsletter summary here\s*$/m,
  /^- Add the article or landing page link here\s*$/m,
  /^- Add the next step or CTA here\s*$/m,
  /^- Add your update here\s*$/m,
  /^- Add any requested document or article link here\s*$/m,
  /^- Add your CTA or meeting request here\s*$/m,
];

function parseRecipients(input: string) {
  const seen = new Set<string>();
  const recipients: string[] = [];

  for (const rawPart of input.split(/[\n,;]+/)) {
    const email = rawPart.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email) || seen.has(email)) continue;
    seen.add(email);
    recipients.push(email);
  }

  return recipients;
}

function previewBody(body: string, format?: EmailTemplateFormat) {
  const plain = format === "html" ? stripHtmlToText(body) : body;
  const normalized = plain.replace(/\s+/g, " ").trim();
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 117)}...`;
}

function validateEmailDraft(templateKey: EmailTemplateKey, subject: string, body: string, format: EmailTemplateFormat) {
  const trimmedSubject = subject.trim();
  const trimmedBody = body.trim();
  const defaultTemplate = buildEmailTemplate(templateKey);
  const defaultBody = format === "html" && templateKey !== "custom" ? buildEmailHtmlTemplate(templateKey) : defaultTemplate.body;

  if (!trimmedSubject) {
    return "Subject is required.";
  }

  if (!trimmedBody) {
    return "Message is required.";
  }

  if (trimmedSubject === defaultTemplate.subject.trim() && trimmedBody === defaultBody.trim()) {
    return "Update the template before sending. Unchanged placeholder copy is more likely to be blocked.";
  }

  if (format === "text" && TEMPLATE_PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmedBody))) {
    return "Replace the placeholder sections like article title, link, and takeaways before sending.";
  }

  return null;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EmailCenterManager({
  totalLeadCount,
  countBySource,
  initialCampaigns,
  defaultSource,
  templates,
}: {
  totalLeadCount: number;
  countBySource: Partial<Record<LeadSource, number>>;
  initialCampaigns: CampaignRow[];
  defaultSource: LeadSource | null;
  templates: Record<CustomizableTemplateKey, TemplateContent>;
}) {
  const [audienceKind, setAudienceKind] = useState<"manual" | "leads">(defaultSource ? "leads" : "manual");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">(defaultSource ?? "all");
  const [manualRecipients, setManualRecipients] = useState("");
  const [templateKey, setTemplateKey] = useState<EmailTemplateKey>("new-article");
  const [subject, setSubject] = useState(templates["new-article"].subject);
  const [format, setFormat] = useState<EmailTemplateFormat>(templates["new-article"].format);
  const [body, setBody] = useState(
    templates["new-article"].format === "html" ? templates["new-article"].htmlBody : templates["new-article"].body
  );
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);
  const [sendCopyToSender, setSendCopyToSender] = useState(false);
  const [sendStatus, setSendStatus] = useState("");
  const [sendError, setSendError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [openCampaignId, setOpenCampaignId] = useState<string | null>(null);

  const manualRecipientList = useMemo(() => parseRecipients(manualRecipients), [manualRecipients]);
  const selectedLeadCount = sourceFilter === "all" ? totalLeadCount : countBySource[sourceFilter] ?? 0;
  const currentRecipientCount = audienceKind === "manual" ? manualRecipientList.length : selectedLeadCount;
  const currentAudienceLabel =
    audienceKind === "manual"
      ? "Manual recipients"
      : sourceFilter === "all"
        ? "All leads"
        : `${LEAD_SOURCE_LABELS[sourceFilter]} leads`;

  function applyTemplate(nextTemplate: EmailTemplateKey) {
    if (nextTemplate === "custom") {
      const next = buildEmailTemplate(nextTemplate);
      setTemplateKey(nextTemplate);
      setSubject(next.subject);
      setFormat("text");
      setBody(next.body);
      return;
    }

    const next = templates[nextTemplate];
    setTemplateKey(nextTemplate);
    setSubject(next.subject);
    setFormat(next.format);
    setBody(next.format === "html" ? next.htmlBody : next.body);
  }

  async function handleSend() {
    const recipients = audienceKind === "manual" ? manualRecipientList : [];

    if (audienceKind === "manual" && recipients.length === 0) {
      setSendError("Add at least one valid email address.");
      setSendStatus("");
      return;
    }

    if (audienceKind === "leads" && currentRecipientCount === 0) {
      setSendError("This lead audience does not have any recipients yet.");
      setSendStatus("");
      return;
    }

    const validationError = validateEmailDraft(templateKey, subject, body, format);
    if (validationError) {
      setSendError(validationError);
      setSendStatus("");
      return;
    }

    const confirmed = window.confirm(
      `Send "${subject.trim()}" to ${currentRecipientCount} recipient${currentRecipientCount === 1 ? "" : "s"} in ${currentAudienceLabel}?`
    );

    if (!confirmed) return;

    setIsSending(true);
    setSendError("");
    setSendStatus("");

    try {
      const response = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audienceKind,
          audienceLabel: currentAudienceLabel,
          sourceFilter: audienceKind === "leads" && sourceFilter !== "all" ? sourceFilter : null,
          recipients,
          subject,
          body,
          format,
          sendCopyToSender,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            ok?: boolean;
            sentCount?: number;
            failedCount?: number;
            copySent?: boolean;
            copyFailed?: boolean;
            campaign?: CampaignRow;
            error?: string;
          }
        | null;

      if (!response.ok || !data?.ok || !data.campaign) {
        throw new Error(data?.error || "Email sending failed.");
      }

      setCampaigns((current) => [data.campaign as CampaignRow, ...current].slice(0, 20));
      setOpenCampaignId(data.campaign.id);
      setSendStatus(
        `Processed ${data.campaign.attempted_count} recipient${data.campaign.attempted_count === 1 ? "" : "s"}: ${data.sentCount ?? 0} sent, ${data.failedCount ?? 0} failed.${sendCopyToSender ? ` Your copy was ${data.copySent ? "sent" : data.copyFailed ? "not sent" : "not requested"}.` : ""}`
      );
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Email sending failed.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <SidebarGroupLabel>Send to</SidebarGroupLabel>
          <SidebarNavItem
            active={audienceKind === "manual"}
            icon={mailIcons.manual}
            label="Anyone (manual)"
            onClick={() => setAudienceKind("manual")}
          />
          <SidebarNavItem
            active={audienceKind === "leads"}
            icon={mailIcons.leads}
            label="Lead segment"
            onClick={() => setAudienceKind("leads")}
          />
        </div>

        {audienceKind === "leads" ? (
          <div className="rounded-xl border border-slate-200 bg-white p-2">
            <SidebarGroupLabel>Segments</SidebarGroupLabel>
            <SidebarNavItem
              active={sourceFilter === "all"}
              label="All leads"
              count={totalLeadCount}
              onClick={() => setSourceFilter("all")}
            />
            {LEAD_SOURCES.map((source) => (
              <SidebarNavItem
                key={source}
                active={sourceFilter === source}
                label={LEAD_SOURCE_LABELS[source]}
                count={countBySource[source] ?? 0}
                onClick={() => setSourceFilter(source)}
              />
            ))}
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
          Gmail decides inbox vs. spam on its own. Keep subject lines specific, avoid all caps and excessive
          links, and send a small test batch to yourself before a large campaign.
        </div>
      </aside>

      <main className="space-y-6">
        <MailPanel>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">To</p>
              <p className="mt-0.5 truncate text-sm font-medium text-brand-navy">
                {currentAudienceLabel} · {currentRecipientCount} recipient{currentRecipientCount === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(EMAIL_TEMPLATE_LABELS).map(([value, label]) => (
                <TemplateChip
                  key={value}
                  active={templateKey === value}
                  label={label}
                  onClick={() => applyTemplate(value as EmailTemplateKey)}
                />
              ))}
            </div>
          </div>

          {audienceKind === "manual" ? (
            <div className="border-b border-slate-100 px-5 py-3">
              <textarea
                value={manualRecipients}
                onChange={(event) => setManualRecipients(event.target.value)}
                rows={2}
                placeholder="founder@company.com, investor@company.com"
                className="w-full resize-none border-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
          ) : null}

          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-3">
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              className="w-full border-0 bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {format === "html" ? (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <Code2 className="h-3 w-3" />
                HTML
              </span>
            ) : null}
          </div>

          {format === "html" ? (
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  HTML content (wrapped in the branded header/footer automatically)
                </span>
                <button
                  type="button"
                  onClick={() => setShowHtmlPreview((current) => !current)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-brand-navy transition hover:bg-slate-50"
                >
                  {showHtmlPreview ? <Type className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showHtmlPreview ? "Edit code" : "Preview"}
                </button>
              </div>
              {showHtmlPreview ? (
                <div className="h-[420px] overflow-hidden rounded-lg border border-slate-200">
                  <iframe
                    srcDoc={renderBrandedEmailHtml({
                      preheader: subject,
                      contentHtml: body || "<p>&nbsp;</p>",
                      footerHtml: PLACEHOLDER_FOOTER,
                      logoUrl: `${SITE_URL}/logo-transparent.png`,
                      siteUrl: SITE_URL,
                    })}
                    title="Email HTML preview"
                    sandbox=""
                    className="h-full w-full bg-[#F7F3EA]"
                  />
                </div>
              ) : (
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={16}
                  spellCheck={false}
                  placeholder="Write the email HTML here — <img>, buttons, tables, etc."
                  className="w-full resize-y rounded-lg border border-slate-200 bg-slate-900 px-3 py-2.5 font-mono text-[12.5px] leading-5 text-slate-100 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                />
              )}
            </div>
          ) : (
            <div className="px-5 py-4">
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                rows={14}
                placeholder="Write the email message here"
                className="w-full resize-none border-0 bg-transparent text-sm leading-6 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {mailIcons.send}
                {isSending ? "Sending..." : "Send"}
              </button>
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input
                  type="checkbox"
                  checked={sendCopyToSender}
                  onChange={(event) => setSendCopyToSender(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-gold"
                />
                Send me a copy
              </label>
            </div>
            <button
              type="button"
              onClick={() => applyTemplate(templateKey)}
              className="text-sm font-medium text-slate-500 transition hover:text-brand-navy"
            >
              Discard draft
            </button>
          </div>

          {sendStatus || sendError ? (
            <div className="space-y-3 px-5 pb-5">
              {sendStatus ? <DeliveryNotice tone="success" text={sendStatus} /> : null}
              {sendError ? <DeliveryNotice tone="error" text={sendError} /> : null}
            </div>
          ) : null}
        </MailPanel>

        <MailPanel>
          <MailPanelHeader title="Sent" description="Every campaign is logged per recipient." />

          {campaigns.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
                <MailListRow
                  key={campaign.id}
                  subject={campaign.subject}
                  snippet={previewBody(campaign.body, campaign.format)}
                  meta={`${campaign.sent_count}/${campaign.attempted_count} sent${
                    campaign.clicked_count ? ` · ${campaign.clicked_count} clicked` : ""
                  } · ${formatDate(campaign.created_at)}`}
                  status={campaign.status}
                  open={openCampaignId === campaign.id}
                  onToggle={() =>
                    setOpenCampaignId((current) => (current === campaign.id ? null : campaign.id))
                  }
                >
                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span>{campaign.initiated_by_email}</span>
                    <span>{campaign.audience_kind === "leads" ? "Lead audience" : "Manual list"}</span>
                    {campaign.source_filter ? <span>{campaign.source_filter}</span> : null}
                    {campaign.send_copy_to_sender && campaign.copy_recipient ? (
                      <span>{`Copy: ${campaign.copy_status === "sent" ? "sent" : campaign.copy_status === "failed" ? "failed" : "pending"} to ${campaign.copy_recipient}`}</span>
                    ) : null}
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="w-full min-w-[640px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                          <th className="px-3 py-2">Email</th>
                          <th className="px-3 py-2">Status</th>
                          <th className="px-3 py-2">Clicked</th>
                          <th className="px-3 py-2">Lead Source</th>
                          <th className="px-3 py-2">Message ID</th>
                          <th className="px-3 py-2">Error / Response</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaign.recipients.map((recipient) => (
                          <tr key={`${campaign.id}-${recipient.email}`} className="border-b border-slate-100 align-top last:border-b-0">
                            <td className="px-3 py-2.5 font-medium text-brand-navy">{recipient.email}</td>
                            <td className="px-3 py-2.5">
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                                  recipient.status === "sent"
                                    ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                    : "border-red-200 bg-red-100 text-red-700"
                                }`}
                              >
                                {recipient.status}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-slate-500">
                              {recipient.tracking_token ? (recipient.click_count > 0 ? `Yes (${recipient.click_count})` : "No") : "—"}
                            </td>
                            <td className="px-3 py-2.5 text-slate-500">
                              {recipient.lead_source
                                ? LEAD_SOURCE_LABELS[recipient.lead_source as LeadSource] ?? recipient.lead_source
                                : "Manual"}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-slate-400">{recipient.message_id ?? "N/A"}</td>
                            <td className="px-3 py-2.5 text-xs text-slate-500">
                              {recipient.error ?? recipient.response ?? "Accepted by SMTP."}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </MailListRow>
              ))}
            </div>
          ) : (
            <div className="px-5 py-14 text-center text-sm text-slate-400">No email campaigns have been sent yet.</div>
          )}
        </MailPanel>
      </main>
    </div>
  );
}
