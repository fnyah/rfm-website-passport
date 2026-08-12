"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { Project } from "@/models/Project";
import { requireSession, type ActionState } from "@/lib/actions/shared";
import { parseVideoLinksInput } from "@/lib/video";

export async function saveProject(
  id: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const videoLinksInput = String(formData.get("videoLinks") ?? "").trim();
  const filename = formData.getAll("filename").map(String).filter(Boolean);

  if (!title) return { error: "Please enter a title." };
  if (!description) return { error: "Please enter a description." };

  const videoLink = parseVideoLinksInput(videoLinksInput);

  await connectToDatabase();
  const data = { title, author: author || undefined, description, filename, videoLink };

  if (id) {
    await Project.findByIdAndUpdate(id, data);
  } else {
    await Project.create(data);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  await requireSession();
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
