import type { Metadata } from "next";
import Image from "next/image";
import { RichText } from "@/components/rich-text";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { ItemCard, ItemList } from "@/components/admin/item-card";
import { StatusBanner } from "@/components/admin/status-banner";
import { deleteProject } from "@/lib/actions/projects";
import { getProjects } from "@/lib/queries/projects";

export const metadata: Metadata = { title: "Student projects" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({ searchParams }: PageProps<"/admin/projects">) {
  const [projects, { saved, deleted }] = await Promise.all([getProjects(), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <StatusBanner saved={saved === "1"} deleted={deleted === "1"} />
      <AdminPageHeader
        title="Student projects"
        intro="These are the projects shown on your Student projects page. Click Edit to change one, or add a new one."
        addHref="/admin/projects/new"
        addLabel="Add a project"
      />

      {projects.length === 0 ? (
        <EmptyState>No projects yet. Click &ldquo;Add a project&rdquo; to add your first one.</EmptyState>
      ) : (
        <ItemList>
          {projects.map((project) => (
            <ItemCard
              key={project._id}
              title={project.title}
              media={project.filename[0] && <Thumbnail src={project.filename[0]} />}
              editHref={`/admin/projects/${project._id}/edit`}
              deleteAction={deleteProject.bind(null, project._id)}
              deleteLabel={`“${project.title}”`}
            >
              {project.author && <p className="text-foreground">By {project.author}</p>}
              <RichText html={project.description} className="line-clamp-2" />
            </ItemCard>
          ))}
        </ItemList>
      )}
    </div>
  );
}

function Thumbnail({ src }: { src: string }) {
  return (
    <div className="relative hidden size-24 shrink-0 overflow-hidden rounded-lg ring-1 ring-border sm:block">
      <Image src={src} alt="" fill sizes="96px" className="object-cover" />
    </div>
  );
}
