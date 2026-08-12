import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          &copy; {new Date().getFullYear()} Rose Fine-Meyer. Department of
          Curriculum, Teaching and Learning, OISE, University of Toronto.
        </p>
        <Link href="/login" className="transition-colors hover:text-primary">
          Admin sign in
        </Link>
      </div>
    </footer>
  );
}
