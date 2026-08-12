"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUploader } from "@/components/admin/image-uploader";
import { saveBlogPost } from "@/lib/actions/blog";
import type { ActionState } from "@/lib/actions/shared";
import type { BlogPostDoc } from "@/models/Blog";

export function BlogPostForm({
  post,
  onSuccess,
}: {
  post?: BlogPostDoc;
  onSuccess: () => void;
}) {
  const action = saveBlogPost.bind(null, post?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success(post ? "Post updated." : "Post added.");
      onSuccess();
    }
  }, [state, post, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={post?.title} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <RichTextEditor
          name="description"
          defaultValue={post?.description}
          label="Description"
          placeholder="A short guide or summary for educators"
        />
      </div>

      <ImageUploader
        name="filename"
        label="Photos (optional)"
        multiple
        defaultUrls={post?.filename ?? []}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="links">Source links (optional)</Label>
        <p className="text-sm text-muted-foreground">
          Paste one or more web addresses, separated by commas.
        </p>
        <Textarea
          id="links"
          name="links"
          rows={2}
          defaultValue={post?.links?.join(", ")}
          placeholder="example.com/lesson-plan"
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
