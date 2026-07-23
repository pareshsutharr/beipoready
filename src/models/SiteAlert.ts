import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { SiteAlertPlacement } from "@/types";

const PLACEMENTS: SiteAlertPlacement[] = ["banner", "popup"];

const siteAlertSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    cta_label: { type: String, default: null },
    cta_href: { type: String, default: null },
    placement: { type: String, enum: PLACEMENTS, default: "banner" },
    is_active: { type: Boolean, default: false },
    starts_at: { type: Date, default: null },
    ends_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

siteAlertSchema.index({ is_active: 1, placement: 1, created_at: -1 });

export type SiteAlertDocument = InferSchemaType<typeof siteAlertSchema>;

export const SiteAlert = models.SiteAlert ?? model("SiteAlert", siteAlertSchema, "site_alerts");
