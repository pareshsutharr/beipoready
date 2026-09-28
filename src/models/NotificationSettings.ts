import { Schema, model, models, type InferSchemaType } from "mongoose";

// Singleton document (one row, upserted in place) holding the admin address(es)
// that receive auto-notifications for on-site activity, plus a per-category
// toggle so any one event type can be muted without losing the addresses.
const notificationSettingsSchema = new Schema(
  {
    notification_emails: { type: [String], default: [] },
    // CallMeBot WhatsApp alert targets (see src/lib/whatsapp.ts); each number has its own API key.
    whatsapp_recipients: {
      type: [{ _id: false, phone: { type: String, required: true }, api_key: { type: String, default: "" } }],
      default: [],
    },
    notify_on_lead: { type: Boolean, default: true },
    notify_on_newsletter: { type: Boolean, default: true },
    notify_on_eligibility: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export type NotificationSettingsDocument = InferSchemaType<typeof notificationSettingsSchema>;

export const NotificationSettings =
  models.NotificationSettings ?? model("NotificationSettings", notificationSettingsSchema, "notification_settings");
