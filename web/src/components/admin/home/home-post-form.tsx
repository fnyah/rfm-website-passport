"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Field, FormActions, formClassName, inputClassName } from "@/components/admin/form-parts";
import { saveHomePost } from "@/lib/actions/home";
import type { ActionState } from "@/lib/actions/shared";
import type { HomePostDoc } from "@/models/Home";

export function HomePostForm({ post }: { post?: HomePostDoc }) {
  const action = saveHomePost.bind(null, post?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className={formClassName}>
      <Field id="title" label="Course name" hint="Shown as a heading on your home page.">
        <Input id="title" name="title" defaultValue={post?.title} required className={inputClassName} />
      </Field>

      <Field
        id="description"
        label="About this course"
        hint="A short paragraph shown under the course name."
      >
        <RichTextEditor
          id="description"
          name="description"
          defaultValue={post?.description}
          label="About this course"
          placeholder="What is this course or project about?"
        />
      </Field>

      <FormActions
        pending={pending}
        error={state.error}
        cancelHref="/admin/home"
        saveLabel={post ? "Save changes" : "Add this course"}
      />
    </form>
  );
}
