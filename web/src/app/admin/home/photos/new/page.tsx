import type { Metadata } from "next";
import { AdminFormPage } from "@/components/admin/admin-page";
import { HomePhotoForm } from "@/components/admin/home/home-photo-form";

export const metadata: Metadata = { title: "Add a photo" };

export default function NewHomePhotoPage() {
  return (
    <AdminFormPage
      backHref="/admin/home/photos"
      backLabel="Back to Home page photos"
      title="Add a photo"
      intro="Choose a photo from your computer, then click “Add this photo”."
    >
      <HomePhotoForm />
    </AdminFormPage>
  );
}
