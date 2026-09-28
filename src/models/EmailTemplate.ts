import { Schema, model, models, type InferSchemaType } from "mongoose";
import { CUSTOMIZABLE_TEMPLATE_KEYS, EMAIL_TEMPLATE_FORMATS } from "@/lib/email-templates";

const emailTemplateSchema = new Schema(
  {
    key: { type: String, enum: CUSTOMIZABLE_TEMPLATE_KEYS, required: true, unique: true },
    subject: { type: String, required: true },
    /** Plain-message body, edited in the "Simple text" tab. */
    body: { type: String, default: "" },
    /** Raw HTML fragment, edited in the "Customize by code" tab. Independent from `body` so switching tabs never loses either draft. */
    htmlBody: { type: String, default: "" },
    /** Which of body/htmlBody is actually used when this template sends. */
    format: { type: String, enum: EMAIL_TEMPLATE_FORMATS, default: "text" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export type EmailTemplateDocument = InferSchemaType<typeof emailTemplateSchema>;

export const EmailTemplate = models.EmailTemplate ?? model("EmailTemplate", emailTemplateSchema, "email_templates");
