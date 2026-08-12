import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandingsSection } from "@/components/admin/about/standings-section";
import { EventsSection } from "@/components/admin/about/events-section";
import { getStandings, getEvents } from "@/lib/queries/about";

export const metadata: Metadata = { title: "About Page" };
export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [standings, events] = await Promise.all([getStandings(), getEvents()]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-1 font-heading text-2xl font-medium">About Page</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Manage your standings and upcoming events. Your photo and intro
        paragraph are fixed parts of the page design.
      </p>

      <Tabs defaultValue="standings">
        <TabsList>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="standings" className="pt-6">
          <StandingsSection standings={standings} />
        </TabsContent>
        <TabsContent value="events" className="pt-6">
          <EventsSection events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
