"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichText } from "@/components/rich-text";
import { AdminItemDialog } from "@/components/admin/admin-item-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { BlogPostForm } from "@/components/admin/blog/blog-post-form";
import { deleteBlogPost } from "@/lib/actions/blog";
import type { BlogPostDoc } from "@/models/Blog";

type DialogState = { mode: "create" } | { mode: "edit"; post: BlogPostDoc } | null;

export function BlogPostsSection({ posts }: { posts: BlogPostDoc[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">For Educators</h1>
          <p className="text-sm text-muted-foreground">
            Resource posts shown on the For Educators page.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" />
          Add post
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Card key={post._id}>
            <CardContent className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                {post.filename[0] && (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                    <Image
                      src={post.filename[0]}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-medium">{post.title}</h3>
                  <RichText
                    html={post.description}
                    className="line-clamp-2 text-sm text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${post.title}`}
                  onClick={() => setDialog({ mode: "edit", post })}
                >
                  <Pencil className="size-4" />
                </Button>
                <ConfirmDeleteButton
                  itemLabel={post.title}
                  action={deleteBlogPost.bind(null, post._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No posts yet. Add your first one above.
          </p>
        )}
      </div>

      <AdminItemDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.mode === "edit" ? "Edit post" : "Add a resource post"}
      >
        {dialog && (
          <BlogPostForm
            key={dialog.mode === "edit" ? dialog.post._id : "new"}
            post={dialog.mode === "edit" ? dialog.post : undefined}
            onSuccess={() => setDialog(null)}
          />
        )}
      </AdminItemDialog>
    </div>
  );
}
