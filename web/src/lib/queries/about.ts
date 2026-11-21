import "server-only";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Standing, type StandingDoc } from "@/models/Standing";
import { Event, type EventDoc } from "@/models/Event";
import { toPlain } from "@/lib/serialize";

export async function getStandings(): Promise<StandingDoc[]> {
  await connectToDatabase();
  const standings = await Standing.find().sort({ createdAt: -1 }).lean();
  return toPlain(standings);
}

export async function getEvents(): Promise<EventDoc[]> {
  await connectToDatabase();
  const events = await Event.find().sort({ createdAt: -1 }).lean();
  return toPlain(events);
}

export async function getStanding(id: string): Promise<StandingDoc | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const standing = await Standing.findById(id).lean();
  return standing ? toPlain(standing) : null;
}

export async function getEvent(id: string): Promise<EventDoc | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const event = await Event.findById(id).lean();
  return event ? toPlain(event) : null;
}
