import { Schema, model, models } from "mongoose";

/** Named monotonic sequences (e.g. `{ _id: "lead", seq: 42 }`), incremented atomically. */
const counterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { versionKey: false }
);

export const Counter = models.Counter ?? model("Counter", counterSchema, "counters");
