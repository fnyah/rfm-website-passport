"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: (formData.get("callbackUrl") as string) || "/admin/home",
    });
  } catch (error) {
    // NextAuth's signIn() throws a special redirect error on success —
    // let that one through, only handle real auth failures here.
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "That username or password isn't right. Please try again.";
        default:
          return "Something went wrong signing in. Please try again.";
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
