import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { RichText } from "@/components/rich-text";
import { MediaGrid } from "@/components/projects/media-grid";
import { getBlogPosts } from "@/lib/queries/blog";

export const metadata: Metadata = { title: "For Educators" };

// See src/app/(public)/page.tsx for why these content pages force dynamic rendering.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-12 text-center font-heading text-3xl font-medium sm:text-4xl">
        For Educators
      </h1>

      {posts.length === 0 && (
        <p className="text-center text-muted-foreground">
          Resources for educators will be posted here soon.
        </p>
      )}

      <div className="flex flex-col">
        {posts.map((post, i) => (
          <article key={post._id} className="text-center">
            {i > 0 && <Separator className="mx-auto mb-10 w-4/5 opacity-40" />}
            <h2 className="mb-6 font-heading text-2xl font-medium">
              {post.title}
            </h2>
            <MediaGrid images={post.filename} altPrefix={post.title} />
            <RichText
              html={post.description}
              className="mx-auto mb-6 max-w-2xl text-left text-muted-foreground"
            />
            {post.links.length > 0 && (
              <div className="mx-auto mb-10 max-w-2xl text-left">
                <h3 className="mb-2 font-heading text-lg font-medium">
                  Sources
                </h3>
                <ul className="flex flex-col gap-1">
                  {post.links.map((link) => (
                    <li key={link}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-2 hover:no-underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
