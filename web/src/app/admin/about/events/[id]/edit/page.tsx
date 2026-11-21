import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFormPage } from "@/components/admin/admin-page";
import { EventForm } from "@/components/admin/about/event-form";
import { getEvent } from "@/lib/queries/about";

export const metadata: Metadata = { title: "Edit event" };
export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: PageProps<"/admin/about/events/[id]/edit">) {
  const event = await getEvent((await params).id);
  if (!event) notFound();

  return (
    <AdminFormPage
      backHref="/admin/about/events"
      backLabel="Back to Upcoming events"
      title="Edit event"
      intro="Change what you need, then click “Save changes”."
    >
      <EventForm event={event} />
    </AdminFormPage>
  );
}
