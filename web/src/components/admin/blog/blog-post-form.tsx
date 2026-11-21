"use client";

import { useActionState, useState } from "react";
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
import { saveBlogPost } from "@/lib/actions/blog";
import type { ActionState } from "@/lib/actions/shared";
import type { BlogPostDoc } from "@/models/Blog";

export function BlogPostForm({ post }: { post?: BlogPostDoc }) {
  const action = saveBlogPost.bind(null, post?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});
  const [uploading, setUploading] = useState(false);

  return (
    <form action={formAction} className={formClassName}>
      <Field id="title" label="Title" hint="Shown as the heading on the For educators page.">
        <Input id="title" name="title" defaultValue={post?.title} required className={inputClassName} />
      </Field>

      <Field id="description" label="What teachers will find" hint="A short guide or summary for educators.">
        <RichTextEditor
          id="description"
          name="description"
          defaultValue={post?.description}
          label="What teachers will find"
          placeholder="A short guide or summary for educators"
        />
      </Field>

      <ImageUploader
        onUploadingChange={setUploading}
        name="filename"
        label="Photos"
        optional
        multiple
        defaultUrls={post?.filename ?? []}
      />

      <Field
        id="links"
        label="Links to resources"
        optional
        hint="Paste the web address of each resource. Put a comma between them."
      >
        <Textarea
          id="links"
          name="links"
          rows={2}
          defaultValue={post?.links?.join(", ")}
          placeholder="www.example.com/lesson-plan"
          className={textareaClassName}
        />
      </Field>

      <FormActions
        pending={pending}
        uploading={uploading}
        error={state.error}
        cancelHref="/admin/for-educators"
        saveLabel={post ? "Save changes" : "Add this resource"}
      />
    </form>
  );
}
