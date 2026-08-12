"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AdminItemDialog } from "@/components/admin/admin-item-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { HomePhotoForm } from "@/components/admin/home/home-photo-form";
import { deleteHomePhoto } from "@/lib/actions/home";
import type { PhotoDoc } from "@/models/Photo";

type DialogState = { mode: "create" } | { mode: "edit"; photo: PhotoDoc } | null;

export function HomePhotosSection({ photos }: { photos: PhotoDoc[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-medium">Photo Banner</h2>
          <p className="text-sm text-muted-foreground">
            The scrolling photos near the top of the homepage. 8 or fewer looks best.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" />
          Add photo
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((photo) => (
          <Card key={photo._id} className="overflow-hidden py-0">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={photo.filename}
                  alt={photo.description || ""}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <p className="min-w-0 truncate text-xs text-muted-foreground">
                  {photo.description || photo.link || "No caption"}
                </p>
                <div className="flex shrink-0 gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Edit photo"
                    onClick={() => setDialog({ mode: "edit", photo })}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <ConfirmDeleteButton
                    itemLabel="photo"
                    action={deleteHomePhoto.bind(null, photo._id)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {photos.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No photos yet. Add your first one above.
          </p>
        )}
      </div>

      <AdminItemDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.mode === "edit" ? "Edit photo" : "Add a photo"}
      >
        {dialog && (
          <HomePhotoForm
            key={dialog.mode === "edit" ? dialog.photo._id : "new"}
            photo={dialog.mode === "edit" ? dialog.photo : undefined}
            onSuccess={() => setDialog(null)}
          />
        )}
      </AdminItemDialog>
    </div>
  );
}
