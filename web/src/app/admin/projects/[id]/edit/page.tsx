import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFormPage } from "@/components/admin/admin-page";
import { ProjectForm } from "@/components/admin/projects/project-form";
import { getProject } from "@/lib/queries/projects";

export const metadata: Metadata = { title: "Edit project" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  const project = await getProject((await params).id);
  if (!project) notFound();

  return (
    <AdminFormPage
      backHref="/admin/projects"
      backLabel="Back to Student projects"
      title="Edit project"
      intro="Change what you need, then click “Save changes”."
    >
      <ProjectForm project={project} />
    </AdminFormPage>
  );
}
