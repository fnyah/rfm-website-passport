// Ported from middleware/prepVideoLink.js. Turns pasted YouTube URLs
// (watch, share, or embed form) into embeddable player URLs.
export function toEmbedLinks(videoLinks: string[] | undefined | null): string[] {
  if (!videoLinks || videoLinks.length === 0) return [];

  const embedLinks: string[] = [];

  for (const raw of videoLinks) {
    const link = raw.trim();
    if (!link) continue;

    if (link.includes("youtube.com/watch?v=")) {
      const videoId = link.split("v=")[1]?.split("&")[0];
      if (videoId) embedLinks.push(`https://www.youtube.com/embed/${videoId}?controls=0`);
    } else if (link.includes("youtu.be/")) {
      const videoId = link.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) embedLinks.push(`https://www.youtube.com/embed/${videoId}?controls=0`);
    } else if (link.includes("youtube.com/embed/")) {
      embedLinks.push(link.includes("?") ? `${link}&controls=0` : `${link}?controls=0`);
    }
  }

  return embedLinks;
}

/** Parses the admin form's comma-separated video links textarea into a clean array. */
export function parseVideoLinksInput(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
