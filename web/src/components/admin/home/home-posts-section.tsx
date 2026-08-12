"use client";

import { useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichText } from "@/components/rich-text";
import { AdminItemDialog } from "@/components/admin/admin-item-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { HomePostForm } from "@/components/admin/home/home-post-form";
import { deleteHomePost } from "@/lib/actions/home";
import type { HomePostDoc } from "@/models/Home";

type DialogState = { mode: "create" } | { mode: "edit"; post: HomePostDoc } | null;

export function HomePostsSection({ posts }: { posts: HomePostDoc[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-lg font-medium">
            Courses &amp; Projects
          </h2>
          <p className="text-sm text-muted-foreground">
            The text list under &ldquo;Courses &amp; Projects&rdquo; on the homepage.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <Card key={post._id}>
            <CardContent className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-medium">{post.title}</h3>
                <RichText
                  html={post.description}
                  className="line-clamp-2 text-sm text-muted-foreground"
                />
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
                  action={deleteHomePost.bind(null, post._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No courses or projects yet. Add your first one above.
          </p>
        )}
      </div>

      <AdminItemDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.mode === "edit" ? "Edit post" : "Add a course or project"}
      >
        {dialog && (
          <HomePostForm
            key={dialog.mode === "edit" ? dialog.post._id : "new"}
            post={dialog.mode === "edit" ? dialog.post : undefined}
            onSuccess={() => setDialog(null)}
          />
        )}
      </AdminItemDialog>
    </div>
  );
}
