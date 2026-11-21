import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/admin/home");

  const { callbackUrl } = await searchParams;

  return (
    <div className="admin-ui flex min-h-full flex-1 flex-col items-center justify-center bg-muted/40 px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <p className="text-lg text-muted-foreground">Dr. Rose Fine-Meyer</p>
          <h1 className="mt-1 font-heading text-4xl font-medium tracking-tight sm:text-5xl">
            Sign in to update your website
          </h1>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
        <p className="mt-6">
          <Link
            href="/"
            className="-ml-2 inline-flex min-h-12 items-center gap-2 rounded-lg px-2 text-lg font-medium text-primary underline-offset-4 hover:underline"
          >
            <ArrowLeft className="size-5" aria-hidden />
            Back to my website
          </Link>
        </p>
      </div>
    </div>
  );
}
