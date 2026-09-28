import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { ContentStatus } from "@/types";

const CONTENT_STATUSES: ContentStatus[] = ["draft", "published"];

const stageSchema = new Schema(
  {
    stage: { type: String, required: true },
    timeframe: { type: String, default: "" },
    items: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
  },
  { _id: false }
);

const approachItemSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, default: "" },
  },
  { _id: false }
);

const faqItemSchema = new Schema(
  {
    q: { type: String, required: true },
    a: { type: String, default: "" },
  },
  { _id: false }
);

const serviceSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    summary: { type: String, default: "" },
    icon: { type: String, default: "Banknote" },
    cover_image_url: { type: String, default: null },
    overview: { type: [String], default: [] },
    who_its_for: { type: [String], default: [] },
    process: { type: [stageSchema], default: [] },
    timeline: { type: String, default: "" },
    approach: { type: [approachItemSchema], default: [] },
    faq: { type: [faqItemSchema], default: [] },
    status: { type: String, enum: CONTENT_STATUSES, default: "draft" },
    sort_order: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

serviceSchema.index({ status: 1, sort_order: 1 });

export type ServiceDocument = InferSchemaType<typeof serviceSchema>;

export const Service = models.Service ?? model("Service", serviceSchema, "services");
