import type { Metadata } from "next";
import { AdminFormPage } from "@/components/admin/admin-page";
import { EventForm } from "@/components/admin/about/event-form";

export const metadata: Metadata = { title: "Add an event" };

export default function NewEventPage() {
  return (
    <AdminFormPage
      backHref="/admin/about/events"
      backLabel="Back to Upcoming events"
      title="Add an event"
      intro="Fill in the boxes below, then click “Add this event”. It will appear on your About page."
    >
      <EventForm />
    </AdminFormPage>
  );
}
