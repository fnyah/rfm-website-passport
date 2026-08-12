import { Schema, model, models } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, required: true },
  // Rendered as sanitized rich-text HTML (see src/lib/sanitize.ts)
  description: { type: String, required: true },
  author: { type: String },
  // Blob URLs (was GridFS filenames before the file migration)
  filename: { type: [String], default: [] },
  // Raw pasted video URLs; embeddable links are derived at render time by
  // src/lib/video.ts (ported from middleware/prepVideoLink.js)
  videoLink: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export type ProjectDoc = {
  _id: string;
  title: string;
  description: string;
  author?: string;
  filename: string[];
  videoLink: string[];
  createdAt: string;
};

export const Project = models.Project ?? model("Project", projectSchema, "projects");
