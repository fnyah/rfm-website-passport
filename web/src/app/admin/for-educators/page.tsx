import type { Metadata } from "next";
import { BlogPostsSection } from "@/components/admin/blog/blog-posts-section";
import { getBlogPosts } from "@/lib/queries/blog";

export const metadata: Metadata = { title: "For Educators" };
export const dynamic = "force-dynamic";

export default async function AdminForEducatorsPage() {
  const posts = await getBlogPosts();
  return (
    <div className="mx-auto max-w-4xl">
      <BlogPostsSection posts={posts} />
    </div>
  );
}
