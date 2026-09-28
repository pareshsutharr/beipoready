import { SITE_URL } from "@/lib/seo";
import { ctaButtonHtml, headingHtml, imageHtml, paragraphHtml, siteAsset } from "@/lib/email-layout";

export type EmailTemplateKey = "new-article" | "newsletter" | "follow-up" | "welcome" | "custom";

/** Templates with fixed default copy that can be customized and previewed in the admin Templates section. "custom" is a blank starting point, not a stored template. */
export const CUSTOMIZABLE_TEMPLATE_KEYS = ["new-article", "newsletter", "follow-up", "welcome"] as const;
export type CustomizableTemplateKey = (typeof CUSTOMIZABLE_TEMPLATE_KEYS)[number];

/** "text" is the plain-message editor (auto-formatted at send time); "html" is the raw code editor, for full layout/image control. */
export type EmailTemplateFormat = "text" | "html";
export const EMAIL_TEMPLATE_FORMATS: EmailTemplateFormat[] = ["text", "html"];

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplateKey, string> = {
  "new-article": "New Article",
  newsletter: "Newsletter Update",
  "follow-up": "Follow Up",
  welcome: "Welcome Letter",
  custom: "Custom",
};

export function isCustomizableTemplateKey(value: string): value is CustomizableTemplateKey {
  return (CUSTOMIZABLE_TEMPLATE_KEYS as readonly string[]).includes(value);
}

export function buildEmailTemplate(template: EmailTemplateKey) {
  switch (template) {
    case "newsletter":
      return {
        subject: "Latest update from Be IPO Ready",
        body: [
          "Hello,",
          "",
          "We have a new update from Be IPO Ready that may be useful for your IPO planning.",
          "",
          "Highlights:",
          "- Add your latest newsletter summary here",
          "- Add the article or landing page link here",
          "- Add the next step or CTA here",
          "",
          "Reply to this email if you would like to discuss it with our team.",
          "",
          "Regards,",
          "Be IPO Ready",
        ].join("\n"),
      };
    case "follow-up":
      return {
        subject: "Following up from Be IPO Ready",
        body: [
          "Hello,",
          "",
          "Following up from Be IPO Ready with a quick note and the next steps we discussed.",
          "",
          "- Add your update here",
          "- Add any requested document or article link here",
          "- Add your CTA or meeting request here",
          "",
          "Regards,",
          "Be IPO Ready",
        ].join("\n"),
      };
    case "welcome":
      return {
        subject: "You're subscribed to Be IPO Ready",
        body: [
          "Hello,",
          "",
          "Thanks for subscribing to the Be IPO Ready newsletter. You'll get our latest articles and IPO readiness updates in your inbox.",
          "",
          "In the meantime, you can explore our IPO readiness tool and resources at beipoready.com.",
          "",
          "Regards,",
          "Be IPO Ready",
        ].join("\n"),
      };
    case "custom":
      return {
        subject: "",
        body: "Hello,\n\n",
      };
    case "new-article":
    default:
      return {
        subject: "New article from Be IPO Ready",
        body: [
          "Hello,",
          "",
          "We have published a new article that may help with your IPO readiness planning.",
          "",
          "Article title:",
          "Article link:",
          "",
          "Key takeaway:",
          "",
          "If you want, reply to this email and our team can help you apply it to your company.",
          "",
          "Regards,",
          "Be IPO Ready",
        ].join("\n"),
      };
  }
}

const P = paragraphHtml;
const H1 = headingHtml;
const BANNER = imageHtml(siteAsset(SITE_URL, "/logo-header-hq.png"), "Be IPO Ready", { width: 220 });

/**
 * Starting-point HTML fragment for a template's "Customize by code" editor — a designed,
 * image-and-button-ready layout the admin can freely rewrite. This is a content fragment
 * only (no <html>/<body>): renderBrandedEmailHtml (src/lib/email-layout.ts) wraps it in the
 * shared header/card/footer shell at both preview and send time.
 */
export function buildEmailHtmlTemplate(key: CustomizableTemplateKey): string {
  switch (key) {
    case "newsletter":
      return [
        BANNER,
        H1("Latest update from Be IPO Ready"),
        P("Hello,"),
        P("We have a new update from Be IPO Ready that may be useful for your IPO planning."),
        `<ul style="margin:0 0 20px;padding-left:20px;">` +
          `<li style="margin-bottom:8px;">Add your latest newsletter summary here</li>` +
          `<li style="margin-bottom:8px;">Add the article or landing page link here</li>` +
          `<li style="margin-bottom:8px;">Add the next step or CTA here</li>` +
          `</ul>`,
        ctaButtonHtml("Explore Be IPO Ready", SITE_URL),
      ].join("\n");
    case "follow-up":
      return [
        H1("Following up from Be IPO Ready"),
        P("Hello,"),
        P("Following up with a quick note and the next steps we discussed."),
        `<ul style="margin:0 0 24px;padding-left:20px;">` +
          `<li style="margin-bottom:8px;">Add your update here</li>` +
          `<li style="margin-bottom:8px;">Add any requested document or article link here</li>` +
          `</ul>`,
        ctaButtonHtml("Book a Call", siteAsset(SITE_URL, "/contact-us")),
      ].join("\n");
    case "welcome":
      return [
        BANNER,
        H1("You're subscribed to Be IPO Ready"),
        P("Hello,"),
        P(
          "Thanks for subscribing to the Be IPO Ready newsletter. You'll get our latest articles and IPO readiness updates in your inbox."
        ),
        ctaButtonHtml("Try the IPO Readiness Tool", siteAsset(SITE_URL, "/ipo-readiness-tool")),
      ].join("\n");
    case "new-article":
    default:
      return [
        BANNER,
        H1("New article from Be IPO Ready"),
        P("Hello,"),
        P("We have published a new article that may help with your IPO readiness planning."),
        P("<strong>Article title:</strong> Add the title here<br /><strong>Key takeaway:</strong> Add the takeaway here"),
        ctaButtonHtml("Read the Article", siteAsset(SITE_URL, "/knowledge-center")),
      ].join("\n");
  }
}
