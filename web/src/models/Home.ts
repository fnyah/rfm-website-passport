import { Schema, model, models } from "mongoose";

const homeSchema = new Schema({
  title: { type: String, required: true },
  // Rendered as sanitized rich-text HTML (see src/lib/sanitize.ts)
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Plain, JSON-serializable shape — what queries actually hand back after the
// JSON round-trip in src/lib/queries (ObjectId -> string, Date -> ISO string),
// so it's safe to pass straight into Client Components.
export type HomePostDoc = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
};

// Explicit collection name: this must keep pointing at the same collection
// the old Express app wrote to ("homes", from `mongoose.model('Home', ...)`).
export const Home = models.Home ?? model("Home", homeSchema, "homes");
