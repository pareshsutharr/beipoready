import type { Types } from "mongoose";

type WithMongoId = {
  _id: Types.ObjectId | string;
  [key: string]: unknown;
};

function serializeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (value && typeof value === "object" && !(value as { _bsontype?: string })._bsontype) {
    return serializePlainObject(value as Record<string, unknown>);
  }
  return value;
}

function serializePlainObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = serializeValue(value);
  }
  return result;
}

/**
 * Converts a lean Mongoose document into a plain object: `_id` becomes a
 * string `id`, and `Date` fields become ISO strings, matching the
 * `created_at`/`published_at`/etc. string types the rest of the app expects.
 */
export function toPlain<T extends WithMongoId>(doc: T): Omit<T, "_id"> & { id: string } {
  const { _id, ...rest } = doc;
  const serialized = serializePlainObject(rest as Record<string, unknown>);
  return { id: String(_id), ...serialized } as Omit<T, "_id"> & { id: string };
}

export function toPlainArray<T extends WithMongoId>(docs: T[]): (Omit<T, "_id"> & { id: string })[] {
  return docs.map(toPlain);
}
