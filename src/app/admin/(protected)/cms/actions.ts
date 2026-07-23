"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { deletePublicUpload, saveUploadedImage } from "@/lib/upload";
import { BlogPost } from "@/models/BlogPost";
import { CaseStudy } from "@/models/CaseStudy";
import { Testimonial } from "@/models/Testimonial";
import { Client } from "@/models/Client";
import { SiteStat } from "@/models/SiteStat";
import { SiteAlert } from "@/models/SiteAlert";
import { Faq } from "@/models/Faq";
import type { BlogCategory, ContentStatus, FaqCategory, SiteAlertPlacement } from "@/types";

const REVALIDATE_PATHS = [
  "/",
  "/faqs",
  "/knowledge-center",
  "/case-studies",
  "/admin/cms",
  "/admin/blogs",
  "/admin/faqs",
  "/admin/case-studies",
  "/admin/testimonials",
  "/admin/clients",
  "/admin/alerts",
  "/admin/stats",
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

function refreshCms() {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  revalidatePath("/knowledge-center/[slug]", "page");
  revalidatePath("/case-studies/[slug]", "page");
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
  await connectToDatabase();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const status = text(formData, "status") as ContentStatus;
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "blogs");
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

  refreshCms();
}

export async function deleteBlogPost(formData: FormData) {
  await connectToDatabase();
  await BlogPost.findByIdAndDelete(text(formData, "id"));
  refreshCms();
}

export async function saveCaseStudy(formData: FormData) {
  await connectToDatabase();
  const id = text(formData, "id");
  const companyName = text(formData, "company_name");
  const status = text(formData, "status") as ContentStatus;
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "case-studies");
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
