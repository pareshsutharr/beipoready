/**
 * Shared HTML-email shell. Used both by the admin preview (client-side, in
 * EmailTemplateGrid) and by the actual send pipeline (email.ts), so what an
 * admin previews is exactly what recipients get. Kept dependency-free
 * (no nodemailer / server-only imports) so it can be bundled client-side.
 */

export const EMAIL_BRAND = {
  navy: "#0F2D52",
  navyDark: "#070F1E",
  gold: "#F59E0B",
  goldInk: "#B45309",
  cream: "#F7F3EA",
  border: "#E2E8F0",
  text: "#1F2937",
  muted: "#64748B",
} as const;

const FONT_STACK = "'Segoe UI', Helvetica, Arial, sans-serif";

/** Physical mailing address for the compliance footer of every outbound email (CAN-SPAM / IT Act requirement, and a legitimacy signal to spam filters). */
export const COMPANY_ADDRESS =
  "Be IPO Ready, 2001, 20th Floor, The Junomoneta Tower, RTO, Near Rajhans Cinema, Opp. Pal, Adajan, Surat, Gujarat 395009";

export function siteAsset(siteUrl: string, path: string) {
  return `${siteUrl.replace(/\/$/, "")}${path}`;
}

/** An inline-styled call-to-action button, safe to drop into any content fragment. */
export function ctaButtonHtml(label: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 4px;"><tr><td style="border-radius:6px;background-color:${EMAIL_BRAND.gold};"><a href="${url}" style="display:inline-block;padding:13px 30px;font-family:${FONT_STACK};font-size:14px;font-weight:700;color:${EMAIL_BRAND.navy};text-decoration:none;border-radius:6px;">${label}</a></td></tr></table>`;
}

/** A full-width, responsive email image with sane defaults — the pattern templates should copy for any <img>. */
export function imageHtml(src: string, alt: string, opts: { width?: number; radius?: number } = {}) {
  const width = opts.width ?? 560;
  const radius = opts.radius ?? 8;
  return `<img src="${src}" alt="${alt}" width="${width}" style="display:block;width:100%;max-width:${width}px;height:auto;border:0;border-radius:${radius}px;margin:0 0 20px;" />`;
}

/** A single body paragraph, styled to match the branded shell's default type. */
export function paragraphHtml(text: string) {
  return `<p style="margin:0 0 16px;">${text}</p>`;
}

/** The heading style used at the top of a template's content (below any banner image). */
export function headingHtml(text: string) {
  return `<h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;color:${EMAIL_BRAND.navy};">${text}</h1>`;
}

type BrandedEmailOptions = {
  preheader?: string;
  contentHtml: string;
  footerHtml: string;
  logoUrl: string;
  siteUrl: string;
};

/** Wraps a content fragment (paragraphs, images, buttons, whatever) in the branded header/card/footer shell used for every outbound email. */
export function renderBrandedEmailHtml({ preheader, contentHtml, footerHtml, logoUrl, siteUrl }: BrandedEmailOptions) {
  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheader}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  </head>
  <body style="margin:0;padding:0;background-color:${EMAIL_BRAND.cream};font-family:${FONT_STACK};">
    ${preheaderHtml}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${EMAIL_BRAND.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid ${EMAIL_BRAND.border};">
            <tr>
              <td align="center" style="background-color:${EMAIL_BRAND.navy};padding:28px 24px;">
                <a href="${siteUrl}" style="text-decoration:none;">
                  <img src="${logoUrl}" alt="Be IPO Ready" width="150" style="display:block;width:150px;height:auto;border:0;margin:0 auto;" />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 28px;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:${EMAIL_BRAND.text};">
                ${contentHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid ${EMAIL_BRAND.border};background-color:#FAFAF8;">
                <p style="margin:0 0 8px;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${EMAIL_BRAND.muted};">${footerHtml}</p>
                <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${EMAIL_BRAND.muted};">
                  <a href="${siteUrl}" style="color:${EMAIL_BRAND.goldInk};text-decoration:none;font-weight:600;">Be IPO Ready</a> · SEBI-aligned IPO readiness advisory
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const URL_RE = /https?:\/\/[^\s<>"]+/g;

/**
 * Converts a plain-text message (the "Simple text" editor's content) into the paragraph
 * markup used inside the branded shell — blank-line-separated blocks become <p> tags, bare
 * URLs become links. `linkHref` optionally rewrites each URL's href (e.g. for click tracking)
 * while the visible text stays the original URL.
 */
export function textToContentHtml(text: string, linkHref?: (url: string) => string) {
  return text
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const escaped = escapeHtml(block).replaceAll("\n", "<br />");
      const urls = block.match(URL_RE);
      if (!urls) return escaped;

      let result = escaped;
      for (const url of urls) {
        const escapedUrl = escapeHtml(url);
        const href = linkHref ? escapeHtml(linkHref(url)) : escapedUrl;
        result = result.replace(escapedUrl, `<a href="${href}" style="color:${EMAIL_BRAND.navy};">${escapedUrl}</a>`);
      }
      return result;
    })
    .map((block) => `<p style="margin:0 0 16px;">${block}</p>`)
    .join("");
}

const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/** Best-effort HTML -> plain-text conversion for the multipart text/plain fallback of a custom HTML template. Not a sanitizer. */
export function stripHtmlToText(html: string) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<(br|\/p|\/div|\/h[1-6]|\/li|\/tr)\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<a\s[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_match, href, label) => {
      const text = label.replace(/<[^>]+>/g, "").trim();
      return text && text !== href ? `${text} (${href})` : href;
    })
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/gi, (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? entity)
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, all) => line || (index > 0 && all[index - 1]))
    .join("\n")
    .trim();
}
