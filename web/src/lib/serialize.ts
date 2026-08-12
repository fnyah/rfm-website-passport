/**
 * Converts a Mongoose `.lean()` result (ObjectId, Date, etc.) into a plain
 * JSON-safe value, so it's always safe to pass from a Server Component data
 * fetch into a Client Component prop or a `<form>` default value.
 */
export function toPlain<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}
