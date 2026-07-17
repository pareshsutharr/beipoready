import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  Field,
  ImagePreview,
  PageHeader,
  Select,
  SubmitRow,
  TextArea,
  blogCategories,
  cardClass,
  inputClass,
  labelClass,
  statuses,
} from "@/components/admin/cms/FormControls";
import { deleteBlogPost, saveBlogPost } from "../cms/actions";

export const metadata: Metadata = { title: "Blogs - Be IPO Ready Admin" };

export default async function BlogsPage() {
  const postsResult = await createAdminClient()
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  const posts = postsResult.data ?? [];

  return (
    <div className="p-8">
      <PageHeader
        eyebrow="Content"
        title="Blogs"
        description="Create and update Knowledge Center articles. Published posts appear live on the website after save."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total posts</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Published</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            {posts.filter((post) => post.status === "published").length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Drafts</p>
          <p className="mt-1 text-2xl font-bold text-brand-navy">
            {posts.filter((post) => post.status === "draft").length}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <form action={saveBlogPost} className={cardClass}>
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-navy">New Blog Post</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            <Field label="Title" name="title" required />
            <Field label="Slug" name="slug" placeholder="auto-created if blank" />
            <Select label="Category" name="category" options={blogCategories} />
            <Select label="Status" name="status" options={statuses} />
            <Field label="Cover Image URL" name="cover_image_url" placeholder="https://... (or upload below)" />
            <label className="block">
              <span className={labelClass}>Or Upload Cover Image</span>
              <input name="cover_image_file" type="file" accept="image/*" className={inputClass} />
            </label>
            <Field label="SEO Title" name="seo_title" />
            <Field label="SEO Description" name="seo_description" />
          </div>
          <div className="mt-4 grid gap-4">
            <TextArea label="Excerpt" name="excerpt" rows={2} />
            <TextArea label="Body" name="body" rows={10} placeholder="Markdown-style headings and bullets supported" />
          </div>
          <SubmitRow saveLabel="Publish / Save" />
        </form>

        {posts.map((post) => (
          <form key={post.id} action={saveBlogPost} className={cardClass}>
            <input type="hidden" name="id" value={post.id} />
            <input type="hidden" name="current_cover_image_url" value={post.cover_image_url ?? ""} />
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-brand-navy">{post.title}</h2>
                <p className="mt-1 text-xs text-slate-400">/{post.slug}</p>
              </div>
              <span className="self-start rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {post.status}
              </span>
            </div>
            <ImagePreview url={post.cover_image_url} label={`${post.title} cover image`} />
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Field label="Title" name="title" defaultValue={post.title} required />
              <Field label="Slug" name="slug" defaultValue={post.slug} />
              <Select label="Category" name="category" defaultValue={post.category} options={blogCategories} />
              <Select label="Status" name="status" defaultValue={post.status} options={statuses} />
              <Field label="Cover Image URL" name="cover_image_url" defaultValue={post.cover_image_url} />
              <label className="block">
                <span className={labelClass}>Replace Cover Image</span>
                <input name="cover_image_file" type="file" accept="image/*" className={inputClass} />
              </label>
              <Field label="SEO Title" name="seo_title" defaultValue={post.seo_title} />
              <Field label="SEO Description" name="seo_description" defaultValue={post.seo_description} />
            </div>
            <div className="mt-4 grid gap-4">
              <TextArea label="Excerpt" name="excerpt" defaultValue={post.excerpt} rows={2} />
              <TextArea label="Body" name="body" defaultValue={post.body} rows={10} />
            </div>
            <SubmitRow deleteAction={deleteBlogPost} id={post.id} />
          </form>
        ))}
      </div>
    </div>
  );
}
