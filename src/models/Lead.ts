import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { LeadSource, LeadStatus } from "@/types";

const LEAD_SOURCES: LeadSource[] = [
  "contact",
  "readiness-tool",
  "issue-size-calculator",
  "issue-cost-estimator",
  "sme-ipo-checklist",
  "home-cta",
  "newsletter",
  "case-study",
  "services",
];

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed"];

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    company_name: { type: String, default: null },
    service_interest: { type: String, default: null },
    message: { type: String, default: null },
    source: { type: String, enum: LEAD_SOURCES, required: true },
    readiness_score: { type: Number, default: null },
    issue_size_estimate: { type: String, default: null },
    status: { type: String, enum: LEAD_STATUSES, default: "new" },
    notes: { type: String, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

leadSchema.index({ email: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ status: 1 });

export type LeadDocument = InferSchemaType<typeof leadSchema>;

export const Lead = models.Lead ?? model("Lead", leadSchema, "leads");
