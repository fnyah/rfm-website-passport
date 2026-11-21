"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  Field,
  FormActions,
  formClassName,
  inputClassName,
  textareaClassName,
} from "@/components/admin/form-parts";
import { saveProject } from "@/lib/actions/projects";
import type { ActionState } from "@/lib/actions/shared";
import type { ProjectDoc } from "@/models/Project";

export function ProjectForm({ project }: { project?: ProjectDoc }) {
  const action = saveProject.bind(null, project?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className={formClassName}>
      <Field id="title" label="Project name" hint="Shown as the heading on the Student projects page.">
        <Input id="title" name="title" defaultValue={project?.title} required className={inputClassName} />
      </Field>

      <Field id="author" label="Student name or names" optional>
        <Input id="author" name="author" defaultValue={project?.author} className={inputClassName} />
      </Field>

      <Field id="description" label="About this project" hint="What the students made, and why it matters.">
        <RichTextEditor
          id="description"
          name="description"
          defaultValue={project?.description}
          label="About this project"
          placeholder="What is this project about?"
        />
      </Field>

      <ImageUploader
        name="filename"
        label="Photos"
        optional
        helperText="Shown together on the project’s page."
        multiple
        defaultUrls={project?.filename ?? []}
      />

      <Field
        id="videoLinks"
        label="YouTube videos"
        optional
        hint="Paste the web address of each video. Put a comma between them."
      >
        <Textarea
          id="videoLinks"
          name="videoLinks"
          rows={2}
          defaultValue={project?.videoLink?.join(", ")}
          placeholder="https://www.youtube.com/watch?v=..."
          className={textareaClassName}
        />
      </Field>

      <FormActions
        pending={pending}
        error={state.error}
        cancelHref="/admin/projects"
        saveLabel={project ? "Save changes" : "Add this project"}
      />
    </form>
  );
}
