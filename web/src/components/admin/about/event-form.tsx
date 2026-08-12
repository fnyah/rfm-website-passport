"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { saveEvent } from "@/lib/actions/about";
import type { ActionState } from "@/lib/actions/shared";
import type { EventDoc } from "@/models/Event";

export function EventForm({
  event,
  onSuccess,
}: {
  event?: EventDoc;
  onSuccess: () => void;
}) {
  const action = saveEvent.bind(null, event?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success(event ? "Event updated." : "Event added.");
      onSuccess();
    }
  }, [state, event, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="eventDate">Date</Label>
        <p className="text-sm text-muted-foreground">
          Shown exactly as typed — e.g. &ldquo;March 2026&rdquo; or &ldquo;Fall
          2025&rdquo;.
        </p>
        <Input
          id="eventDate"
          name="eventDate"
          defaultValue={event?.eventDate}
          placeholder="March 2026"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="information">What&rsquo;s happening</Label>
        <Textarea
          id="information"
          name="information"
          rows={3}
          defaultValue={event?.information}
          required
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
