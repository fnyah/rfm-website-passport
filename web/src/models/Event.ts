import { Schema, model, models } from "mongoose";

// A timeline entry on the About page. `eventDate` is a free-text string in
// the original app (e.g. "2019" or "Fall 2020"), not a Date — kept as-is.
const eventSchema = new Schema({
  information: { type: String, required: true },
  eventDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export type EventDoc = {
  _id: string;
  information: string;
  eventDate: string;
  createdAt: string;
};

export const Event = models.Events ?? model("Events", eventSchema, "events");
