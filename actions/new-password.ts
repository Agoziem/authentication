"use server";

import { z } from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenbyToken } from "@/utils/password-token";
import { getUserByEmail } from "@/utils/user";
import bycrpt from "bcryptjs";
import { db } from "@/lib/db";

export const reset = async (
  data: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing Token" };
  }
  const validatedData = NewPasswordSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid Password" };
  }
  const { password } = validatedData.data;

  const existingToken = await getPasswordResetTokenbyToken(token);
  if (!existingToken) {
    return { error: "Invalid Token" };
  }

  // check if the token is expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User not found" };
  }

  // Update the password
  const hashedPassword = await bycrpt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password has been reset" };
};
