"use server";
import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/utils/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
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

  // TODO: Send Verification  token Email

  return { success: "Account created Successfully, Email have been sent!" };
};
