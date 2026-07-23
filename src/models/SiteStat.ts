import { Schema, model, models, type InferSchemaType } from "mongoose";

const siteStatSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    sort_order: { type: Number, default: 0 },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

siteStatSchema.index({ is_published: 1, sort_order: 1 });

export type SiteStatDocument = InferSchemaType<typeof siteStatSchema>;

export const SiteStat = models.SiteStat ?? model("SiteStat", siteStatSchema, "site_stats");
