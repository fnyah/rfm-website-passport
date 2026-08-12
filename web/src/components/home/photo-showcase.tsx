import Image from "next/image";
import type { PhotoDoc } from "@/models/Photo";
import { cn } from "@/lib/utils";

/**
 * The homepage's scrolling photo grid. Ported from the old EJS
 * link/description permutations (views/home.ejs) — link-only, description-only,
 * both, or neither — as one component instead of four near-duplicate blocks.
 */
export function PhotoShowcase({ photos }: { photos: PhotoDoc[] }) {
  if (photos.length === 0) return null;

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6 md:grid-cols-4">
      {photos.map((photo) => (
        <PhotoTile key={photo._id} photo={photo} />
      ))}
    </div>
  );
}

function PhotoTile({ photo }: { photo: PhotoDoc }) {
  const hasOverlay = Boolean(photo.description);

  const tile = (
    <div
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg shadow-sm ring-1 ring-border/60"
      )}
    >
      <Image
        src={photo.filename}
        alt={photo.description || "Photo"}
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        className={cn(
          "object-cover transition-all duration-500",
          hasOverlay && "group-hover:scale-105 group-hover:blur-[1px] group-hover:opacity-40"
        )}
      />
      {hasOverlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-3 text-center text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {photo.description}
        </div>
      )}
    </div>
  );

  if (photo.link) {
    return (
      <a
        href={photo.link}
        target="_blank"
        rel="noreferrer"
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {tile}
      </a>
    );
  }

  return tile;
}
