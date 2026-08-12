import { Schema, model, models } from "mongoose";

// Single admin account. hash/salt are pbkdf2 (see src/lib/password.ts) —
// kept as-is so the existing password keeps working after the rework.
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  admin: { type: Boolean, default: true },
});

export type UserDoc = {
  _id: string;
  username: string;
  hash: string;
  salt: string;
  admin?: boolean;
};

export const User = models.User ?? model("User", userSchema, "users");
