"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { saveStanding } from "@/lib/actions/about";
import type { ActionState } from "@/lib/actions/shared";
import type { StandingDoc } from "@/models/Standing";

export function StandingForm({
  standing,
  onSuccess,
}: {
  standing?: StandingDoc;
  onSuccess: () => void;
}) {
  const action = saveStanding.bind(null, standing?._id ?? null);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useEffect(() => {
    if (state.success) {
      toast.success(standing ? "Updated." : "Added.");
      onSuccess();
    }
  }, [state, standing, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="information">Standing</Label>
        <p className="text-sm text-muted-foreground">
          One line for a role, honor, or affiliation — shown as a bullet
          under &ldquo;My Standings&rdquo; on the About page.
        </p>
        <RichTextEditor
          name="information"
          defaultValue={standing?.information}
          label="Standing"
          placeholder="e.g. President, Ontario History and Social Sciences Teachers' Association"
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
