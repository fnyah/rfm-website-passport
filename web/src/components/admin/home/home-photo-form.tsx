"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  Field,
  FormActions,
  formClassName,
  inputClassName,
  textareaClassName,
} from "@/components/admin/form-parts";
import { saveHomePhoto } from "@/lib/actions/home";
import type { ActionState } from "@/lib/actions/shared";
import type { PhotoDoc } from "@/models/Photo";

export function HomePhotoForm({ photo }: { photo?: PhotoDoc }) {
  const action = saveHomePhoto.bind(null, photo?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className={formClassName}>
      <ImageUploader
        name="filename"
        label="Photo"
        helperText="Square photos look best in the banner."
        defaultUrls={photo?.filename ? [photo.filename] : []}
      />

      <Field
        id="description"
        label="Caption"
        optional
        hint="Appears on the photo when a visitor points at it."
      >
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={photo?.description}
          className={textareaClassName}
        />
      </Field>

      <Field
        id="link"
        label="Web address to open"
        optional
        hint="If you add one, clicking the photo opens this page."
      >
        <Input
          id="link"
          name="link"
          type="url"
          placeholder="https://www.example.com"
          defaultValue={photo?.link}
          className={inputClassName}
        />
      </Field>

      <FormActions
        pending={pending}
        error={state.error}
        cancelHref="/admin/home/photos"
        saveLabel={photo ? "Save changes" : "Add this photo"}
      />
    </form>
  );
}
