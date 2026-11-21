import "server-only";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Home, type HomePostDoc } from "@/models/Home";
import { Photo, type PhotoDoc } from "@/models/Photo";
import { toPlain } from "@/lib/serialize";

export async function getHomePosts(): Promise<HomePostDoc[]> {
  await connectToDatabase();
  const posts = await Home.find().sort({ createdAt: -1 }).lean();
  return toPlain(posts);
}

export async function getHomePhotos(): Promise<PhotoDoc[]> {
  await connectToDatabase();
  const photos = await Photo.find().sort({ createdAt: -1 }).lean();
  return toPlain(photos);
}

export async function getHomePost(id: string): Promise<HomePostDoc | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const post = await Home.findById(id).lean();
  return post ? toPlain(post) : null;
}

export async function getHomePhoto(id: string): Promise<PhotoDoc | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const photo = await Photo.findById(id).lean();
  return photo ? toPlain(photo) : null;
}
