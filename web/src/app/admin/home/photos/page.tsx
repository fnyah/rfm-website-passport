import type { Metadata } from "next";
import Image from "next/image";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { ItemCard, ItemList } from "@/components/admin/item-card";
import { StatusBanner } from "@/components/admin/status-banner";
import { deleteHomePhoto } from "@/lib/actions/home";
import { getHomePhotos } from "@/lib/queries/home";

export const metadata: Metadata = { title: "Home page photos" };
export const dynamic = "force-dynamic";

export default async function AdminHomePhotosPage({
  searchParams,
}: PageProps<"/admin/home/photos">) {
  const [photos, { saved, deleted }] = await Promise.all([getHomePhotos(), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <StatusBanner saved={saved === "1"} deleted={deleted === "1"} />
      <AdminPageHeader
        title="Home page photos"
        intro="These photos scroll across the top of your home page. Eight or fewer looks best."
        addHref="/admin/home/photos/new"
        addLabel="Add a photo"
      />

      {photos.length === 0 ? (
        <EmptyState>No photos yet. Click &ldquo;Add a photo&rdquo; to add your first one.</EmptyState>
      ) : (
        <ItemList>
          {photos.map((photo) => (
            <ItemCard
              key={photo._id}
              media={
                <div className="relative size-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:size-28">
                  <Image
                    src={photo.filename}
                    alt={photo.description || ""}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
              }
              editHref={`/admin/home/photos/${photo._id}/edit`}
              deleteAction={deleteHomePhoto.bind(null, photo._id)}
              deleteLabel="this photo"
            >
              <p className="text-foreground">{photo.description || "No caption"}</p>
              {photo.link && (
                <p className="mt-1 truncate text-base">Opens {photo.link.replace(/^https?:\/\//, "")}</p>
              )}
            </ItemCard>
          ))}
        </ItemList>
      )}
    </div>
  );
}
