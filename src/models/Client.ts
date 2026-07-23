import { Schema, model, models, type InferSchemaType } from "mongoose";

const clientSchema = new Schema(
  {
    name: { type: String, required: true },
    logo_url: { type: String, required: true },
    website_url: { type: String, default: null },
    nature_of_business: { type: String, default: null },
    sort_order: { type: Number, default: 0 },
    is_published: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

clientSchema.index({ is_published: 1, sort_order: 1 });

export type ClientDocument = InferSchemaType<typeof clientSchema>;

export const Client = models.Client ?? model("Client", clientSchema, "clients");
