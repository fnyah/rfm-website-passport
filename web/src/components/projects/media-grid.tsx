import Image from "next/image";
import { toEmbedLinks } from "@/lib/video";

/** Shared photo + embedded-video grid used on both Projects and Blog cards. */
export function MediaGrid({
  images,
  videoLinks,
  altPrefix,
}: {
  images: string[];
  videoLinks?: string[];
  altPrefix: string;
}) {
  const embeds = toEmbedLinks(videoLinks);

  if (images.length === 0 && embeds.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-3">
      {images.map((src) => (
        <div
          key={src}
          className="relative size-40 overflow-hidden rounded-lg shadow-sm ring-1 ring-border/60 sm:size-56"
        >
          <Image
            src={src}
            alt={altPrefix}
            fill
            sizes="224px"
            className="object-cover"
          />
        </div>
      ))}
      {embeds.map((src) => (
        <div
          key={src}
          className="aspect-video w-full max-w-md overflow-hidden rounded-lg shadow-sm ring-1 ring-border/60"
        >
          <iframe
            src={src}
            title={`${altPrefix} video`}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}
