import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFormPage } from "@/components/admin/admin-page";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";
import { getBlogPost } from "@/lib/queries/blog";

export const metadata: Metadata = { title: "Edit resource" };
export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: PageProps<"/admin/for-educators/[id]/edit">) {
  const post = await getBlogPost((await params).id);
  if (!post) notFound();

  return (
    <AdminFormPage
      backHref="/admin/for-educators"
      backLabel="Back to For educators"
      title="Edit resource"
      intro="Change what you need, then click “Save changes”."
    >
      <BlogPostForm post={post} />
    </AdminFormPage>
  );
}
