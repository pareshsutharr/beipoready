import { sendBulkEmail } from "@/lib/email";
import { EMAIL_BRAND, ctaButtonHtml, escapeHtml, headingHtml, imageHtml, paragraphHtml } from "@/lib/email-layout";
import { SITE_URL } from "@/lib/seo";
import { EmailTrackingEvent } from "@/models/EmailTrackingEvent";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber";
import { OutboundEmailCampaign } from "@/models/OutboundEmailCampaign";

type ContentType = "article" | "case study" | "service";

type SendContentAnnouncementInput = {
  contentType: ContentType;
  title: string;
  summary?: string | null;
  /** Full markdown-style body (same "## heading" / "### subheading" / "- bullet" / "Q: .. A: .." convention as the site's article renderer). When present, the full content is rendered into the email instead of just the summary + link. */
  body?: string | null;
  path: string;
  initiatedByEmail: string;
  /** The content's cover image, shown as a banner above the message body when present. */
  coverImageUrl?: string | null;
};

/**
 * Renders the same markdown-style body convention used by the Knowledge Center
 * article page (src/app/(site)/knowledge-center/[slug]/page.tsx renderMarkdown)
 * into branded, inline-styled email HTML.
 */
function renderArticleContentHtml(body: string): string {
  const blocks: string[] = [];
  let listItems: string[] = [];
  let faqItems: { q: string; a: string }[] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      `<ul style="margin:0 0 16px;padding-left:20px;">${listItems
        .map((item) => `<li style="margin:0 0 6px;">${item}</li>`)
        .join("")}</ul>`
    );
    listItems = [];
  };

  const flushFaq = () => {
    if (faqItems.length === 0) return;
    blocks.push(
      `<p style="margin:24px 0 10px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${EMAIL_BRAND.goldInk};">Frequently Asked Questions</p>`
    );
    blocks.push(
      faqItems
        .map(
          (item) =>
            `<p style="margin:0 0 4px;font-weight:700;color:${EMAIL_BRAND.navy};">${escapeHtml(item.q)}</p>` +
            `<p style="margin:0 0 16px;color:${EMAIL_BRAND.muted};">${escapeHtml(item.a)}</p>`
        )
        .join("")
    );
    faqItems = [];
  };

  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("Q: ")) {
      flushList();
      faqItems.push({ q: line.slice(3).trim(), a: "" });
      continue;
    }
    if (line.startsWith("A: ") && faqItems.length > 0) {
      faqItems[faqItems.length - 1].a = line.slice(3).trim();
      continue;
    }
    if (line === "") continue;
    flushFaq();

    if (line.startsWith("## ")) {
      let next = i + 1;
      while (next < lines.length && lines[next].trim() === "") next++;
      if (next < lines.length && lines[next].trim().startsWith("Q: ")) {
        // A heading directly preceding an FAQ block is just a boundary marker
        // (mirrors the site's article renderer) — don't render it as a heading.
        continue;
      }
      flushList();
      blocks.push(
        `<h2 style="margin:24px 0 10px;font-size:19px;line-height:1.3;color:${EMAIL_BRAND.navy};">${escapeHtml(line.slice(3))}</h2>`
      );
    } else if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        `<h3 style="margin:18px 0 8px;font-size:16px;line-height:1.3;color:${EMAIL_BRAND.navy};">${escapeHtml(line.slice(4))}</h3>`
      );
    } else if (line.startsWith("- ")) {
      listItems.push(escapeHtml(line.slice(2).trim()));
    } else {
      flushList();
      blocks.push(`<p style="margin:0 0 16px;">${escapeHtml(line)}</p>`);
    }
  }
  flushList();
  flushFaq();

  return blocks.join("");
}

const CONTENT_LABELS: Record<ContentType, string> = {
  article: "article",
  "case study": "case study",
  service: "service update",
};

const CTA_LABELS: Record<ContentType, string> = {
  article: "Read the Full Article",
  "case study": "Read the Case Study",
  service: "View the Update",
};

/**
 * Sends a newly published piece of content to active newsletter subscribers.
 * Every message gets the subscriber's own unsubscribe URL and click-tracking
 * token, and the complete delivery record appears in the Email Center.
 */
export async function sendContentAnnouncement({
  contentType,
  title,
  summary,
  body: fullBody,
  path,
  initiatedByEmail,
  coverImageUrl,
}: SendContentAnnouncementInput) {
  const subscribers = await NewsletterSubscriber.find(
    { status: "subscribed" },
    "email unsubscribe_token"
  ).lean();

  if (subscribers.length === 0) {
    return { attemptedCount: 0, sentCount: 0, failedCount: 0 };
  }

  const recipients = subscribers.map((subscriber) => subscriber.email);
  const unsubscribeTokens = Object.fromEntries(
    subscribers.map((subscriber) => [subscriber.email, subscriber.unsubscribe_token])
  );
  const contentLabel = CONTENT_LABELS[contentType];
  const contentUrl = `${SITE_URL}${path}`;
  const subject = `New ${contentLabel}: ${title}`;

  // With a full body available, render the complete content (banner image, heading,
  // every paragraph/heading/FAQ) into the email instead of just a summary + link.
  const hasFullBody = Boolean(fullBody?.trim());
  let body: string;
  let format: "text" | "html";
  let bannerImageUrl: string | null = null;

  if (hasFullBody) {
    const banner = coverImageUrl ? imageHtml(coverImageUrl, title) : "";
    const cta = `<div style="margin-top:8px;">${ctaButtonHtml(CTA_LABELS[contentType], contentUrl)}</div>`;
    body =
      banner +
      headingHtml(escapeHtml(title)) +
      (summary?.trim() ? paragraphHtml(escapeHtml(summary.trim())) : "") +
      renderArticleContentHtml(fullBody!.trim()) +
      cta;
    format = "html";
  } else {
    body = [
      "Hello,",
      "",
      `We have published a new ${contentLabel} that may be useful for your IPO planning.`,
      "",
      `${contentType === "case study" ? "Case study" : "Title"}: ${title}`,
      summary?.trim() ? summary.trim() : null,
      "",
      `Read it here: ${contentUrl}`,
      "",
      "Regards,",
      "Be IPO Ready",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
    format = "text";
    bannerImageUrl = coverImageUrl ?? null;
  }

  const result = await sendBulkEmail({
    recipients,
    subject,
    body,
    format,
    track: true,
    unsubscribeTokens,
    bulk: true,
    bannerImageUrl,
    ctaLabel: CTA_LABELS[contentType],
    ctaUrl: contentUrl,
  });

  const campaign = await OutboundEmailCampaign.create({
    audience_kind: "leads",
    audience_label: `All newsletter subscribers · New ${contentLabel}`,
    source_filter: "newsletter",
    subject,
    body,
    format,
    initiated_by_email: initiatedByEmail,
    send_copy_to_sender: false,
    copy_recipient: null,
    copy_status: null,
    copy_message_id: null,
    copy_response: null,
    copy_error: null,
    attempted_count: result.attemptedCount,
    sent_count: result.sentCount,
    failed_count: result.failedCount,
    status: result.status,
    recipients: result.recipientResults.map((recipient) => ({
      email: recipient.email,
      lead_source: "newsletter",
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

  return {
    attemptedCount: result.attemptedCount,
    sentCount: result.sentCount,
    failedCount: result.failedCount,
  };
}
