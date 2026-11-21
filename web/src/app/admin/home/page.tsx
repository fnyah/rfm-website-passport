import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RichText } from "@/components/rich-text";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { ItemCard, ItemList } from "@/components/admin/item-card";
import { StatusBanner } from "@/components/admin/status-banner";
import { deleteHomePost } from "@/lib/actions/home";
import { getHomePosts } from "@/lib/queries/home";

export const metadata: Metadata = { title: "Home page" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage({ searchParams }: PageProps<"/admin/home">) {
  const [posts, { saved, deleted }] = await Promise.all([getHomePosts(), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <StatusBanner saved={saved === "1"} deleted={deleted === "1"} />
      <AdminPageHeader
        title="Home page"
        intro="These are the courses listed on your home page. Click Edit to change one, or add a new one."
        addHref="/admin/home/new"
        addLabel="Add a course"
      >
        <p className="mt-4 text-lg text-muted-foreground">
          Looking for the photos at the top of the page?{" "}
          <Link
            href="/admin/home/photos"
            className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            Change the home page photos
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </AdminPageHeader>

      {posts.length === 0 ? (
        <EmptyState>No courses yet. Click &ldquo;Add a course&rdquo; to add your first one.</EmptyState>
      ) : (
        <ItemList>
          {posts.map((post) => (
            <ItemCard
              key={post._id}
              title={post.title}
              editHref={`/admin/home/${post._id}/edit`}
              deleteAction={deleteHomePost.bind(null, post._id)}
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
