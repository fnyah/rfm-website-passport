import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { RichText } from "@/components/rich-text";
import { MediaGrid } from "@/components/projects/media-grid";
import { getProjects } from "@/lib/queries/projects";

export const metadata: Metadata = { title: "Student Projects" };

// See src/app/(public)/page.tsx for why these content pages force dynamic rendering.
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-12 text-center font-heading text-3xl font-medium sm:text-4xl">
        Public History Student Projects
      </h1>

      {projects.length === 0 && (
        <p className="text-center text-muted-foreground">
          Student projects will be posted here soon.
        </p>
      )}

      <div className="flex flex-col">
        {projects.map((project, i) => (
          <article key={project._id} className="text-center">
            {i > 0 && <Separator className="mx-auto mb-10 w-4/5 opacity-40" />}
            <h2 className="mb-2 font-heading text-2xl font-medium">
              {project.title}
            </h2>
            {project.author && (
              <p className="mb-6 text-muted-foreground">{project.author}</p>
            )}
            <MediaGrid
              images={project.filename}
              videoLinks={project.videoLink}
              altPrefix={project.title}
            />
            <RichText
              html={project.description}
              className="mx-auto mb-10 max-w-2xl text-left text-muted-foreground"
            />
          </article>
        ))}
      </div>
    </div>
  );
}
