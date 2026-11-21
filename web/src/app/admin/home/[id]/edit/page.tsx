import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFormPage } from "@/components/admin/admin-page";
import { HomePostForm } from "@/components/admin/home/home-post-form";
import { getHomePost } from "@/lib/queries/home";

export const metadata: Metadata = { title: "Edit course" };
export const dynamic = "force-dynamic";

export default async function EditHomePostPage({ params }: PageProps<"/admin/home/[id]/edit">) {
  const post = await getHomePost((await params).id);
  if (!post) notFound();

  return (
    <AdminFormPage
      backHref="/admin/home"
      backLabel="Back to Home page"
      title="Edit course"
      intro="Change what you need, then click “Save changes”."
    >
      <HomePostForm post={post} />
    </AdminFormPage>
  );
}
