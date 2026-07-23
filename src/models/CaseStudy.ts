import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { ContentStatus } from "@/types";

const CONTENT_STATUSES: ContentStatus[] = ["draft", "published"];

const caseStudySchema = new Schema(
  {
    company_name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    industry: { type: String, default: null },
    challenge: { type: String, default: null },
    our_role: { type: String, default: null },
    solution: { type: String, default: null },
    outcome: { type: String, default: null },
    ipo_size: { type: String, default: null },
    capital_raised: { type: String, default: null },
    listing_results: { type: String, default: null },
    testimonial_quote: { type: String, default: null },
    testimonial_author: { type: String, default: null },
    exchange: { type: String, default: null },
    subscription: { type: String, default: null },
    readiness_score: { type: Number, default: null },
    summary: { type: String, default: null },
    approach: { type: [String], default: [] },
    result: { type: String, default: null },
    cover_image_url: { type: String, default: null },
    status: { type: String, enum: CONTENT_STATUSES, default: "draft" },
    show_in_news_alert: { type: Boolean, default: false },
    published_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

caseStudySchema.index({ status: 1, published_at: -1 });
caseStudySchema.index({ status: 1, show_in_news_alert: 1 });

export type CaseStudyDocument = InferSchemaType<typeof caseStudySchema>;

export const CaseStudy = models.CaseStudy ?? model("CaseStudy", caseStudySchema, "case_studies");
