"use server";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/utils/tokens";
import { getUserByEmail } from "@/utils/user";
import { SendVerificationEmail, SendTwoFactorEmail } from "@/utils/mail";
import { getTwoFactorTokenbyEmail } from "@/utils/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationbyUserId } from "@/utils/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  // ----------------------------------------------
  // Validate the data
  // ----------------------------------------------
  const ValidatedData = LoginSchema.safeParse(values);
  if (!ValidatedData.success) {
    return { error: "Invalid Credentials, try again later" };
  }
  const { email, password, code } = ValidatedData.data;

  // ----------------------------------------------
  // Check if user exists
  // ----------------------------------------------
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email) {
    return { error: "User account does not exist!" };
  }

  // ----------------------------------------------
  // User email Verification
  // ----------------------------------------------
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await SendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Account not verified, verification email sent!" };
  }

  // ---------------------------------------------
  // user two-factor Authentication Verification
  // ----------------------------------------------
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // Check if two-factor code is valid
      const twoFactorToken = await getTwoFactorTokenbyEmail(existingUser.email);
      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: "Invalid two-factor code" };
      }
      // Check if two-factor code has expired
      const hasExpired = new Date() > new Date(twoFactorToken.expires);
      if (hasExpired) {
        return { error: "Two-factor code has expired" };
      }
      // Delete the two-factor token and create a new two-factor confirmation
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      // check if two-factor confirmation exists and delete it
      const twoFactorConfirmation = await getTwoFactorConfirmationbyUserId(
        existingUser.id
      );
      if (twoFactorConfirmation) {
        await db.twoFactorComfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }
      // Create a new two-factor confirmation
      await db.twoFactorComfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await SendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  // -------------------------------------------------
  // Sign in the user with Auth js
  // -------------------------------------------------
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
