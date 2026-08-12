import { Schema, model, models } from "mongoose";

// Homepage slideshow photo. `filename` historically held a GridFS filename;
// after the Blob migration it holds a full Vercel Blob URL. Field name is
// kept as-is to avoid an extra migration of the field itself.
const photoSchema = new Schema({
  filename: { type: String, required: true },
  link: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export type PhotoDoc = {
  _id: string;
  filename: string;
  link?: string;
  description?: string;
  createdAt: string;
};

// Old Express app registered this as `mongoose.model('PhotoLink', ...)`,
// which put it in the "photolinks" collection — keep pointing there.
export const Photo = models.PhotoLink ?? model("PhotoLink", photoSchema, "photolinks");
