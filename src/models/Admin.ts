import { Schema, model, models, type InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export type AdminDocument = InferSchemaType<typeof adminSchema>;

export const Admin = models.Admin ?? model("Admin", adminSchema, "admins");
