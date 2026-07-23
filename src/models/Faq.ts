import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { FaqCategory } from "@/types";

const FAQ_CATEGORIES: FaqCategory[] = [
  "sme-ipo-eligibility",
  "ipo-timeline",
  "ipo-cost",
  "pre-ipo-fundraising",
  "valuation",
  "compliance",
  "documentation",
  "investor-readiness",
];

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, enum: FAQ_CATEGORIES, required: true },
    sort_order: { type: Number, default: 0 },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

faqSchema.index({ category: 1, sort_order: 1 });
faqSchema.index({ is_published: 1 });

export type FaqDocument = InferSchemaType<typeof faqSchema>;

export const Faq = models.Faq ?? model("Faq", faqSchema, "faqs");
