import type { Metadata } from "next";
import { AdminFormPage } from "@/components/admin/admin-page";
import { HomePostForm } from "@/components/admin/home/home-post-form";

export const metadata: Metadata = { title: "Add a course" };

export default function NewHomePostPage() {
  return (
    <AdminFormPage
      backHref="/admin/home"
      backLabel="Back to Home page"
      title="Add a course"
      intro="Fill in the boxes below, then click “Add this course”. It will appear on your home page."
    >
      <HomePostForm />
    </AdminFormPage>
  );
}
