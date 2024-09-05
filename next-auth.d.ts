import NextAuth,{ type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole,
      isTwoFactorEnabled: boolean,
    } & DefaultSession["user"];
  }
}