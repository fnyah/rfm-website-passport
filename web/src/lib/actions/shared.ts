import "server-only";
import { auth } from "@/auth";

export type ActionState = { error?: string; success?: boolean };

/** Every mutation in src/lib/actions/* starts with this — belt-and-suspenders
 * alongside the /admin/:path* proxy gate, since Server Actions can in
 * principle be invoked directly. */
export async function requireSession() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized. Please sign in again.");
}
