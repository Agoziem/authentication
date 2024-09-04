"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/utils/user";
import { getVerificationTokenByToken } from "@/utils/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  // Check if the token exists
  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  //   Check if the token has expired
  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  //   Check if the user exists
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User does not exist" };
  }

  //   Update the user's email and emailVerified fields
  await db.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: new Date(), email: existingToken.email },
  });

  //   Delete the verification token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email Verified" };
};
