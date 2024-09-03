import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "./utils/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const ValidatedFields = LoginSchema.safeParse(credentials);
        if (ValidatedFields.success) {
          const { email, password } = ValidatedFields.data;
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }

          return null;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

// handles operations that does not rely on the DATABASE session/adapter , so that edge cases can be handled
