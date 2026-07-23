import { Schema, model, models, type InferSchemaType } from "mongoose";

const testimonialSchema = new Schema(
  {
    client_name: { type: String, required: true },
    client_title: { type: String, default: null },
    company_name: { type: String, default: null },
    industry: { type: String, default: null },
    image_url: { type: String, default: null },
    quote: { type: String, required: true },
    outcome: { type: String, default: null },
    case_study_slug: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

testimonialSchema.index({ is_published: 1, sort_order: 1 });

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema>;

export const Testimonial = models.Testimonial ?? model("Testimonial", testimonialSchema, "testimonials");
