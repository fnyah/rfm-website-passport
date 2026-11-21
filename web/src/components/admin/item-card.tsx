import Link from "next/link";
import { Pencil } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { cn } from "@/lib/utils";

/**
 * One item in an admin list: what it is on the left, and two large buttons
 * with words on them ("Edit", "Delete") on the right (below, on phones).
 */
export function ItemCard({
  title,
  media,
  children,
  editHref,
  deleteAction,
  deleteLabel,
}: {
  title?: React.ReactNode;
  media?: React.ReactNode;
  children?: React.ReactNode;
  editHref: string;
  deleteAction: () => Promise<void>;
  /** How the item is named in the delete question, e.g. "this course". */
  deleteLabel: string;
}) {
  return (
    <li className="flex flex-col gap-5 rounded-xl border border-border bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:gap-6 sm:p-6">
      <div className="flex min-w-0 flex-1 gap-4">
        {media}
        <div className="min-w-0 flex-1">
          {title && (
            <h2 className="font-heading text-2xl font-medium leading-snug">{title}</h2>
          )}
          {children && (
            <div className={cn("text-lg text-muted-foreground", title && "mt-1")}>
              {children}
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-3">
        <Link
          href={editHref}
          className={cn(buttonVariants({ variant: "outline", size: "xl" }), "flex-1 sm:flex-none")}
        >
          <Pencil aria-hidden />
          Edit
        </Link>
        <ConfirmDeleteButton action={deleteAction} itemLabel={deleteLabel} />
      </div>
    </li>
  );
}

export function ItemList({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-4">{children}</ul>;
}
