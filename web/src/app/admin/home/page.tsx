import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomePostsSection } from "@/components/admin/home/home-posts-section";
import { HomePhotosSection } from "@/components/admin/home/home-photos-section";
import { getHomePosts, getHomePhotos } from "@/lib/queries/home";

export const metadata: Metadata = { title: "Home Page" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [posts, photos] = await Promise.all([getHomePosts(), getHomePhotos()]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-heading text-2xl font-medium">Home Page</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Manage the intro text and photo banner visitors see first.
      </p>

      <Tabs defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="pt-6">
          <HomePostsSection posts={posts} />
        </TabsContent>
        <TabsContent value="photos" className="pt-6">
          <HomePhotosSection photos={photos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
