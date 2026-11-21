"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * A real confirmation dialog (not `window.confirm`) in front of a delete
 * server action, with a pending state so it can't be double-submitted. The
 * action redirects back to the list with a "Deleted." banner.
 */
export function ConfirmDeleteButton({
  action,
  itemLabel,
}: {
  action: () => Promise<void>;
  /** e.g. "this course" — read as "Delete this course?" */
  itemLabel: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="outline"
            size="xl"
            className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive sm:flex-none"
          />
        }
      >
        <Trash2 aria-hidden />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-6 p-6 data-[size=default]:max-w-md data-[size=default]:sm:max-w-md">
        <AlertDialogHeader className="gap-3">
          <AlertDialogTitle className="text-3xl">Delete {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-foreground/80">
            It will be removed from your website straight away. You can&rsquo;t
            undo this.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 gap-3 p-6">
          <AlertDialogCancel size="xl">No, keep it</AlertDialogCancel>
          <AlertDialogAction
            size="xl"
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
            onClick={() => startTransition(() => action())}
          >
            {isPending ? "Deleting…" : "Yes, delete it"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
