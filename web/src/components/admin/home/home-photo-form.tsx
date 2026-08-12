"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { ImageUploader } from "@/components/admin/image-uploader";
import { saveHomePhoto } from "@/lib/actions/home";
import type { ActionState } from "@/lib/actions/shared";
import type { PhotoDoc } from "@/models/Photo";

export function HomePhotoForm({
  photo,
  onSuccess,
}: {
  photo?: PhotoDoc;
  onSuccess: () => void;
}) {
  const action = saveHomePhoto.bind(null, photo?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success(photo ? "Photo updated." : "Photo added.");
      onSuccess();
    }
  }, [state, photo, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <ImageUploader
        name="filename"
        label="Photo"
        helperText="Shown in the scrolling banner on the homepage. Square photos work best."
        defaultUrls={photo?.filename ? [photo.filename] : []}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Caption (optional)</Label>
        <p className="text-sm text-muted-foreground">
          Appears over the photo when a visitor hovers over it.
        </p>
        <Textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={photo?.description}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="link">Link (optional)</Label>
        <p className="text-sm text-muted-foreground">
          If set, clicking the photo opens this web address in a new tab.
        </p>
        <Input
          id="link"
          name="link"
          type="url"
          placeholder="https://example.com"
          defaultValue={photo?.link}
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
