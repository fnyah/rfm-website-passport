"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import { BlogPost } from "@/models/Blog";
import { requireSession, type ActionState } from "@/lib/actions/shared";
import { parseLinksInput } from "@/lib/links";

export async function saveBlogPost(
  id: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const linksInput = String(formData.get("links") ?? "").trim();
  const filename = formData.getAll("filename").map(String).filter(Boolean);

  if (!title) return { error: "Please enter a title." };
  if (!description) return { error: "Please enter a description." };

  const links = parseLinksInput(linksInput);

  await connectToDatabase();
  const data = { title, description, filename, links };

  if (id) {
    await BlogPost.findByIdAndUpdate(id, data);
  } else {
    await BlogPost.create(data);
  }

  revalidatePath("/admin/for-educators");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPost(id: string) {
  await requireSession();
  await connectToDatabase();
  await BlogPost.findByIdAndDelete(id);
  revalidatePath("/admin/for-educators");
  revalidatePath("/blog");
}
