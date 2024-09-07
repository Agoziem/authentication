import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "@/utils/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationbyUserId } from "./utils/two-factor-confirmation";
import { getAccountById } from "./utils/accounts";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request',
    // newUser: '/auth/new-user'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Check if user email is verified
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id!);
      if (!existingUser || !existingUser.emailVerified) {
        return false;
      }
      // Check if user has two-factor enabled
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationbyUserId(
          user.id!
        );
        if (!twoFactorConfirmation) {
          return false;
        } else {
          await db.twoFactorComfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isOauth = token.isOauth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountById(token.sub);
      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
