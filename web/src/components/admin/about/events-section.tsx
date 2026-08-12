"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminItemDialog } from "@/components/admin/admin-item-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { EventForm } from "@/components/admin/about/event-form";
import { deleteEvent } from "@/lib/actions/about";
import type { EventDoc } from "@/models/Event";

type DialogState = { mode: "create" } | { mode: "edit"; event: EventDoc } | null;

export function EventsSection({ events }: { events: EventDoc[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-medium">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground">
            The events list on the About page. Remove past events any time.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((event) => (
          <Card key={event._id}>
            <CardContent className="flex items-start justify-between gap-4">
              <p className="min-w-0 text-sm">
                <span className="font-medium">{event.eventDate}</span>{" "}
                &mdash; {event.information}
              </p>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Edit event"
                  onClick={() => setDialog({ mode: "edit", event })}
                >
                  <Pencil className="size-4" />
                </Button>
                <ConfirmDeleteButton
                  itemLabel="event"
                  action={deleteEvent.bind(null, event._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No events yet. Add your first one above.
          </p>
        )}
      </div>

      <AdminItemDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.mode === "edit" ? "Edit event" : "Add an event"}
      >
        {dialog && (
          <EventForm
            key={dialog.mode === "edit" ? dialog.event._id : "new"}
            event={dialog.mode === "edit" ? dialog.event : undefined}
            onSuccess={() => setDialog(null)}
          />
        )}
      </AdminItemDialog>
    </div>
  );
}
