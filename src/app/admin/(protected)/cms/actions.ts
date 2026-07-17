"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
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

function storagePathFromPublicUrl(url: string | null) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/cms-assets/";
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null;
}

async function uploadCmsImage(formData: FormData, key: string, folder: string) {
  const file = fileFromForm(formData, key);
  if (!file) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  const supabase = createAdminClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${folder}/${Date.now()}-${baseName}.${extension}`;
  const { error } = await supabase.storage.from("cms-assets").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("cms-assets").getPublicUrl(path);
  return data.publicUrl;
}

function refreshCms() {
  REVALIDATE_PATHS.forEach((path) => revalidatePath(path));
  revalidatePath("/knowledge-center/[slug]", "page");
  revalidatePath("/case-studies/[slug]", "page");
}

export async function saveFaq(formData: FormData) {
  const id = text(formData, "id");
  const supabase = createAdminClient();
  const payload = {
    question: text(formData, "question"),
    answer: text(formData, "answer"),
    category: text(formData, "category") as FaqCategory,
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await supabase.from("faqs").update(payload).eq("id", id);
  else await supabase.from("faqs").insert(payload);
  refreshCms();
}

export async function deleteFaq(formData: FormData) {
  await createAdminClient().from("faqs").delete().eq("id", text(formData, "id"));
  refreshCms();
}

export async function saveBlogPost(formData: FormData) {
  const id = text(formData, "id");
  const title = text(formData, "title");
  const status = text(formData, "status") as ContentStatus;
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "blogs");
  const supabase = createAdminClient();
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
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) await supabase.from("blog_posts").update(payload).eq("id", id);
  else await supabase.from("blog_posts").insert(payload);

  if (uploadedCoverUrl && currentCoverUrl) {
    const oldPath = storagePathFromPublicUrl(currentCoverUrl);
    if (oldPath) await supabase.storage.from("cms-assets").remove([oldPath]);
  }

  refreshCms();
}

export async function deleteBlogPost(formData: FormData) {
  await createAdminClient().from("blog_posts").delete().eq("id", text(formData, "id"));
  refreshCms();
}

export async function saveCaseStudy(formData: FormData) {
  const id = text(formData, "id");
  const companyName = text(formData, "company_name");
  const status = text(formData, "status") as ContentStatus;
  const currentCoverUrl = nullableText(formData, "current_cover_image_url");
  const uploadedCoverUrl = await uploadCmsImage(formData, "cover_image_file", "case-studies");
  const supabase = createAdminClient();
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
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (id) await supabase.from("case_studies").update(payload).eq("id", id);
  else await supabase.from("case_studies").insert(payload);

  if (uploadedCoverUrl && currentCoverUrl) {
    const oldPath = storagePathFromPublicUrl(currentCoverUrl);
    if (oldPath) await supabase.storage.from("cms-assets").remove([oldPath]);
  }

  refreshCms();
}

export async function deleteCaseStudy(formData: FormData) {
  await createAdminClient().from("case_studies").delete().eq("id", text(formData, "id"));
  refreshCms();
}

export async function saveTestimonial(formData: FormData) {
  const id = text(formData, "id");
  const supabase = createAdminClient();
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

  if (id) await supabase.from("testimonials").update(payload).eq("id", id);
  else await supabase.from("testimonials").insert(payload);
  refreshCms();
}

export async function deleteTestimonial(formData: FormData) {
  await createAdminClient().from("testimonials").delete().eq("id", text(formData, "id"));
  refreshCms();
}

export async function saveClient(formData: FormData) {
  const id = text(formData, "id");
  const currentLogoUrl = nullableText(formData, "current_logo_url");
  const uploadedLogoUrl = await uploadCmsImage(formData, "logo_file", "clients");
  const logoUrl = uploadedLogoUrl ?? currentLogoUrl;

  if (!logoUrl) {
    throw new Error("Upload a client logo before saving.");
  }

  const supabase = createAdminClient();
  const payload = {
    name: text(formData, "name"),
    logo_url: logoUrl,
    website_url: nullableText(formData, "website_url"),
    nature_of_business: nullableText(formData, "nature_of_business"),
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await supabase.from("clients").update(payload).eq("id", id);
  else await supabase.from("clients").insert(payload);

  if (uploadedLogoUrl && currentLogoUrl) {
    const oldLogoPath = storagePathFromPublicUrl(currentLogoUrl);
    if (oldLogoPath) await supabase.storage.from("cms-assets").remove([oldLogoPath]);
  }

  refreshCms();
}

export async function deleteClient(formData: FormData) {
  const id = text(formData, "id");
  const logoPath = storagePathFromPublicUrl(nullableText(formData, "current_logo_url"));
  const supabase = createAdminClient();

  await supabase.from("clients").delete().eq("id", id);
  if (logoPath) await supabase.storage.from("cms-assets").remove([logoPath]);
  refreshCms();
}

export async function saveSiteStat(formData: FormData) {
  const id = text(formData, "id");
  const supabase = createAdminClient();
  const payload = {
    label: text(formData, "label"),
    value: text(formData, "value"),
    sort_order: Number(text(formData, "sort_order") || 0),
    is_published: bool(formData, "is_published"),
  };

  if (id) await supabase.from("site_stats").update(payload).eq("id", id);
  else await supabase.from("site_stats").insert(payload);
  refreshCms();
}

export async function deleteSiteStat(formData: FormData) {
  await createAdminClient().from("site_stats").delete().eq("id", text(formData, "id"));
  refreshCms();
}

export async function saveSiteAlert(formData: FormData) {
  const id = text(formData, "id");
  const supabase = createAdminClient();
  const payload = {
    title: text(formData, "title"),
    message: text(formData, "message"),
    cta_label: nullableText(formData, "cta_label"),
    cta_href: nullableText(formData, "cta_href"),
    placement: text(formData, "placement") as SiteAlertPlacement,
    is_active: bool(formData, "is_active"),
  };

  if (id) await supabase.from("site_alerts").update(payload).eq("id", id);
  else await supabase.from("site_alerts").insert(payload);
  refreshCms();
}

export async function deleteSiteAlert(formData: FormData) {
  await createAdminClient().from("site_alerts").delete().eq("id", text(formData, "id"));
  refreshCms();
}
