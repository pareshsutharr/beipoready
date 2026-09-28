import { Schema, model, models, type InferSchemaType } from "mongoose";

const contactOtpSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    code_hash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    verify_token: { type: String, default: null },
    consumed: { type: Boolean, default: false },
    expires_at: { type: Date, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

contactOtpSchema.index({ email: 1, created_at: -1 });
// TTL cleanup — Mongo drops each doc once its own expires_at passes.
contactOtpSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export type ContactOtpDocument = InferSchemaType<typeof contactOtpSchema>;

export const ContactOtp = models.ContactOtp ?? model("ContactOtp", contactOtpSchema, "contact_otps");
