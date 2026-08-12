import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { validPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Reuses the existing User collection + pbkdf2 hash check (see
      // src/lib/password.ts) so the current admin password keeps working —
      // no reset needed as part of this rework.
      authorize: async (credentials) => {
        const username = credentials?.username;
        const password = credentials?.password;
        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        await connectToDatabase();
        const user = await User.findOne({ username }).lean();
        if (!user) return null;

        const isValid = validPassword(password, user.hash, user.salt);
        if (!isValid) return null;

        return { id: user._id.toString(), name: user.username };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
});
