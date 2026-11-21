"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/db";
import { Standing } from "@/models/Standing";
import { Event } from "@/models/Event";
import { requireSession, type ActionState } from "@/lib/actions/shared";

export async function saveStanding(
  id: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSession();

  const information = String(formData.get("information") ?? "").trim();
  if (!information) return { error: "Please enter some text." };

  await connectToDatabase();
  if (id) {
    await Standing.findByIdAndUpdate(id, { information });
  } else {
    await Standing.create({ information });
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?saved=1");
}

export async function deleteStanding(id: string) {
  await requireSession();
  await connectToDatabase();
  await Standing.findByIdAndDelete(id);
  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about?deleted=1");
}

export async function saveEvent(
  id: string | null,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireSession();

  const eventDate = String(formData.get("eventDate") ?? "").trim();
  const information = String(formData.get("information") ?? "").trim();

  if (!eventDate) return { error: "Please enter a date." };
  if (!information) return { error: "Please enter a description." };

  await connectToDatabase();
  if (id) {
    await Event.findByIdAndUpdate(id, { eventDate, information });
  } else {
    await Event.create({ eventDate, information });
  }

  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about/events?saved=1");
}

export async function deleteEvent(id: string) {
  await requireSession();
  await connectToDatabase();
  await Event.findByIdAndDelete(id);
  revalidatePath("/admin/about");
  revalidatePath("/about");
  redirect("/admin/about/events?deleted=1");
}
