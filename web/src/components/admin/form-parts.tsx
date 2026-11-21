"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** A form field: a plain label, a hint line under it, then the control. */
export function Field({
  id,
  label,
  hint,
  optional,
  children,
}: {
  id?: string;
  label: string;
  hint?: React.ReactNode;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const LabelTag = id ? "label" : "p";
  return (
    <div className="flex flex-col gap-2">
      <LabelTag htmlFor={id} className="text-xl font-semibold">
        {label}
        {optional && (
          <span className="ml-2 text-lg font-normal text-muted-foreground">
            (you can leave this empty)
          </span>
        )}
      </LabelTag>
      {hint && <p className="-mt-1 mb-1 text-lg text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

/** The form's error message and its big "Save changes" / "Cancel" buttons. */
export function FormActions({
  pending,
  error,
  cancelHref,
  saveLabel = "Save changes",
}: {
  pending: boolean;
  error?: string;
  cancelHref: string;
  saveLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-5 border-t border-border pt-8">
      {error && (
        <p
          role="alert"
          className="rounded-xl border-2 border-destructive bg-destructive/5 px-5 py-4 text-lg font-medium text-destructive"
        >
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="xl" disabled={pending} className="sm:min-w-48">
          {pending ? "Saving…" : saveLabel}
        </Button>
        <Link
          href={cancelHref}
          className={cn(buttonVariants({ variant: "outline", size: "xl" }), "sm:min-w-32")}
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

export const formClassName = "flex flex-col gap-10";

/** Size overrides for the shared Input/Textarea inside admin forms. */
export const inputClassName =
  "h-12 rounded-lg border-2 border-input bg-card px-4 text-lg md:text-lg";
export const textareaClassName =
  "min-h-28 rounded-lg border-2 border-input bg-card px-4 py-3 text-lg md:text-lg";
