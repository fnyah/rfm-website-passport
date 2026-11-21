import type { Metadata } from "next";
import Image from "next/image";
import { RichText } from "@/components/rich-text";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { ItemCard, ItemList } from "@/components/admin/item-card";
import { StatusBanner } from "@/components/admin/status-banner";
import { deleteBlogPost } from "@/lib/actions/blog";
import { getBlogPosts } from "@/lib/queries/blog";

export const metadata: Metadata = { title: "For educators" };
export const dynamic = "force-dynamic";

export default async function AdminForEducatorsPage({
  searchParams,
}: PageProps<"/admin/for-educators">) {
  const [posts, { saved, deleted }] = await Promise.all([getBlogPosts(), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <StatusBanner saved={saved === "1"} deleted={deleted === "1"} />
      <AdminPageHeader
        title="For educators"
        intro="These are the teaching resources on your For educators page. Click Edit to change one, or add a new one."
        addHref="/admin/for-educators/new"
        addLabel="Add a resource"
      />

      {posts.length === 0 ? (
        <EmptyState>No resources yet. Click &ldquo;Add a resource&rdquo; to add your first one.</EmptyState>
      ) : (
        <ItemList>
          {posts.map((post) => (
            <ItemCard
              key={post._id}
              title={post.title}
              media={
                post.filename[0] && (
                  <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:block">
                    <Image src={post.filename[0]} alt="" fill sizes="96px" className="object-cover" />
                  </div>
                )
              }
              editHref={`/admin/for-educators/${post._id}/edit`}
              deleteAction={deleteBlogPost.bind(null, post._id)}
              deleteLabel={`“${post.title}”`}
            >
              <RichText html={post.description} className="line-clamp-2" />
            </ItemCard>
          ))}
        </ItemList>
      )}
    </div>
  );
}
