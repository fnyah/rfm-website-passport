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
import { saveProject } from "@/lib/actions/projects";
import type { ActionState } from "@/lib/actions/shared";
import type { ProjectDoc } from "@/models/Project";

export function ProjectForm({
  project,
  onSuccess,
}: {
  project?: ProjectDoc;
  onSuccess: () => void;
}) {
  const action = saveProject.bind(null, project?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success(project ? "Project updated." : "Project added.");
      onSuccess();
    }
  }, [state, project, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={project?.title} required />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="author">Student name(s) (optional)</Label>
        <Input id="author" name="author" defaultValue={project?.author} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <RichTextEditor
          name="description"
          defaultValue={project?.description}
          label="Description"
          placeholder="What is this project about?"
        />
      </div>

      <ImageUploader
        name="filename"
        label="Photos (optional)"
        helperText="Shown as a photo grid on the project's page."
        multiple
        defaultUrls={project?.filename ?? []}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="videoLinks">Video links (optional)</Label>
        <p className="text-sm text-muted-foreground">
          Paste one or more YouTube links, separated by commas.
        </p>
        <Textarea
          id="videoLinks"
          name="videoLinks"
          rows={2}
          defaultValue={project?.videoLink?.join(", ")}
          placeholder="https://www.youtube.com/watch?v=..."
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
