"use client";

import { useActionState } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Field, FormActions, formClassName } from "@/components/admin/form-parts";
import { saveStanding } from "@/lib/actions/about";
import type { ActionState } from "@/lib/actions/shared";
import type { StandingDoc } from "@/models/Standing";

export function StandingForm({ standing }: { standing?: StandingDoc }) {
  const action = saveStanding.bind(null, standing?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className={formClassName}>
      <Field
        id="information"
        label="Role or honour"
        hint="One line, shown as a bullet point under “My Standings”."
      >
        <RichTextEditor
          id="information"
          name="information"
          defaultValue={standing?.information}
          label="Role or honour"
          placeholder="e.g. President, Ontario History and Social Sciences Teachers' Association"
        />
      </Field>

      <FormActions
        pending={pending}
        error={state.error}
        cancelHref="/admin/about"
        saveLabel={standing ? "Save changes" : "Add this role"}
      />
    </form>
  );
}
