"use server";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/utils/tokens";
import { getUserByEmail } from "@/utils/user";
import { SendVerificationEmail } from "@/utils/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // Validate the data
  const ValidatedData = LoginSchema.safeParse(values);
  if (!ValidatedData.success) {
    return { error: "Invalid Credentials, try again later" };
  }
  const { email, password } = ValidatedData.data;
  const existingUser = await getUserByEmail(email);
  // Check if user exists
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User account does not exist!" };
  }
  // Check if user is verified
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await SendVerificationEmail(existingUser.email, verificationToken);
    return { success: "Account not verified, verification email sent!" };
  }

  // Sign in the user
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "An error occurred, try again later" };
      }
    }
    throw error;
  }
};
