import type { Metadata } from "next";
import { ProjectsSection } from "@/components/admin/projects/projects-section";
import { getProjects } from "@/lib/queries/projects";

export const metadata: Metadata = { title: "Student Projects" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="mx-auto max-w-4xl">
      <ProjectsSection projects={projects} />
    </div>
  );
}
