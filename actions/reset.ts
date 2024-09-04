"use server";
import { z } from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/utils/user";
import { SendPasswordResetEmail } from "@/utils/mail";
import { generatePasswordResetToken } from "@/utils/tokens";

export const reset = async (data: z.infer<typeof ResetSchema>) => {
  const validatedData = ResetSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      error: "Invalid email",
    };
  }

  const { email } = validatedData.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return {
      error: "Email not found",
    };
  }

  //   TODO: Send reset email
  const resetToken = await generatePasswordResetToken(email);
  await SendPasswordResetEmail(resetToken.email, resetToken.token);
  return {
    success: "Reset Email sent",
  };
};
