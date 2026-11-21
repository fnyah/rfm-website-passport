import type { Metadata } from "next";
import { AdminFormPage } from "@/components/admin/admin-page";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";

export const metadata: Metadata = { title: "Add a resource" };

export default function NewBlogPostPage() {
  return (
    <AdminFormPage
      backHref="/admin/for-educators"
      backLabel="Back to For educators"
      title="Add a resource"
      intro="Fill in the boxes below, then click “Add this resource”. It will appear on your For educators page."
    >
      <BlogPostForm />
    </AdminFormPage>
  );
}
