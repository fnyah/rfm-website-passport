"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichText } from "@/components/rich-text";
import { AdminItemDialog } from "@/components/admin/admin-item-dialog";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { deleteProject } from "@/lib/actions/projects";
import type { ProjectDoc } from "@/models/Project";

type DialogState = { mode: "create" } | { mode: "edit"; project: ProjectDoc } | null;

export function ProjectsSection({ projects }: { projects: ProjectDoc[] }) {
  const [dialog, setDialog] = useState<DialogState>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium">Student Projects</h1>
          <p className="text-sm text-muted-foreground">
            Projects shown on the Projects page.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" />
          Add project
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <Card key={project._id}>
            <CardContent className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 gap-3">
                {project.filename[0] && (
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                    <Image
                      src={project.filename[0]}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-medium">{project.title}</h3>
                  {project.author && (
                    <p className="text-xs text-muted-foreground">{project.author}</p>
                  )}
                  <RichText
                    html={project.description}
                    className="line-clamp-2 text-sm text-muted-foreground"
                  />
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${project.title}`}
                  onClick={() => setDialog({ mode: "edit", project })}
                >
                  <Pencil className="size-4" />
                </Button>
                <ConfirmDeleteButton
                  itemLabel={project.title}
                  action={deleteProject.bind(null, project._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No projects yet. Add your first one above.
          </p>
        )}
      </div>

      <AdminItemDialog
        open={dialog !== null}
        onOpenChange={(open) => !open && setDialog(null)}
        title={dialog?.mode === "edit" ? "Edit project" : "Add a student project"}
      >
        {dialog && (
          <ProjectForm
            key={dialog.mode === "edit" ? dialog.project._id : "new"}
            project={dialog.mode === "edit" ? dialog.project : undefined}
            onSuccess={() => setDialog(null)}
          />
        )}
      </AdminItemDialog>
    </div>
  );
}
