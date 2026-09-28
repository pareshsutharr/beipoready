import { Schema, model, models, type InferSchemaType } from "mongoose";

const OUTBOUND_EMAIL_AUDIENCE_KINDS = ["manual", "leads"] as const;
const OUTBOUND_EMAIL_STATUSES = ["sent", "partial", "failed"] as const;
const OUTBOUND_EMAIL_RECIPIENT_STATUSES = ["sent", "failed"] as const;

const outboundEmailRecipientSchema = new Schema(
  {
    email: { type: String, required: true },
    lead_source: { type: String, default: null },
    status: { type: String, enum: OUTBOUND_EMAIL_RECIPIENT_STATUSES, required: true },
    message_id: { type: String, default: null },
    response: { type: String, default: null },
    error: { type: String, default: null },
    tracking_token: { type: String, default: null },
  },
  { _id: false }
);

const outboundEmailCampaignSchema = new Schema(
  {
    audience_kind: { type: String, enum: OUTBOUND_EMAIL_AUDIENCE_KINDS, required: true },
    audience_label: { type: String, required: true },
    source_filter: { type: String, default: null },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    format: { type: String, enum: ["text", "html"], default: "text" },
    initiated_by_email: { type: String, required: true },
    send_copy_to_sender: { type: Boolean, default: false },
    copy_recipient: { type: String, default: null },
    copy_status: { type: String, enum: [...OUTBOUND_EMAIL_RECIPIENT_STATUSES, null], default: null },
    copy_message_id: { type: String, default: null },
    copy_response: { type: String, default: null },
    copy_error: { type: String, default: null },
    attempted_count: { type: Number, default: 0 },
    sent_count: { type: Number, default: 0 },
    failed_count: { type: Number, default: 0 },
    status: { type: String, enum: OUTBOUND_EMAIL_STATUSES, required: true },
    recipients: { type: [outboundEmailRecipientSchema], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

outboundEmailCampaignSchema.index({ created_at: -1 });
outboundEmailCampaignSchema.index({ status: 1, created_at: -1 });
outboundEmailCampaignSchema.index({ source_filter: 1, created_at: -1 });

export type OutboundEmailCampaignDocument = InferSchemaType<typeof outboundEmailCampaignSchema>;

export const OutboundEmailCampaign =
  models.OutboundEmailCampaign ??
  model("OutboundEmailCampaign", outboundEmailCampaignSchema, "outbound_email_campaigns");
