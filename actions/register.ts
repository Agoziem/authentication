"use server";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/utils/user";
import { generateVerificationToken } from "@/utils/tokens";
import { SendVerificationEmail } from "@/utils/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {

  // Validate the data
  const ValidatedData = RegisterSchema.safeParse(values);
  if (!ValidatedData.success) {
    return { error: "Invalid Credentials, try again later" };
  }
  const { email, password, name } = ValidatedData.data;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "User already exists" };
  }
  // Create new User
  await createUser(email, hashedPassword, name);

  // Generate Verification Token
  const verificationToken = await generateVerificationToken(email);

  // Send Verification  token Email
  await SendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Account created Successfully, Email have been sent!" };
};
