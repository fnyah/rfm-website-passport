// Ported from middleware/addhttp.js. Normalizes a pasted link (e.g.
// "example.com" or "www.example.com") into a full, safe https URL.
export function addHttp(link: string): string {
  const trimmed = link.trim();

  if (/^https?:\/\//.test(trimmed)) return trimmed;

  return trimmed.startsWith("www.") ? `https://${trimmed}` : `https://www.${trimmed}`;
}

/** Parses the admin form's comma-separated resource links textarea into normalized URLs. */
export function parseLinksInput(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(addHttp);
}
