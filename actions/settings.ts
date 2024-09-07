"use server";
import * as z from "zod";

import { SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/utils/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/use-auth";
import { revalidateTag } from "next/cache";
import { generateVerificationToken } from "@/utils/tokens";
import { SendVerificationEmail } from "@/utils/mail";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // verify current user
  const user = await currentUser();
  if (!user) {
    return { error: "You must be logged in to do that" };
  }
  const dbUser = await getUserById(user.id!);
  if (!dbUser) {
    return { error: "User not found" };
  }

  //   set values to undefined if user is oauth
  if (user.isOauth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  //   check if email is in use
  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      return { error: "Email already in use" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await SendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification email sent successfully" };
  }

  //   check if password is correct and update password
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.newPassword = hashedPassword;
    values.password = undefined;
  }

  //   update user
  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });

  revalidateTag("user");

  return { success: " settings updated" };
};
