import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminFormPage } from "@/components/admin/admin-page";
import { StandingForm } from "@/components/admin/about/standing-form";
import { getStanding } from "@/lib/queries/about";

export const metadata: Metadata = { title: "Edit role or honour" };
export const dynamic = "force-dynamic";

export default async function EditStandingPage({ params }: PageProps<"/admin/about/[id]/edit">) {
  const standing = await getStanding((await params).id);
  if (!standing) notFound();

  return (
    <AdminFormPage
      backHref="/admin/about"
      backLabel="Back to About me"
      title="Edit role or honour"
      intro="Change what you need, then click “Save changes”."
    >
      <StandingForm standing={standing} />
    </AdminFormPage>
  );
}
