import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
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
    <div className="flex min-h-full flex-col items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-heading text-2xl font-medium">
            Dr. Rose Fine-Meyer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your website content
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline underline-offset-2 hover:text-foreground">
            &larr; Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
