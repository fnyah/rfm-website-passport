import { sanitizeRichText } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

/** Renders sanitized rich-text HTML produced by the admin Tiptap editor. */
export function RichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn("prose-content", className)}
      // Sanitized server-side (and again here, defense in depth) before ever
      // reaching dangerouslySetInnerHTML — see src/lib/sanitize.ts.
      dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
    />
  );
}
