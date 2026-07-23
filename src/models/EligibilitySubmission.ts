import { Schema, model, models, type InferSchemaType } from "mongoose";
import type { EligibilityStatus, RuleStatus } from "@/types";

const RULE_STATUSES: RuleStatus[] = ["pass", "fail", "flag", "pending"];
const ELIGIBILITY_STATUSES: EligibilityStatus[] = ["new", "reviewed", "contacted", "closed"];

const eligibilityCheckSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    exchanges: { type: [String], default: [] },
    status: { type: String, enum: RULE_STATUSES, required: true },
    message: { type: String, required: true },
  },
  { _id: false }
);

const eligibilitySubmissionSchema = new Schema(
  {
    organization_name: { type: String, required: true },
    incorporation_date: { type: String, default: null },
    operational_years: { type: Number, default: null },
    is_three_years_old: { type: Boolean, default: null },
    has_min_operating_profit: { type: Boolean, default: null },
    ofs_compliant: { type: Boolean, default: null },
    net_worth: { type: String, default: null },
    paid_up_capital: { type: String, default: null },
    net_tangible_assets: { type: String, default: null },
    fund_purposes: { type: [String], default: null },
    fund_purpose_other: { type: String, default: null },
    financials_file_path: { type: String, default: null },
    contact_details: { type: String, default: null },
    email: { type: String, required: true },
    website: { type: String, default: null },
    industry: { type: String, default: null },
    designation: { type: String, default: null },
    notes: { type: String, default: null },
    nse_status: { type: String, enum: RULE_STATUSES, default: null },
    bse_status: { type: String, enum: RULE_STATUSES, default: null },
    answers: { type: Schema.Types.Mixed, default: {} },
    checks: { type: [eligibilityCheckSchema], default: [] },
    status: { type: String, enum: ELIGIBILITY_STATUSES, default: "new" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

eligibilitySubmissionSchema.index({ email: 1 });
eligibilitySubmissionSchema.index({ status: 1 });

export type EligibilitySubmissionDocument = InferSchemaType<typeof eligibilitySubmissionSchema>;

export const EligibilitySubmission =
  models.EligibilitySubmission ??
  model("EligibilitySubmission", eligibilitySubmissionSchema, "eligibility_submissions");
