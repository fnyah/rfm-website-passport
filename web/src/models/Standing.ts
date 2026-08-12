import { Schema, model, models } from "mongoose";

// A bio/"about me" block shown on the About page. Rendered as sanitized
// rich-text HTML (see src/lib/sanitize.ts).
const standingSchema = new Schema({
  information: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export type StandingDoc = {
  _id: string;
  information: string;
  createdAt: string;
};

export const Standing = models.Standings ?? model("Standings", standingSchema, "standings");
