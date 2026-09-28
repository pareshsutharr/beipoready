import { randomUUID } from "crypto";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const NEWSLETTER_SUBSCRIBER_STATUSES = ["subscribed", "unsubscribed"] as const;
const WELCOME_EMAIL_STATUSES = ["sent", "failed"] as const;

const welcomeEmailSchema = new Schema(
  {
    status: { type: String, enum: WELCOME_EMAIL_STATUSES, default: null },
    sent_at: { type: Date, default: null },
    message_id: { type: String, default: null },
    error: { type: String, default: null },
    attempts: { type: Number, default: 0 },
  },
  { _id: false }
);

const newsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: NEWSLETTER_SUBSCRIBER_STATUSES, default: "subscribed" },
    unsubscribe_token: { type: String, required: true, default: () => randomUUID() },
    subscribed_at: { type: Date, default: () => new Date() },
    unsubscribed_at: { type: Date, default: null },
    lead_id: { type: Schema.Types.ObjectId, ref: "Lead", default: null },
    welcome_email: { type: welcomeEmailSchema, default: () => ({}) },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

newsletterSubscriberSchema.index({ email: 1 }, { unique: true });
newsletterSubscriberSchema.index({ unsubscribe_token: 1 }, { unique: true });
newsletterSubscriberSchema.index({ status: 1 });

export type NewsletterSubscriberDocument = InferSchemaType<typeof newsletterSubscriberSchema>;

export const NewsletterSubscriber =
  models.NewsletterSubscriber ??
  model("NewsletterSubscriber", newsletterSubscriberSchema, "newsletter_subscribers");
