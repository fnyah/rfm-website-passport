"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FormActions,
  formClassName,
  inputClassName,
  textareaClassName,
} from "@/components/admin/form-parts";
import { saveEvent } from "@/lib/actions/about";
import type { ActionState } from "@/lib/actions/shared";
import type { EventDoc } from "@/models/Event";

export function EventForm({ event }: { event?: EventDoc }) {
  const action = saveEvent.bind(null, event?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className={formClassName}>
      <Field
        id="eventDate"
        label="When"
        hint="Shown exactly as you type it, for example “March 2026” or “Fall 2025”."
      >
        <Input
          id="eventDate"
          name="eventDate"
          defaultValue={event?.eventDate}
          placeholder="March 2026"
          required
          className={inputClassName}
        />
      </Field>

      <Field id="information" label="What’s happening" hint="One or two sentences about the event.">
        <Textarea
          id="information"
          name="information"
          rows={3}
          defaultValue={event?.information}
          required
          className={textareaClassName}
        />
      </Field>

      <FormActions
        pending={pending}
        error={state.error}
        cancelHref="/admin/about/events"
        saveLabel={event ? "Save changes" : "Add this event"}
      />
    </form>
  );
}
