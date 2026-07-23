import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { BlogCategory, ContentStatus } from "@/types";

const BLOG_CATEGORIES: BlogCategory[] = [
  "sme-ipo",
  "pre-ipo-fundraising",
  "ipo-readiness",
  "valuation",
  "compliance",
  "capital-markets",
];

const CONTENT_STATUSES: ContentStatus[] = ["draft", "published"];

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: null },
    body: { type: String, default: null },
    cover_image_url: { type: String, default: null },
    category: { type: String, enum: BLOG_CATEGORIES, required: true },
    status: { type: String, enum: CONTENT_STATUSES, default: "draft" },
    seo_title: { type: String, default: null },
    seo_description: { type: String, default: null },
    author_id: { type: String, default: null },
    show_in_news_alert: { type: Boolean, default: false },
    published_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

blogPostSchema.index({ category: 1 });
blogPostSchema.index({ status: 1, published_at: -1 });
blogPostSchema.index({ status: 1, show_in_news_alert: 1 });

export type BlogPostDocument = InferSchemaType<typeof blogPostSchema>;

export const BlogPost = models.BlogPost ?? model("BlogPost", blogPostSchema, "blog_posts");
