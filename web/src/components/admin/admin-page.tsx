import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Building blocks shared by every admin screen, so each one reads the same:
 * a big heading, one plain sentence, one obvious button.
 */

export function AdminPageHeader({
  title,
  intro,
  addHref,
  addLabel,
  children,
}: {
  title: string;
  intro: React.ReactNode;
  addHref?: string;
  addLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-xl leading-relaxed text-muted-foreground">
        {intro}
      </p>
      {children}
      {addHref && addLabel && (
        <Link
          href={addHref}
          className={cn(buttonVariants({ size: "xl" }), "mt-6 w-full sm:w-auto")}
        >
          <Plus aria-hidden />
          {addLabel}
        </Link>
      )}
    </header>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="-ml-2 mb-6 inline-flex min-h-12 items-center gap-2 rounded-lg px-2 text-lg font-medium text-primary underline-offset-4 hover:underline"
    >
      <ArrowLeft className="size-5" aria-hidden />
      {label}
    </Link>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border-2 border-dashed border-border px-6 py-10 text-center text-lg text-muted-foreground">
      {children}
    </p>
  );
}

/** Edit / add pages: back link, heading, one sentence, then the form. */
export function AdminFormPage({
  backHref,
  backLabel,
  title,
  intro,
  children,
}: {
  backHref: string;
  backLabel: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href={backHref} label={backLabel} />
      <h1 className="font-heading text-4xl font-medium tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground">
        {intro}
      </p>
      {children}
    </div>
  );
}
