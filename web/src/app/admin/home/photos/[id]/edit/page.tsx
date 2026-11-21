import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFormPage } from "@/components/admin/admin-page";
import { HomePhotoForm } from "@/components/admin/home/home-photo-form";
import { getHomePhoto } from "@/lib/queries/home";

export const metadata: Metadata = { title: "Edit photo" };
export const dynamic = "force-dynamic";

export default async function EditHomePhotoPage({
  params,
}: PageProps<"/admin/home/photos/[id]/edit">) {
  const photo = await getHomePhoto((await params).id);
  if (!photo) notFound();

  return (
    <AdminFormPage
      backHref="/admin/home/photos"
      backLabel="Back to Home page photos"
      title="Edit photo"
      intro="Change what you need, then click “Save changes”."
    >
      <HomePhotoForm photo={photo} />
    </AdminFormPage>
  );
}
