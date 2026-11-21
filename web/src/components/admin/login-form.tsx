"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, inputClassName } from "@/components/admin/form-parts";
import { authenticate } from "@/lib/actions/auth";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [errorMessage, formAction, pending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-7">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />

      <Field id="username" label="Username">
        <Input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          required
          autoFocus
          className={inputClassName}
        />
      </Field>

      <Field id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClassName}
        />
      </Field>

      {errorMessage && (
        <p
          role="alert"
          className="rounded-xl border-2 border-destructive bg-destructive/5 px-5 py-4 text-lg font-medium text-destructive"
        >
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="xl" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
