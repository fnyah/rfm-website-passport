import "server-only";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Project, type ProjectDoc } from "@/models/Project";
import { toPlain } from "@/lib/serialize";

export async function getProjects(): Promise<ProjectDoc[]> {
  await connectToDatabase();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return toPlain(projects);
}

export async function getProject(id: string): Promise<ProjectDoc | null> {
  if (!isValidObjectId(id)) return null;
  await connectToDatabase();
  const project = await Project.findById(id).lean();
  return project ? toPlain(project) : null;
}
