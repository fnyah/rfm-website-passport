import DOMPurify from "isomorphic-dompurify";
import { plainTextToHtml } from "@/lib/plain-text";

// Rich-text fields (Home/Standings/Project/Blog descriptions) are edited
// with the Tiptap toolbar in the admin panel, which only exposes bold,
// italic, paragraphs, and links — but we sanitize on every render anyway as
// a defense-in-depth measure against stored XSS, since this HTML also
// existed before the rework and could contain anything.
const ALLOWED_TAGS = ["p", "strong", "em", "a", "br", "ul", "ol", "li"];
const ALLOWED_ATTR = ["href", "target", "rel"];

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  // Legacy plain text (no tags) becomes paragraphs before sanitizing.
  return DOMPurify.sanitize(plainTextToHtml(html), { ALLOWED_TAGS, ALLOWED_ATTR });
}
