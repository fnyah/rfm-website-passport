import Image from "next/image";
import type { Metadata } from "next";
import { RichText } from "@/components/rich-text";
import { ContactReveal } from "@/components/about/contact-reveal";
import { getStandings, getEvents } from "@/lib/queries/about";

export const metadata: Metadata = { title: "About" };

// See src/app/(public)/page.tsx for why these content pages force dynamic rendering.
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [standings, events] = await Promise.all([getStandings(), getEvents()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-16 flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <Image
          src="/images/rose-fine-meyer.jpeg"
          alt="Rose Fine-Meyer"
          width={200}
          height={250}
          className="rounded-lg shadow-sm"
          priority
        />
        <p className="text-lg text-muted-foreground">
          My name is Rose Fine-Meyer, and I&rsquo;m a Senior Lecturer in the
          Master of Teaching program at the Ontario Institute for Studies in
          Education (OISE), University of Toronto.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 font-heading text-2xl font-medium">
          My Standings
        </h2>
        <ul className="flex flex-col gap-3">
          {standings.map((standing) => (
            <li key={standing._id}>
              <RichText html={standing.information} className="text-muted-foreground" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-heading text-2xl font-medium">
          Upcoming Events
        </h2>
        {events.length === 0 ? (
          <p className="text-muted-foreground">
            No upcoming events, check back later!
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <li key={event._id} className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  {event.eventDate}
                </span>{" "}
                &mdash; {event.information}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ContactReveal />
    </div>
  );
}
