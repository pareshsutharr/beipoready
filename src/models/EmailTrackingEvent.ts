import { Schema, model, models, type InferSchemaType } from "mongoose";

const EMAIL_TRACKING_KINDS = ["welcome", "campaign"] as const;

const clickSchema = new Schema(
  {
    url: { type: String, required: true },
    clicked_at: { type: Date, required: true },
  },
  { _id: false }
);

const emailTrackingEventSchema = new Schema(
  {
    token: { type: String, required: true },
    email: { type: String, required: true },
    kind: { type: String, enum: EMAIL_TRACKING_KINDS, required: true },
    campaign_id: { type: Schema.Types.ObjectId, ref: "OutboundEmailCampaign", default: null },
    sent_at: { type: Date, required: true, default: () => new Date() },
    click_count: { type: Number, default: 0 },
    clicks: { type: [clickSchema], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

emailTrackingEventSchema.index({ token: 1 }, { unique: true });
emailTrackingEventSchema.index({ campaign_id: 1 });

export type EmailTrackingEventDocument = InferSchemaType<typeof emailTrackingEventSchema>;

export const EmailTrackingEvent =
  models.EmailTrackingEvent ?? model("EmailTrackingEvent", emailTrackingEventSchema, "email_tracking_events");
