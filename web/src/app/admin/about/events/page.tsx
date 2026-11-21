import type { Metadata } from "next";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { ItemCard, ItemList } from "@/components/admin/item-card";
import { StatusBanner } from "@/components/admin/status-banner";
import { deleteEvent } from "@/lib/actions/about";
import { getEvents } from "@/lib/queries/about";

export const metadata: Metadata = { title: "Upcoming events" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage({ searchParams }: PageProps<"/admin/about/events">) {
  const [events, { saved, deleted }] = await Promise.all([getEvents(), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <StatusBanner saved={saved === "1"} deleted={deleted === "1"} />
      <AdminPageHeader
        title="Upcoming events"
        intro="These are the talks and events listed on your About page. Delete ones that have passed, or add a new one."
        addHref="/admin/about/events/new"
        addLabel="Add an event"
      />

      {events.length === 0 ? (
        <EmptyState>No events yet. Click &ldquo;Add an event&rdquo; to add your first one.</EmptyState>
      ) : (
        <ItemList>
          {events.map((event) => (
            <ItemCard
              key={event._id}
              title={event.eventDate}
              editHref={`/admin/about/events/${event._id}/edit`}
              deleteAction={deleteEvent.bind(null, event._id)}
              deleteLabel="this event"
            >
              <p>{event.information}</p>
            </ItemCard>
          ))}
        </ItemList>
      )}
    </div>
  );
}
