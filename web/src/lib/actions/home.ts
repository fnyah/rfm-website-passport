"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Home } from "@/models/Home";
import { Photo } from "@/models/Photo";
import { requireSession, type ActionState } from "@/lib/actions/shared";

export async function saveHomePost(
  id: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) return { error: "Please enter a title." };
  if (!description) return { error: "Please enter a description." };

  await connectToDatabase();
  if (id) {
    await Home.findByIdAndUpdate(id, { title, description });
  } else {
    await Home.create({ title, description });
  }

  revalidatePath("/admin/home");
  revalidatePath("/");
  redirect("/admin/home?saved=1");
}

export async function deleteHomePost(id: string) {
  await requireSession();
  await connectToDatabase();
  await Home.findByIdAndDelete(id);
  revalidatePath("/admin/home");
  revalidatePath("/");
  redirect("/admin/home?deleted=1");
}

export async function saveHomePhoto(
  id: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSession();

  const filename = String(formData.get("filename") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!filename) return { error: "Please add a photo." };

  await connectToDatabase();
  const data = {
    filename,
    link: link || undefined,
    description: description || undefined,
  };

  if (id) {
    await Photo.findByIdAndUpdate(id, data);
  } else {
    await Photo.create(data);
  }

  revalidatePath("/admin/home");
  revalidatePath("/");
  redirect("/admin/home/photos?saved=1");
}

export async function deleteHomePhoto(id: string) {
  await requireSession();
  await connectToDatabase();
  await Photo.findByIdAndDelete(id);
  revalidatePath("/admin/home");
  revalidatePath("/");
  redirect("/admin/home/photos?deleted=1");
}
