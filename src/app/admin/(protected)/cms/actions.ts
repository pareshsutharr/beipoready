"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { sendContentAnnouncement } from "@/lib/content-announcement";
import { connectToDatabase } from "@/lib/mongodb";
import { deletePublicUpload, saveUploadedImage } from "@/lib/upload";
import { BlogPost } from "@/models/BlogPost";
import { CaseStudy } from "@/models/CaseStudy";
import { Testimonial } from "@/models/Testimonial";
import { Client } from "@/models/Client";
import { SiteStat } from "@/models/SiteStat";
import { SiteAlert } from "@/models/SiteAlert";
import { Faq } from "@/models/Faq";
import { Service } from "@/models/Service";
import { NotificationSettings } from "@/models/NotificationSettings";
import { parseEmailList } from "@/lib/notify-admin";
import { deliverWhatsapp, parseWhatsappRecipients, type WhatsappRecipient } from "@/lib/whatsapp";
import { unlinkWhatsapp } from "@/lib/whatsapp-link";
import type { BlogCategory, ContentStatus, FaqCategory, SiteAlertPlacement } from "@/types";

const REVALIDATE_PATHS = [
  "/",
  "/faqs",
  "/knowledge-center",
  "/case-studies",
  "/services",
  "/admin/cms",
  "/admin/blogs",
  "/admin/faqs",
  "/admin/case-studies",
  "/admin/testimonials",
  "/admin/clients",
  "/admin/alerts",
  "/admin/stats",
  "/admin/services",
  "/admin/notifications",
];

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function numberOrNull(formData: FormData, key: string) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function fileFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

async function uploadCmsImage(formData: FormData, key: string, folder: string) {
  const file = fileFromForm(formData, key);
  if (!file) return null;
  return saveUploadedImage(file, folder);
}

/**
 * Rejects known "share page" links that aren't the raw image itself, since
 * next/image fetches the URL directly and silently fails to render it
 * otherwise (e.g. an ImgBB viewer page instead of its i.ibb.co direct link).
 */
function assertDirectImageUrl(url: string | null) {
  if (url && /^https?:\/\/ibb\.co\//i.test(url)) {
    throw new Error(
      `"${url}" is an ImgBB share page, not the image itself, so it won't display. Open the image on ibb.co, right-click it, and copy the direct link (starts with https://i.ibb.co/...), or use the file upload field instead.`
    );
  }
}

/**
 * Sending to every subscriber can take minutes (paced Gmail SMTP sends), which would leave
 * the admin's Save button hanging with no feedback. Fire it after the response instead so the
 * save itself confirms quickly; failures are still logged for the Email Center's campaign record.
 */
function announceAfterSave(input: Parameters<typeof sendContentAnnouncement>[0]) {
  after(() =>
    sendContentAnnouncement(input).catch((error) => {
      console.error("Content announcement email failed:", error);
    })
  );
}

function refreshCms() {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  revalidatePath("/knowledge-center/[slug]", "page");
  revalidatePath("/case-studies/[slug]", "page");
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseApproachItems(value: string) {
  return parseLines(value)
    .map((line) => {
      const [title, ...rest] = line.split("::");
      return { title: title.trim(), text: rest.join("::").trim() };
    })
    .filter((item) => item.title);
}

function parseFaqItems(value: string) {
  const items: { q: string; a: string }[] = [];
  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^q[:.]/i.test(line)) {
      items.push({ q: line.replace(/^q[:.]\s*/i, ""), a: "" });
    } else if (/^a[:.]/i.test(line) && items.length) {
      items[items.length - 1].a = line.replace(/^a[:.]\s*/i, "");
    }
  }
  return items.filter((item) => item.q);
}

function parseProcessStages(value: string) {
  const blocks = value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const stage = { stage: "", timeframe: "", items: [] as string[], deliverables: [] as string[] };
      for (const rawLine of block.split("\n")) {
        const line = rawLine.trim();
        const match = line.match(/^(stage|timeframe|items|deliverables)\s*:\s*(.*)$/i);
        if (!match) continue;
        const key = match[1].toLowerCase();
        const val = match[2].trim();
        if (key === "stage") stage.stage = val;
        else if (key === "timeframe") stage.timeframe = val;
        else if (key === "items") stage.items = val.split("|").map((s) => s.trim()).filter(Boolean);
        else if (key === "deliverables") stage.deliverables = val.split("|").map((s) => s.trim()).filter(Boolean);
      }
      return stage;
    })
    .filter((stage) => stage.stage);
}

export async function saveFaq(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  const payload = {
    question: text(formData, "question"),
    answer: text(formData, "answer"),
    category: text(formData, "category") as FaqCategory,
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await Faq.findByIdAndUpdate(id, payload);
  else await Faq.create(payload);
  refreshCms();
}

export async function deleteFaq(formData: FormData) {
  await connectToDatabase();
  await Faq.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveBlogPost(formData: FormData) {
  const admin = await requireAdmin();
  await connectToDatabase();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const status = text(formData, "status") as ContentStatus;
  const sendToSubscribers = bool(formData, "send_to_subscribers");
  if (sendToSubscribers && status !== "published") {
    throw new Error("Publish the article before sending it to subscribers.");
  }
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "blogs");
  assertDirectImageUrl(nullableText(formData, "cover_image_url"));
  const payload = {
    title,
    slug: text(formData, "slug") || slugify(title),
    excerpt: nullableText(formData, "excerpt"),
    body: nullableText(formData, "body"),
    cover_image_url: uploadedCoverUrl ?? nullableText(formData, "cover_image_url") ?? currentCoverUrl,
    category: text(formData, "category") as BlogCategory,
    status,
    seo_title: nullableText(formData, "seo_title"),
    seo_description: nullableText(formData, "seo_description"),
    show_in_news_alert: bool(formData, "show_in_news_alert"),
    published_at: status === "published" ? new Date() : null,
  };

  if (id) await BlogPost.findByIdAndUpdate(id, payload);
  else await BlogPost.create(payload);

  if (uploadedCoverUrl && currentCoverUrl) {
    await deletePublicUpload(currentCoverUrl);
  }

  if (sendToSubscribers) {
    announceAfterSave({
      contentType: "article",
      title,
      summary: payload.excerpt,
      body: payload.body,
      path: `/knowledge-center/${payload.slug}`,
      initiatedByEmail: admin.email,
      coverImageUrl: payload.cover_image_url,
    });
  }

  refreshCms();
}

export async function deleteBlogPost(formData: FormData) {
  await connectToDatabase();
  await BlogPost.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveService(formData: FormData) {
  const admin = await requireAdmin();
  await connectToDatabase();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const status = text(formData, "status") as ContentStatus;
  const sendToSubscribers = bool(formData, "send_to_subscribers");
  if (sendToSubscribers && status !== "published") {
    throw new Error("Publish the service before sending it to subscribers.");
  }
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "services");
  assertDirectImageUrl(nullableText(formData, "cover_image_url"));
  const payload = {
    title,
    slug: text(formData, "slug") || slugify(title),
    tagline: text(formData, "tagline"),
    summary: text(formData, "summary"),
    icon: text(formData, "icon") || "Banknote",
    cover_image_url: uploadedCoverUrl ?? nullableText(formData, "cover_image_url") ?? currentCoverUrl,
    overview: parseLines(text(formData, "overview")),
    who_its_for: parseLines(text(formData, "who_its_for")),
    process: parseProcessStages(text(formData, "process")),
    timeline: text(formData, "timeline"),
    approach: parseApproachItems(text(formData, "approach")),
    faq: parseFaqItems(text(formData, "faq")),
    status,
    sort_order: Number(text(formData, "sort_order") || 0),
  };

  if (id) await Service.findByIdAndUpdate(id, payload);
  else await Service.create(payload);

  if (uploadedCoverUrl && currentCoverUrl) {
    await deletePublicUpload(currentCoverUrl);
  }

  if (sendToSubscribers) {
    announceAfterSave({
      contentType: "service",
      title,
      summary: payload.summary,
      path: `/services/${payload.slug}`,
      initiatedByEmail: admin.email,
      coverImageUrl: payload.cover_image_url,
    });
  }

  refreshCms();
}

export async function deleteService(formData: FormData) {
  await connectToDatabase();
  await Service.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveCaseStudy(formData: FormData) {
  const admin = await requireAdmin();
  await connectToDatabase();
  const id = text(formData, "id");
  const companyName = text(formData, "company_name");
  const status = text(formData, "status") as ContentStatus;
  const sendToSubscribers = bool(formData, "send_to_subscribers");
  if (sendToSubscribers && status !== "published") {
    throw new Error("Publish the case study before sending it to subscribers.");
  }
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "case-studies");
  assertDirectImageUrl(nullableText(formData, "cover_image_url"));
  const payload = {
    company_name: companyName,
    slug: text(formData, "slug") || slugify(companyName),
    industry: nullableText(formData, "industry"),
    outcome: nullableText(formData, "outcome"),
    challenge: nullableText(formData, "challenge"),
    summary: nullableText(formData, "summary"),
    cover_image_url: uploadedCoverUrl ?? nullableText(formData, "cover_image_url") ?? currentCoverUrl,
    approach: text(formData, "approach").split("\n").map((item) => item.trim()).filter(Boolean),
    result: nullableText(formData, "result"),
    ipo_size: nullableText(formData, "ipo_size"),
    exchange: nullableText(formData, "exchange"),
    subscription: nullableText(formData, "subscription"),
    readiness_score: numberOrNull(formData, "readiness_score"),
    testimonial_quote: nullableText(formData, "testimonial_quote"),
    testimonial_author: nullableText(formData, "testimonial_author"),
    status,
    show_in_news_alert: bool(formData, "show_in_news_alert"),
    published_at: status === "published" ? new Date() : null,
  };

  if (id) await CaseStudy.findByIdAndUpdate(id, payload);
  else await CaseStudy.create(payload);

  if (uploadedCoverUrl && currentCoverUrl) {
    await deletePublicUpload(currentCoverUrl);
  }

  if (sendToSubscribers) {
    announceAfterSave({
      contentType: "case study",
      title: companyName,
      summary: payload.summary ?? payload.outcome,
      path: `/case-studies/${payload.slug}`,
      initiatedByEmail: admin.email,
      coverImageUrl: payload.cover_image_url,
    });
  }

  refreshCms();
}

export async function deleteCaseStudy(formData: FormData) {
  await connectToDatabase();
  await CaseStudy.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveTestimonial(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  assertDirectImageUrl(nullableText(formData, "image_url"));
  const payload = {
    client_name: text(formData, "client_name"),
    client_title: nullableText(formData, "client_title"),
    company_name: nullableText(formData, "company_name"),
    industry: nullableText(formData, "industry"),
    image_url: nullableText(formData, "image_url"),
    quote: text(formData, "quote"),
    outcome: nullableText(formData, "outcome"),
    case_study_slug: nullableText(formData, "case_study_slug"),
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await Testimonial.findByIdAndUpdate(id, payload);
  else await Testimonial.create(payload);
  refreshCms();
}

export async function deleteTestimonial(formData: FormData) {
  await connectToDatabase();
  await Testimonial.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveClient(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  const currentLogoUrl = nullableText(formData, "current_logo_url");
  const uploadedLogoUrl = await uploadCmsImage(formData, "logo_file", "clients");
  const logoUrl = uploadedLogoUrl ?? currentLogoUrl;

  if (!logoUrl) {
    throw new Error("Upload a client logo before saving.");
  }

  const payload = {
    name: text(formData, "name"),
    logo_url: logoUrl,
    website_url: nullableText(formData, "website_url"),
    nature_of_business: nullableText(formData, "nature_of_business"),
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await Client.findByIdAndUpdate(id, payload);
  else await Client.create(payload);

  if (uploadedLogoUrl && currentLogoUrl) {
    await deletePublicUpload(currentLogoUrl);
  }

  refreshCms();
}

export async function deleteClient(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  const currentLogoUrl = nullableText(formData, "current_logo_url");

  await Client.findByIdAndDelete(id);
  await deletePublicUpload(currentLogoUrl);
  refreshCms();
}

export async function saveSiteStat(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  const payload = {
    label: text(formData, "label"),
    value: text(formData, "value"),
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await SiteStat.findByIdAndUpdate(id, payload);
  else await SiteStat.create(payload);
  refreshCms();
}

export async function deleteSiteStat(formData: FormData) {
  await connectToDatabase();
  await SiteStat.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveSiteAlert(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  const payload = {
    title: text(formData, "title"),
    message: text(formData, "message"),
    cta_label: nullableText(formData, "cta_label"),
    cta_href: nullableText(formData, "cta_href"),
    placement: text(formData, "placement") as SiteAlertPlacement,
    is_active: bool(formData, "is_active"),
  };

  if (id) await SiteAlert.findByIdAndUpdate(id, payload);
  else await SiteAlert.create(payload);
  refreshCms();
}

export async function deleteSiteAlert(formData: FormData) {
  await connectToDatabase();
  await SiteAlert.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function updateNotificationSettings(formData: FormData) {
  await requireAdmin();
  await connectToDatabase();

  await NotificationSettings.findOneAndUpdate(
    {},
    {
      $set: {
        notification_emails: parseEmailList(text(formData, "notification_emails")),
        whatsapp_recipients: parseWhatsappRecipients(text(formData, "whatsapp_recipients")),
        notify_on_lead: bool(formData, "notify_on_lead"),
        notify_on_newsletter: bool(formData, "notify_on_newsletter"),
        notify_on_eligibility: bool(formData, "notify_on_eligibility"),
      },
    },
    { upsert: true }
  );

  refreshCms();
}

export type WhatsappSendState = { ok: boolean; message: string | null };

/** Sends an admin-written WhatsApp message to the chosen saved numbers. */
export async function sendCustomWhatsapp(_prev: WhatsappSendState, formData: FormData): Promise<WhatsappSendState> {
  await requireAdmin();
  const message = text(formData, "message");
  const selected = new Set(formData.getAll("phones").map(String));
  if (!message) return { ok: false, message: "Type a message first." };
  if (selected.size === 0) return { ok: false, message: "Pick at least one number." };

  await connectToDatabase();
  const settings = await NotificationSettings.findOne().lean<{ whatsapp_recipients?: WhatsappRecipient[] }>();
  const recipients = (settings?.whatsapp_recipients ?? []).filter((r) => selected.has(r.phone));
  if (recipients.length === 0) return { ok: false, message: "None of the chosen numbers are saved anymore." };

  const { sent, failed } = await deliverWhatsapp(recipients, message);
  if (failed.length === 0) return { ok: true, message: `Sent to ${sent} number(s).` };
  return {
    ok: false,
    message: `Sent to ${sent}. Failed: ${failed.map((f) => `${f.phone} (${f.error})`).join("; ")}`,
  };
}

export async function unlinkWhatsappAction() {
  await requireAdmin();
  await unlinkWhatsapp();
}
