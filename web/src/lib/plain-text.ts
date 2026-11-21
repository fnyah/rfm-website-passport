// The old Express app stored long-text fields (descriptions, information) as
// plain text with "\n" line breaks; the new admin saves HTML. Values with no
// HTML tags at all are treated as that legacy plain text and turned into
// paragraphs, so old content keeps its breaks without a database migration.
// Kept free of DOMPurify so the client-side editor can import it cheaply.

const HTML_TAG = /<\/?[a-z][^>]*>/i;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Returns HTML unchanged; converts tag-free plain text into paragraphs: a
 * blank line splits paragraphs, a single newline becomes <br>, and the text
 * is HTML-escaped.
 */
export function plainTextToHtml(value: string): string {
  if (HTML_TAG.test(value)) return value;
  return value
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/[ \t]*\n[ \t]*/g, "<br>")}</p>`)
    .join("");
}
