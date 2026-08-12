"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { saveHomePost } from "@/lib/actions/home";
import type { ActionState } from "@/lib/actions/shared";
import type { HomePostDoc } from "@/models/Home";

export function HomePostForm({
  post,
  onSuccess,
}: {
  post?: HomePostDoc;
  onSuccess: () => void;
}) {
  const action = saveHomePost.bind(null, post?._id ?? null);
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
        <p className="text-sm text-muted-foreground">
          The course or project name, shown as a heading on the homepage.
        </p>
        <Input id="title" name="title" defaultValue={post?.title} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <p className="text-sm text-muted-foreground">
          A short paragraph shown underneath the title.
        </p>
        <RichTextEditor
          name="description"
          defaultValue={post?.description}
          label="Description"
          placeholder="What is this course or project about?"
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
