import { Button } from "@/components/ui/button";
import { RichText } from "@/components/rich-text";
import { PhotoShowcase } from "@/components/home/photo-showcase";
import { getHomePosts, getHomePhotos } from "@/lib/queries/home";

// Always render at request time rather than prerendering at build time —
// this is admin-editable content, and force-dynamic keeps the page from
// depending on database access being available at build/deploy time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [posts, photos] = await Promise.all([getHomePosts(), getHomePhotos()]);

  return (
    <>
      <section className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
        <h1 className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl md:text-6xl">
          Public History and Education
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Resources, student projects, and readings from Dr. Rose
          Fine-Meyer&rsquo;s courses at the University of Toronto.
        </p>
        <Button render={<a href="#courses" />} nativeButton={false} size="lg">
          See courses &amp; projects
        </Button>
      </section>

      <PhotoShowcase photos={photos} />

      <section id="courses" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <h2 className="mb-12 text-center font-heading text-3xl font-medium">
          Courses &amp; Projects
        </h2>
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <article key={post._id} className="text-center">
              <h3 className="mb-3 font-heading text-2xl font-medium">
                {post.title}
              </h3>
              <RichText
                html={post.description}
                className="mx-auto max-w-2xl text-muted-foreground"
              />
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground">
              Course and project descriptions will appear here soon.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
