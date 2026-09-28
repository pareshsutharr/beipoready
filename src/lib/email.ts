import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { SITE_URL } from "@/lib/seo";
import {
  COMPANY_ADDRESS,
  ctaButtonHtml,
  escapeHtml,
  imageHtml,
  renderBrandedEmailHtml,
  stripHtmlToText,
  textToContentHtml,
} from "@/lib/email-layout";

type SendBulkEmailInput = {
  recipients: string[];
  subject: string;
  body: string;
  /** "text" (default) auto-formats `body` as paragraphs; "html" treats `body` as a raw HTML fragment (from the template's "Customize by code" editor). */
  format?: "text" | "html";
  /** Rewrites links to a click-tracking redirect. Off by default to preserve existing send behavior for non-newsletter audiences. */
  track?: boolean;
  /** email (lowercased) -> unsubscribe token, used to build a one-click unsubscribe link when available. */
  unsubscribeTokens?: Record<string, string>;
  /** Marks this as a real multi-recipient campaign, adding Precedence: bulk. Off for manual/transactional single sends so they don't read as bulk mail to spam filters. */
  bulk?: boolean;
  /** Shown above the message body for "text" format sends (e.g. a blog post's cover image). Ignored for "html" format — bring your own image there. */
  bannerImageUrl?: string | null;
  /** Overrides the default "Visit Be IPO Ready" -> homepage button for "text" format sends, e.g. to link straight to the published article instead. */
  ctaLabel?: string;
  ctaUrl?: string;
};

// Gmail SMTP throttles and flags bulk-looking sends. Keep a hard ceiling per
// campaign and pace individual sends so the account doesn't get rate-limited
// or marked as spam mid-send.
const MAX_RECIPIENTS_PER_SEND = 450;
const SEND_DELAY_MS = 1200;

// Transient send failures (network blips, SMTP timeouts) get a few retries
// with exponential backoff. SMTP-level rejections (info.rejected) are
// permanent and are not retried.
const MAX_SEND_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type EmailRecipientResult = {
  email: string;
  status: "sent" | "failed";
  messageId: string | null;
  response: string | null;
  error: string | null;
  attempts: number;
  trackingToken: string | null;
};

type SendBulkEmailResult = {
  status: "sent" | "partial" | "failed";
  attemptedCount: number;
  sentCount: number;
  failedCount: number;
  recipientResults: EmailRecipientResult[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let cachedTransporter: nodemailer.Transporter | null = null;

function addressValue(value: string | { address?: string }) {
  return typeof value === "string" ? value : value.address ?? "";
}

function formatFromHeader(value: string) {
  return value.includes("<") ? value : `Be IPO Ready <${value}>`;
}

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD?.replace(/\s+/g, "");
  const from = process.env.SMTP_FROM;
  const replyTo = process.env.SMTP_REPLY_TO || from;

  if (!host || !port || !user || !pass || !from) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM.");
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    from,
    replyTo,
  };
}

export function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const config = getSmtpConfig();
  cachedTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    requireTLS: !config.secure,
  });

  return cachedTransporter;
}

function normalizeRecipients(recipients: string[]) {
  const uniqueRecipients = new Set<string>();

  for (const recipient of recipients) {
    const email = recipient.trim().toLowerCase();
    if (!email || !EMAIL_RE.test(email)) continue;
    uniqueRecipients.add(email);
  }

  return Array.from(uniqueRecipients);
}

function clickTrackingUrl(targetUrl: string, trackingToken: string) {
  return `${SITE_URL}/api/newsletter/track/click?t=${encodeURIComponent(trackingToken)}&u=${encodeURIComponent(targetUrl)}`;
}

function complianceFooter(replyTo: string, unsubscribeUrl: string | null) {
  const reason = unsubscribeUrl
    ? `You're receiving this because you subscribed to Be IPO Ready updates. Unsubscribe: ${unsubscribeUrl}`
    : `You're receiving this because you're a Be IPO Ready contact. Reply to ${replyTo} with "unsubscribe" to opt out of future messages.`;
  return `${reason}\n${COMPANY_ADDRESS}`;
}

function toText(body: string, format: "text" | "html", replyTo: string, unsubscribeUrl: string | null) {
  const plainBody = format === "html" ? stripHtmlToText(body) : body.trim();
  return `${plainBody}\n\n--\n${complianceFooter(replyTo, unsubscribeUrl)}`;
}

/** Wraps the message (plain-text paragraphs, or a raw HTML fragment from the "Customize by code" editor) in the shared branded shell. */
function toHtml(
  body: string,
  format: "text" | "html",
  replyTo: string,
  options: {
    subject: string;
    unsubscribeUrl: string | null;
    trackingToken: string | null;
    bannerImageUrl?: string | null;
    ctaLabel?: string;
    ctaUrl?: string;
  }
) {
  const linkHref = options.trackingToken
    ? (url: string) => clickTrackingUrl(url, options.trackingToken as string)
    : undefined;

  // Plain-text templates are admin-authored copy with no guaranteed link back to the site
  // (e.g. the newsletter/follow-up/new-article defaults never mention a URL) — always give
  // the rendered email a real branded button to beipoready.com, not just whatever text the
  // admin happened to type. Callers with a specific destination (e.g. a published article)
  // can override the label/url; a cover image renders above the body when provided.
  const banner = options.bannerImageUrl ? imageHtml(options.bannerImageUrl, options.subject) : "";
  const cta = ctaButtonHtml(options.ctaLabel ?? "Visit Be IPO Ready", options.ctaUrl ?? SITE_URL);
  const contentHtml = format === "html" ? body : banner + textToContentHtml(body, linkHref) + cta;

  const footerText = complianceFooter(replyTo, options.unsubscribeUrl);
  const footerHtml = options.unsubscribeUrl
    ? `You're receiving this because you subscribed to Be IPO Ready updates. <a href="${escapeHtml(options.unsubscribeUrl)}" style="color:#64748B;">Unsubscribe</a><br />${escapeHtml(COMPANY_ADDRESS)}`
    : escapeHtml(footerText).replaceAll("\n", "<br />");

  return renderBrandedEmailHtml({
    preheader: options.subject,
    contentHtml,
    footerHtml,
    logoUrl: `${SITE_URL}/logo-transparent.png`,
    siteUrl: SITE_URL,
  });
}

export async function verifyEmailTransport() {
  const transporter = getTransporter();
  await transporter.verify();
}

export type SmtpStatus =
  | { configured: false }
  | {
      configured: true;
      host: string;
      port: number;
      secure: boolean;
      user: string;
      from: string;
      replyTo: string;
    };

/** Reads SMTP_* env vars for display in the admin panel. Never returns the password. */
export function getSmtpStatus(): SmtpStatus {
  try {
    const config = getSmtpConfig();
    return {
      configured: true,
      host: config.host,
      port: config.port,
      secure: config.secure,
      user: config.auth.user,
      from: config.from,
      replyTo: config.replyTo ?? config.from,
    };
  } catch {
    return { configured: false };
  }
}

export async function sendBulkEmail({
  recipients,
  subject,
  body,
  format = "text",
  track = false,
  unsubscribeTokens,
  bulk = false,
  bannerImageUrl = null,
  ctaLabel,
  ctaUrl,
}: SendBulkEmailInput): Promise<SendBulkEmailResult> {
  const normalizedRecipients = normalizeRecipients(recipients);
  const trimmedSubject = subject.trim();
  const trimmedBody = body.trim();

  if (normalizedRecipients.length === 0) {
    throw new Error("At least one valid recipient is required.");
  }

  if (!trimmedSubject) {
    throw new Error("Email subject is required.");
  }

  if (!trimmedBody) {
    throw new Error("Email body is required.");
  }

  if (normalizedRecipients.length > MAX_RECIPIENTS_PER_SEND) {
    throw new Error(
      `Gmail SMTP is not reliable above ${MAX_RECIPIENTS_PER_SEND} recipients per send — it risks the account being rate-limited or flagged. Split this into smaller batches.`
    );
  }

  const transporter = getTransporter();
  const config = getSmtpConfig();
  const replyTo = config.replyTo ?? config.from;
  const fromDomain = config.from.split("@")[1] ?? "localhost";
  const recipientResults: EmailRecipientResult[] = [];

  for (const [index, recipient] of normalizedRecipients.entries()) {
    if (index > 0) {
      await sleep(SEND_DELAY_MS);
    }

    const trackingToken = track ? randomUUID() : null;
    const unsubscribeToken = unsubscribeTokens?.[recipient] ?? null;
    const unsubscribeUrl = unsubscribeToken
      ? `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
      : null;

    let attempts = 0;

    while (attempts < MAX_SEND_ATTEMPTS) {
      attempts += 1;

      try {
        const info = await transporter.sendMail({
          from: formatFromHeader(config.from),
          to: recipient,
          replyTo,
          subject: trimmedSubject,
          text: toText(trimmedBody, format, replyTo, unsubscribeUrl),
          html: toHtml(trimmedBody, format, replyTo, {
            subject: trimmedSubject,
            unsubscribeUrl,
            trackingToken,
            bannerImageUrl,
            ctaLabel,
            ctaUrl,
          }),
          messageId: `<${randomUUID()}@${fromDomain}>`,
          headers: {
            // A one-off manual/test send with no subscription behind it shouldn't carry
            // bulk-mail headers — that reads as bulk mail to spam filters for what is,
            // to the recipient, an ordinary single email.
            ...(bulk || unsubscribeUrl
              ? {
                  "List-Unsubscribe": unsubscribeUrl
                    ? `<${unsubscribeUrl}>, <mailto:${replyTo}?subject=unsubscribe>`
                    : `<mailto:${replyTo}?subject=unsubscribe>`,
                  ...(unsubscribeUrl ? { "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : {}),
                }
              : {}),
            ...(bulk ? { Precedence: "bulk" } : {}),
          },
        });

        const accepted = info.accepted.some(
          (value: string | { address?: string }) => addressValue(value).toLowerCase() === recipient
        );
        const rejected = info.rejected.some(
          (value: string | { address?: string }) => addressValue(value).toLowerCase() === recipient
        );

        recipientResults.push({
          email: recipient,
          status: accepted && !rejected ? "sent" : "failed",
          messageId: info.messageId ?? null,
          response: typeof info.response === "string" ? info.response : null,
          error: accepted && !rejected ? null : "SMTP rejected this recipient.",
          attempts,
          trackingToken: accepted && !rejected ? trackingToken : null,
        });
        break;
      } catch (error) {
        if (attempts < MAX_SEND_ATTEMPTS) {
          await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempts - 1));
          continue;
        }

        recipientResults.push({
          email: recipient,
          status: "failed",
          messageId: null,
          response: null,
          error: error instanceof Error ? error.message : "SMTP send failed.",
          attempts,
          trackingToken: null,
        });
      }
    }
  }

  const sentCount = recipientResults.filter((result) => result.status === "sent").length;
  const failedCount = recipientResults.length - sentCount;

  return {
    status: failedCount === 0 ? "sent" : sentCount > 0 ? "partial" : "failed",
    attemptedCount: recipientResults.length,
    sentCount,
    failedCount,
    recipientResults,
  };
}
