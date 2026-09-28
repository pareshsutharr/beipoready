import { Counter } from "@/models/Counter";

const LEAD_SERIAL_PREFIX = "BEIPOREADY";

/** Atomically reserves the next lead serial: BEIPOREADY-0001, BEIPOREADY-0002, … (grows past 9999). */
export async function nextLeadSerial(): Promise<string> {
  const counter = await Counter.findOneAndUpdate(
    { _id: "lead" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  ).lean<{ seq: number }>();

  return `${LEAD_SERIAL_PREFIX}-${String(counter!.seq).padStart(4, "0")}`;
}
