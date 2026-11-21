import type { Metadata } from "next";
import { AdminFormPage } from "@/components/admin/admin-page";
import { ProjectForm } from "@/components/admin/projects/project-form";

export const metadata: Metadata = { title: "Add a project" };

export default function NewProjectPage() {
  return (
    <AdminFormPage
      backHref="/admin/projects"
      backLabel="Back to Student projects"
      title="Add a project"
      intro="Fill in the boxes below, then click “Add this project”. It will appear on your Student projects page."
    >
      <ProjectForm />
    </AdminFormPage>
  );
}
