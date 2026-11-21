import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RichText } from "@/components/rich-text";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-page";
import { ItemCard, ItemList } from "@/components/admin/item-card";
import { StatusBanner } from "@/components/admin/status-banner";
import { deleteStanding } from "@/lib/actions/about";
import { getStandings } from "@/lib/queries/about";

export const metadata: Metadata = { title: "About me" };
export const dynamic = "force-dynamic";

export default async function AdminAboutPage({ searchParams }: PageProps<"/admin/about">) {
  const [standings, { saved, deleted }] = await Promise.all([getStandings(), searchParams]);

  return (
    <div className="mx-auto max-w-4xl">
      <StatusBanner saved={saved === "1"} deleted={deleted === "1"} />
      <AdminPageHeader
        title="About me"
        intro="These are the roles and honours listed under “My Standings” on your About page. Click Edit to change one, or add a new one."
        addHref="/admin/about/new"
        addLabel="Add a role or honour"
      >
        <p className="mt-4 text-lg text-muted-foreground">
          Want to list a talk or conference?{" "}
          <Link
            href="/admin/about/events"
            className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-4 hover:no-underline"
          >
            Change your upcoming events
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </AdminPageHeader>

      {standings.length === 0 ? (
        <EmptyState>Nothing listed yet. Click &ldquo;Add a role or honour&rdquo; to add your first one.</EmptyState>
      ) : (
        <ItemList>
          {standings.map((standing) => (
            <ItemCard
              key={standing._id}
              editHref={`/admin/about/${standing._id}/edit`}
              deleteAction={deleteStanding.bind(null, standing._id)}
              deleteLabel="this role"
            >
              <RichText html={standing.information} className="text-foreground" />
            </ItemCard>
          ))}
        </ItemList>
      )}
    </div>
  );
}
