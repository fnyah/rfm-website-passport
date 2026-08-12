import { Schema, model, models } from "mongoose";

// "For Educators" resource post.
const blogSchema = new Schema({
  title: { type: String, required: true },
  // Rendered as sanitized rich-text HTML (see src/lib/sanitize.ts)
  description: { type: String, required: true },
  // Blob URLs (was GridFS filenames before the file migration)
  filename: { type: [String], default: [] },
  links: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export type BlogPostDoc = {
  _id: string;
  title: string;
  description: string;
  filename: string[];
  links: string[];
  createdAt: string;
};

export const BlogPost = models.Blog ?? model("Blog", blogSchema, "blogs");
