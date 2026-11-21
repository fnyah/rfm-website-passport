import type { Metadata } from "next";
import { AdminFormPage } from "@/components/admin/admin-page";
import { StandingForm } from "@/components/admin/about/standing-form";

export const metadata: Metadata = { title: "Add a role or honour" };

export default function NewStandingPage() {
  return (
    <AdminFormPage
      backHref="/admin/about"
      backLabel="Back to About me"
      title="Add a role or honour"
      intro="Type it below, then click “Add this role”. It will appear on your About page."
    >
      <StandingForm />
    </AdminFormPage>
  );
}
